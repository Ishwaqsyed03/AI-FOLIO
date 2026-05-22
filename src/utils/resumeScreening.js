import { generateWithGemini } from './geminiProxy';
import { isLocalModelEnabled, runLocalPrompt } from './localModelClient';

const STOP_WORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'can', 'for', 'from', 'have', 'i', 'in', 'is', 'it', 'job',
  'me', 'my', 'of', 'on', 'or', 'our', 'role', 'skills', 'team', 'the', 'this', 'to', 'we', 'with', 'you', 'your',
  'developer', 'engineer', 'designer', 'manager', 'specialist', 'senior', 'junior', 'lead', 'full', 'stack', 'software',
  'experience', 'work', 'working', 'build', 'built', 'create', 'created', 'using', 'candidate', 'candidates', 'resume',
  'screening', 'tool', 'system', 'ai', 'ats', 'description', 'position', 'company', 'project', 'projects',
]);

const GENERIC_TERMS = new Set([
  'agile', 'collaboration', 'communication', 'cross-functional', 'detail-oriented', 'fast-paced', 'innovative',
  'problem-solving', 'teamwork', 'stakeholders', 'ownership', 'adaptable', 'self-starter', 'motivated', 'results',
  'process', 'optimize', 'optimization', 'research', 'analysis', 'excellent', 'strong', 'effective', 'dynamic',
]);

const LOCATION_MARKERS = [
  'location', 'based in', 'located in', 'office in', 'job location', 'work from', 'onsite in', 'on-site in',
];

const WORK_MODE_TERMS = {
  remote: ['remote', 'work from home', 'wfh', 'distributed'],
  hybrid: ['hybrid'],
  onsite: ['onsite', 'on-site', 'in office', 'in-office'],
};

