const HF_API_KEY = import.meta.env.VITE_HF_API_KEY;
const HF_RESUME_NER_MODEL = import.meta.env.VITE_HF_RESUME_NER_MODEL || 'jjzha/jobbert_skill_extraction';

const TOKEN_CLASSIFICATION_URL = (model) =>
  `https://api-inference.huggingface.co/models/${encodeURIComponent(model)}`;

const splitIntoChunks = (text, maxSize = 1800) => {
  if (!text) return [];
  const cleaned = text.replace(/\s+/g, ' ').trim();
  if (cleaned.length <= maxSize) return [cleaned];

  const chunks = [];
  let start = 0;

  while (start < cleaned.length) {
    let end = Math.min(start + maxSize, cleaned.length);

    if (end < cleaned.length) {
      const breakAt = cleaned.lastIndexOf(' ', end);
      if (breakAt > start + Math.floor(maxSize * 0.6)) {
        end = breakAt;
      }
    }

    chunks.push(cleaned.slice(start, end).trim());
    start = end;
  }

  return chunks.filter(Boolean);
};

const stripWordArtifacts = (word) =>
  (word || '')
    .replace(/^##/, '')
    .replace(/^\u2581/, '')
    .replace(/\s+/g, ' ')
    .trim();

const normalizeEntityLabel = (entity = '') =>
  entity
    .replace(/^B-/, '')
    .replace(/^I-/, '')
    .toUpperCase();

const queryTokenClassification = async (chunk, model) => {
  let response;
  try {
    response = await fetch(TOKEN_CLASSIFICATION_URL(model), {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${HF_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: chunk,
        options: { wait_for_model: true }
      })
    });
  } catch (error) {
    throw new Error('Network request could not reach HuggingFace (possible CORS, firewall, VPN, or offline connection).');
  }

  let data = null;
  try {
    data = await response.json();
  } catch (error) {
    data = null;
  }

  if (!response.ok) {
    const detail = typeof data?.error === 'string' ? data.error : 'Inference request failed';
    throw new Error(detail);
  }

  if (!Array.isArray(data)) {
    return [];
  }

  return data;
};

const dedupe = (items) => [...new Set(items.filter(Boolean).map((v) => v.trim()).filter(Boolean))];

const extractSection = (text, headingCandidates) => {
  const headingPattern = headingCandidates.join('|');
  const regex = new RegExp(
    `(?:^|\\n)\\s*(?:${headingPattern})\\s*:?\\s*\\n?([\\s\\S]*?)(?=(?:\\n\\s*[A-Z][A-Za-z\\s]{2,30}\\s*:?\\s*\\n)|$)`,
    'i'
  );
  const match = text.match(regex);
  if (!match) return '';
  return match[1].replace(/\n+/g, '\n').trim();
};

const splitListLike = (sectionText) => {
  if (!sectionText) return [];

  return sectionText
    .split(/\n|\u2022|\-|\*|,/)
    .map((line) => line.replace(/\s+/g, ' ').trim())
    .filter((line) => line.length > 1);
};

const extractContact = (text) => {
  const emailMatch = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  const phoneMatch = text.match(/(?:\+?\d{1,3}[\s-]?)?(?:\(?\d{2,4}\)?[\s-]?)?\d{3,4}[\s-]?\d{3,4}/);
  const linkedinMatch = text.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/[A-Za-z0-9\-_/]+/i);
  const githubMatch = text.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/[A-Za-z0-9\-_/]+/i);

  const cleanup = (value = '') => value.replace(/^https?:\/\//i, '').replace(/\/$/, '');

  return {
    email: emailMatch?.[0] || '',
    phone: phoneMatch?.[0] || '',
    linkedin: linkedinMatch ? cleanup(linkedinMatch[0]) : '',
    github: githubMatch ? cleanup(githubMatch[0]) : ''
  };
};

const inferTitle = (text, skillList) => {
  const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const likelyTitle = lines.find((line) => /engineer|developer|designer|manager|analyst|architect|scientist/i.test(line));

  if (likelyTitle) return likelyTitle;

  if (skillList.length > 0) {
    if (skillList.some((s) => /react|javascript|typescript|node/i.test(s))) return 'Full Stack Developer';
    if (skillList.some((s) => /ui|ux|figma|design/i.test(s))) return 'Product Designer';
    if (skillList.some((s) => /python|ml|ai|tensorflow|pytorch/i.test(s))) return 'Machine Learning Engineer';
  }

  return 'Professional';
};