const ROLE_CATALOG = [
  { role: 'Frontend Developer', keywords: ['react', 'javascript', 'typescript', 'css', 'tailwind', 'ui'] },
  { role: 'Backend Developer', keywords: ['node', 'api', 'express', 'sql', 'postgres', 'microservices'] },
  { role: 'Full Stack Developer', keywords: ['react', 'node', 'api', 'typescript', 'sql', 'aws'] },
  { role: 'Data Analyst', keywords: ['python', 'sql', 'analytics', 'dashboard', 'pandas', 'powerbi'] },
  { role: 'Machine Learning Engineer', keywords: ['ml', 'machine', 'learning', 'nlp', 'bert', 'llm'] },
  { role: 'DevOps Engineer', keywords: ['docker', 'kubernetes', 'ci/cd', 'azure', 'aws', 'terraform'] },
  { role: 'QA Automation Engineer', keywords: ['testing', 'selenium', 'cypress', 'automation', 'qa'] },
  { role: 'UI/UX Designer', keywords: ['figma', 'design', 'prototype', 'ux', 'ui', 'wireframe'] },
  { role: 'Product Engineer', keywords: ['product', 'experimentation', 'analytics', 'full', 'stack'] },
];

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const normalizeText = (value) => (value || '')
  .toLowerCase()
  .replace(/[^a-z0-9+#./\s-]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

const tokenize = (value) => normalizeText(value)
  .match(/[a-z0-9+#.\/-]+/g) || [];

const extractKeywords = (value) => {
  const keywords = [];
  const seen = new Set();

  for (const token of tokenize(value)) {
    if (token.length < 3 || STOP_WORDS.has(token)) {
      continue;
    }

    const keyword = token.replace(/^[^a-z0-9]+|[^a-z0-9]+$/g, '');
    if (!keyword || STOP_WORDS.has(keyword) || seen.has(keyword)) {
      continue;
    }

    seen.add(keyword);
    keywords.push(keyword);
  }

  return keywords;
};

const extractWorkMode = (jobDescription = '') => {
  const lower = normalizeText(jobDescription);
  for (const [mode, aliases] of Object.entries(WORK_MODE_TERMS)) {
    if (aliases.some((alias) => lower.includes(alias))) {
      return mode;
    }
  }
  return 'unspecified';
};

const extractLocationMentions = (jobDescription = '') => {
  const lower = normalizeText(jobDescription);
  const mentions = [];

  for (const marker of LOCATION_MARKERS) {
    const idx = lower.indexOf(marker);
    if (idx >= 0) {
      const slice = lower.slice(idx, idx + 90);
      mentions.push(slice.split(/[.;\n]/)[0].trim());
    }
  }

  const sentenceHits = lower.match(/(remote|hybrid|onsite|on-site|in office|based in|located in)[^.\n]*/g) || [];
  mentions.push(...sentenceHits.map((entry) => entry.trim()));

  return [...new Set(mentions)].slice(0, 5);
};

const buildLocationTokenSet = (locationMentions = []) => {
  const tokens = new Set();
  for (const mention of locationMentions) {
    for (const token of tokenize(mention)) {
      if (token.length >= 3) {
        tokens.add(token);
      }
    }
  }
  return tokens;
};

const classifyJobKeywords = (jobKeywords = [], locationTokens = new Set()) => {
  const requiredSkills = [];
  const softOrContext = [];

  for (const keyword of jobKeywords) {
    if (GENERIC_TERMS.has(keyword) || locationTokens.has(keyword)) {
      softOrContext.push(keyword);
      continue;
    }

    if (/\d+\+?\s*years?|year|month|salary|notice|immediate|join/i.test(keyword)) {
      softOrContext.push(keyword);
      continue;
    }

    requiredSkills.push(keyword);
  }

  return {
    requiredSkills: [...new Set(requiredSkills)],
    softOrContext: [...new Set(softOrContext)],
  };
};

const buildResumeProfileText = (portfolioData = {}) => {
  const sections = [
    portfolioData.name,
    portfolioData.title,
    portfolioData.bio,
    (portfolioData.skills || []).join(' '),
    (portfolioData.experience || [])
      .map((entry) => [entry.role, entry.company, entry.duration, entry.description].filter(Boolean).join(' '))
      .join(' '),
    (portfolioData.projects || [])
      .map((project) => [project.name, project.description, ...(project.technologies || [])].filter(Boolean).join(' '))
      .join(' '),
    (portfolioData.education || [])
      .map((entry) => [entry.degree, entry.institution, entry.year].filter(Boolean).join(' '))
      .join(' '),
    portfolioData.resumeSourceText,
  ].filter(Boolean);

  return sections.join(' ');
};

const findMatchedSkills = (jobKeywords, portfolioData = {}) => {
  const resumeSkills = portfolioData.skills || [];
  const resumeSkillKeywords = new Map();

  for (const skill of resumeSkills) {
    resumeSkillKeywords.set(normalizeText(skill), skill);
  }

  const profileText = normalizeText(buildResumeProfileText(portfolioData));
  const matches = [];

  for (const keyword of jobKeywords) {
    const normalizedKeyword = normalizeText(keyword);
    const exactSkill = resumeSkillKeywords.get(normalizedKeyword);
    const presentInProfile = profileText.includes(normalizedKeyword);

    if (exactSkill) {
      matches.push(exactSkill);
      continue;
    }

    if (presentInProfile) {
      matches.push(keyword);
    }
  }

  return [...new Set(matches)];
};

const summarizeResume = (portfolioData = {}) => {
  const profileBits = [
    portfolioData.name || 'Unknown candidate',
    portfolioData.title || 'Unspecified title',
    (portfolioData.skills || []).slice(0, 8).join(', ') || 'No skills listed',
    (portfolioData.experience || []).length ? `${portfolioData.experience.length} experience entries` : 'No experience entries',
    (portfolioData.projects || []).length ? `${portfolioData.projects.length} projects` : 'No projects listed',
  ];

  return profileBits.join(' • ');
};

const fallbackSuggestions = ({ missingSkills, jobDescription, portfolioData }) => {
  const resumeSkills = portfolioData.skills || [];
  const suggestions = [];

  if (missingSkills.length > 0) {
    suggestions.push(`Mirror the job description wording for: ${missingSkills.slice(0, 5).join(', ')}.`);
  }

  if ((portfolioData.experience || []).length === 0) {
    suggestions.push('Add measurable experience bullets with outcomes, tools, and impact metrics.');
  }

  if ((portfolioData.projects || []).length === 0) {
    suggestions.push('Add 2 to 3 relevant projects that prove the skills listed in your resume.');
  }

  if ((portfolioData.bio || '').length < 80) {
    suggestions.push('Expand your summary so it clearly matches the target role and seniority.');
  }

  if (!resumeSkills.some((skill) => /react|node|python|aws|sql|typescript|docker|ci\/cd/i.test(skill))) {
    suggestions.push('Include the exact tools and frameworks the role expects, if you have used them.');
  }

  if (jobDescription && suggestions.length === 0) {
    suggestions.push('Align your title, summary, and top skills with the language used in the job post.');
  }

  return suggestions.slice(0, 4);
};

const getSectionCoverage = (portfolioData = {}) => {
  const checks = [
    Boolean(portfolioData.name),
    Boolean(portfolioData.title),
    Boolean(portfolioData.bio),
    (portfolioData.skills || []).length > 0,
    (portfolioData.experience || []).length > 0,
    (portfolioData.projects || []).length > 0,
    (portfolioData.education || []).length > 0,
  ];

  return checks.filter(Boolean).length / checks.length;
};

const buildShortlistPrediction = (score, matchedSkills, missingSkills, sectionCoverage) => {
  const fitBoost = matchedSkills.length >= 6 ? 6 : matchedSkills.length >= 3 ? 3 : 0;
  const gapPenalty = missingSkills.length >= 8 ? 10 : missingSkills.length >= 4 ? 5 : 0;
  const rawProbability = score + (sectionCoverage * 10) + fitBoost - gapPenalty;
  const probability = clamp(Math.round(rawProbability), 0, 100);

  let label = 'Low';
  if (probability >= 80) label = 'High';
  else if (probability >= 60) label = 'Moderate';
  else if (probability >= 45) label = 'Borderline';

  return {
    label,
    probability,
    rationale: label === 'High'
      ? 'The resume strongly matches the role and includes most of the requested signals.'
      : label === 'Moderate'
        ? 'The resume is competitive, but a few key keywords and proof points should be added.'
        : 'The resume needs stronger alignment before it is likely to progress.',
  };
};

const suggestBestFitRoles = (portfolioData = {}) => {
  const profileText = buildResumeProfileText(portfolioData);
  const profileTokens = new Set(tokenize(profileText));
  const suggested = [];

  for (const item of ROLE_CATALOG) {
    const matched = item.keywords.filter((keyword) => profileTokens.has(normalizeText(keyword)));
    const fitScore = Math.round((matched.length / item.keywords.length) * 100);
    if (fitScore >= 34) {
      suggested.push({
        role: item.role,
        fitScore,
        evidence: matched.slice(0, 5),
      });
    }
  }

  const title = (portfolioData.title || '').trim();
  if (title) {
    suggested.unshift({
      role: title,
      fitScore: 90,
      evidence: ['Current resume title'],
    });
  }

  const unique = [];
  const seen = new Set();
  for (const item of suggested) {
    const key = item.role.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(item);
    }
  }

  return unique.sort((a, b) => b.fitScore - a.fitScore).slice(0, 6);
};

const buildScore = ({ matchedSkills, jobKeywords, portfolioData }) => {
  if (jobKeywords.length === 0) {
    return 0;
  }

  const coverage = matchedSkills.length / Math.max(1, Math.min(jobKeywords.length, 12));
  const sectionCoverage = getSectionCoverage(portfolioData);
  const titleBoost = jobKeywords.some((keyword) => normalizeText(portfolioData.title || '').includes(keyword)) ? 1 : 0;
  const bioBoost = jobKeywords.some((keyword) => normalizeText(portfolioData.bio || '').includes(keyword)) ? 1 : 0;
  const experienceBoost = (portfolioData.experience || []).some((entry) =>
    jobKeywords.some((keyword) => normalizeText([entry.role, entry.company, entry.description].filter(Boolean).join(' ')).includes(keyword))
  ) ? 1 : 0;

  const rawScore = (
    coverage * 58 +
    sectionCoverage * 22 +
    titleBoost * 8 +
    bioBoost * 6 +
    experienceBoost * 6
  );

  return clamp(Math.round(rawScore), 0, 100);
};

const buildStrictScore = ({ matchedRequiredSkills, requiredSkills, optionalSkills, portfolioData }) => {
  const requiredCoverage = requiredSkills.length
    ? matchedRequiredSkills.length / requiredSkills.length
    : 0;

  const optionalMatched = optionalSkills.filter((keyword) =>
    normalizeText(buildResumeProfileText(portfolioData)).includes(keyword)
  ).length;
  const optionalCoverage = optionalSkills.length ? optionalMatched / optionalSkills.length : 0;
  const sectionCoverage = getSectionCoverage(portfolioData);
  const criticalMissing = Math.max(0, requiredSkills.length - matchedRequiredSkills.length);
  const penalty = criticalMissing >= 6 ? 20 : criticalMissing >= 3 ? 10 : criticalMissing >= 1 ? 5 : 0;

  const strictRaw = (
    requiredCoverage * 68 +
    optionalCoverage * 10 +
    sectionCoverage * 22 -
    penalty
  );

  return clamp(Math.round(strictRaw), 0, 100);
};

const getDeprioritizedKeywords = (jobKeywords = []) => jobKeywords.filter((keyword) => GENERIC_TERMS.has(keyword));

export const buildATSPortfolioDraft = (portfolioData = {}, analysis = {}) => {
  const existingSections = Array.isArray(portfolioData.customSections) ? portfolioData.customSections : [];
  const optimizedSection = {
    title: 'ATS Optimization',
    content: [
      `ATS score: ${analysis.score ?? 0}/100`,
      `Shortlist prediction: ${analysis.shortlistingPrediction?.label || 'Unknown'} (${analysis.shortlistingPrediction?.probability ?? 0}%)`,
      `Add to portfolio focus: ${(analysis.recommendedAdditions || []).join(', ') || 'No additional keywords found.'}`,
      `De-prioritize in tailoring: ${(analysis.deprioritizedKeywords || []).join(', ') || 'No generic keywords identified.'}`,
    ].join('\n'),
  };

  const filteredSections = existingSections.filter((section) => (section.title || '').trim().toLowerCase() !== 'ats optimization');

  return {
    ...portfolioData,
    atsAnalysis: analysis,
    atsTailoredSummary: analysis.tailoredSummary || portfolioData.bio || '',
    customSections: [...filteredSections, optimizedSection],
  };
};

const parseModelResponse = (text) => {
  let cleaned = (text || '').trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/```json\n?/g, '').replace(/```\n?/g, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/```\n?/g, '');
  }

  return JSON.parse(cleaned);
};

const buildTailoredSummary = (portfolioData = {}, jobKeywords = []) => {
  const title = portfolioData.title || 'professional';
  const topKeywords = jobKeywords.slice(0, 5).join(', ');
  const experienceCount = (portfolioData.experience || []).length;
  return `Focused ${title.toLowerCase()} with ${experienceCount} experience block${experienceCount === 1 ? '' : 's'} and hands-on work in ${topKeywords || 'relevant technologies'}.`;
};

const getAIFeedback = async ({ portfolioData, jobDescription, matchedSkills, missingSkills, score }) => {
  const prompt = `You are a recruiter-facing ATS assistant. Review the resume profile and job description, then return only JSON with this structure:
{
  "summary": "1-2 sentence recruiter summary",
  "suggestions": ["actionable improvement 1", "actionable improvement 2", "actionable improvement 3"],
  "resumeLine": "A polished resume bullet in past tense",
  "recruiterNotes": ["short note 1", "short note 2"]
}

ATS score: ${score}
Matched skills: ${matchedSkills.join(', ') || 'none'}
Missing skills: ${missingSkills.join(', ') || 'none'}

Resume profile:
${summarizeResume(portfolioData)}

Full resume text:
${buildResumeProfileText(portfolioData)}

Job description:
${jobDescription}`;

  try {
    const text = await generateWithGemini({ prompt, cfg: { maxOutputTokens: 900, temperature: 0.3 } });
    return parseModelResponse(text);
  } catch (error) {
    if (isLocalModelEnabled()) {
      try {
        const localText = await runLocalPrompt({
          prompt,
          systemPrompt: 'You are a recruiter ATS assistant. Return only valid JSON with no markdown.',
          temperature: 0.3,
          maxOutputTokens: 900,
        });
        return parseModelResponse(localText);
      } catch (localError) {
        console.warn('Local ATS feedback fallback failed:', localError);
      }
    }

    return null;
  }
};

export const analyzeResumeAgainstJobDescription = async (portfolioData = {}, jobDescription = '') => {
  const cleanedJobDescription = jobDescription.trim();
  if (!cleanedJobDescription) {
    throw new Error('Please paste a job description to generate an ATS score.');
  }

  const workMode = extractWorkMode(cleanedJobDescription);
  const locationMentions = extractLocationMentions(cleanedJobDescription);
  const locationTokens = buildLocationTokenSet(locationMentions);

  const jobKeywords = extractKeywords(cleanedJobDescription);
  const { requiredSkills, softOrContext } = classifyJobKeywords(jobKeywords, locationTokens);
  const matchedRequiredSkills = findMatchedSkills(requiredSkills, portfolioData);
  const missingSkills = requiredSkills.filter(
    (keyword) => !matchedRequiredSkills.some((match) => normalizeText(match).includes(keyword))
  );

  const optionalSkills = softOrContext.filter((item) => !GENERIC_TERMS.has(item));
  const strictScore = buildStrictScore({
    matchedRequiredSkills,
    requiredSkills,
    optionalSkills,
    portfolioData,
  });

  const baselineScore = buildScore({ matchedSkills: matchedRequiredSkills, jobKeywords: requiredSkills, portfolioData });
  const score = Math.round((strictScore * 0.8) + (baselineScore * 0.2));
  const sectionCoverage = getSectionCoverage(portfolioData);
  const recommendedAdditions = missingSkills.filter((keyword) => !GENERIC_TERMS.has(keyword)).slice(0, 8);
  const deprioritizedKeywords = [...getDeprioritizedKeywords(jobKeywords), ...locationMentions].slice(0, 8);
  const shortlistingPrediction = buildShortlistPrediction(score, matchedRequiredSkills, missingSkills, sectionCoverage);
  const suggestedJobRoles = suggestBestFitRoles(portfolioData);

  const localSuggestions = fallbackSuggestions({ missingSkills, jobDescription: cleanedJobDescription, portfolioData });

  let aiFeedback = null;
  try {
    aiFeedback = await getAIFeedback({
      portfolioData,
      jobDescription: cleanedJobDescription,
      matchedSkills: matchedRequiredSkills,
      missingSkills,
      score,
    });
  } catch (error) {
    if (!isGeminiInvalidKeyError(error)) {
      console.warn('ATS suggestion generation failed:', error);
    }
  }

  const suggestions = Array.isArray(aiFeedback?.suggestions) && aiFeedback.suggestions.length > 0
    ? aiFeedback.suggestions
    : localSuggestions;

  return {
    score,
    strictScore,
    summary: aiFeedback?.summary || summarizeResume(portfolioData),
    tailoredSummary: aiFeedback?.summary || buildTailoredSummary(portfolioData, jobKeywords),
    suggestions,
    recruiterNotes: Array.isArray(aiFeedback?.recruiterNotes) ? aiFeedback.recruiterNotes : [],
    resumeLine: aiFeedback?.resumeLine || 'Built an AI-based resume screening tool using NLP and LLMs to match candidates with job descriptions and generate improvement suggestions.',
    matchedSkills: matchedRequiredSkills,
    missingSkills,
    recommendedAdditions,
    deprioritizedKeywords,
    suggestedJobRoles,
    jobContext: {
      workMode,
      locationMentions,
      requiredSkillCount: requiredSkills.length,
    },
    shortlistingPrediction,
    matchedCount: matchedRequiredSkills.length,
    keywordCount: requiredSkills.length,
    keywordCoverage: requiredSkills.length ? Math.round((matchedRequiredSkills.length / requiredSkills.length) * 100) : 0,
  };
};