const inferName = (text) => {
  const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const firstLine = lines[0] || '';

  if (/^[A-Za-z][A-Za-z\s'.-]{2,50}$/.test(firstLine) && firstLine.split(' ').length <= 5) {
    return firstLine;
  }

  return 'Your Name';
};

const buildExperienceItems = (entries) => {
  if (entries.length === 0) {
    return [
      {
        role: 'Your Role',
        company: 'Company Name',
        duration: 'Date Range',
        description: 'Add your experience highlights'
      }
    ];
  }

  return entries.slice(0, 4).map((entry) => ({
    role: 'Professional Experience',
    company: 'Organization',
    duration: 'Recent',
    description: entry
  }));
};

const buildProjectItems = (entries, skills) => {
  if (entries.length === 0) {
    return [
      {
        name: 'Featured Project',
        description: 'Add your project details',
        technologies: skills.slice(0, 4),
        link: ''
      }
    ];
  }

  return entries.slice(0, 4).map((entry, index) => ({
    name: `Project ${index + 1}`,
    description: entry,
    technologies: skills.slice(0, 4),
    link: ''
  }));
};

const buildEducationItems = (text) => {
  const educationSection = extractSection(text, ['education', 'academic background', 'qualification', 'certifications']);
  const entries = splitListLike(educationSection);

  if (entries.length === 0) {
    return [{ degree: 'Degree', institution: 'Institution Name', year: 'Year' }];
  }

  return entries.slice(0, 3).map((entry) => ({
    degree: entry,
    institution: 'Institution',
    year: 'Year'
  }));
};

const fallbackExtraction = (text) => {
  const skillsSection = extractSection(text, ['skills', 'technical skills', 'core skills', 'technologies']);
  const experienceSection = extractSection(text, ['experience', 'work experience', 'employment history', 'career history']);
  const projectsSection = extractSection(text, ['projects', 'project experience', 'key projects', 'portfolio']);

  const skills = dedupe(splitListLike(skillsSection)).slice(0, 20);
  const experience = dedupe(splitListLike(experienceSection)).slice(0, 10);
  const projects = dedupe(splitListLike(projectsSection)).slice(0, 10);

  return { skills, experience, projects };
};

const parseNEROutput = (results) => {
  const skills = [];
  const experience = [];
  const projects = [];

  for (const entity of results) {
    const label = normalizeEntityLabel(entity.entity_group || entity.entity || '');
    const value = stripWordArtifacts(entity.word);
    if (!value) continue;

    if (/SKILL|TECH|TOOL|LANGUAGE|FRAMEWORK/.test(label)) {
      skills.push(value);
      continue;
    }

    if (/PROJECT|PRODUCT|ACHIEVEMENT/.test(label)) {
      projects.push(value);
      continue;
    }

    if (/EXPERIENCE|ROLE|JOB|POSITION|ORG|COMPANY/.test(label)) {
      experience.push(value);
    }
  }

  return {
    skills: dedupe(skills),
    experience: dedupe(experience),
    projects: dedupe(projects)
  };
};

export const extractPortfolioFromTextWithHF = async (rawText) => {
  const text = (rawText || '').trim();

  if (!text || text.length < 80) {
    throw new Error('Please paste at least a short resume/LinkedIn summary before extracting.');
  }

  if (!HF_API_KEY) {
    throw new Error('HuggingFace API key is missing. Add VITE_HF_API_KEY in your .env file.');
  }

  const chunks = splitIntoChunks(text);
  let allEntities = [];

  try {
    for (const chunk of chunks) {
      const entities = await queryTokenClassification(chunk, HF_RESUME_NER_MODEL);
      allEntities = allEntities.concat(entities);
    }
  } catch (error) {
    throw new Error(`HuggingFace NER failed: ${error.message}`);
  }

  const nerParsed = parseNEROutput(allEntities);
  const fallback = fallbackExtraction(text);

  const skills = dedupe([...nerParsed.skills, ...fallback.skills]).slice(0, 24);
  const experience = dedupe([...nerParsed.experience, ...fallback.experience]).slice(0, 10);
  const projects = dedupe([...nerParsed.projects, ...fallback.projects]).slice(0, 10);

  const name = inferName(text);
  const title = inferTitle(text, skills);

  return {
    name,
    title,
    bio: `Results auto-generated from your pasted profile using HuggingFace NER and section parsing.`,
    skills: skills.length > 0 ? skills : ['Add your skills'],
    experience: buildExperienceItems(experience),
    projects: buildProjectItems(projects, skills),
    education: buildEducationItems(text),
    contact: extractContact(text)
  };
};

export const extractPortfolioFromTextHeuristic = (rawText) => {
  const text = (rawText || '').trim();

  if (!text || text.length < 40) {
    throw new Error('Please paste more profile details so we can extract meaningful data.');
  }

  const fallback = fallbackExtraction(text);
  const skills = dedupe(fallback.skills).slice(0, 24);
  const experience = dedupe(fallback.experience).slice(0, 10);
  const projects = dedupe(fallback.projects).slice(0, 10);
  const name = inferName(text);
  const title = inferTitle(text, skills);

  return {
    name,
    title,
    bio: 'Generated using local heuristic parsing while external AI services were unavailable.',
    skills: skills.length > 0 ? skills : ['Add your skills'],
    experience: buildExperienceItems(experience),
    projects: buildProjectItems(projects, skills),
    education: buildEducationItems(text),
    contact: extractContact(text)
  };
};
