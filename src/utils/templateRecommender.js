const STOP_WORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'if', 'then', 'for', 'to', 'of', 'in', 'on', 'at', 'by', 'with',
  'from', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'this', 'that', 'these', 'those', 'as', 'it',
  'its', 'into', 'your', 'you', 'i', 'we', 'our', 'my', 'me', 'about'
]);

const tokenize = (text) => {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((token) => token.length > 1 && !STOP_WORDS.has(token));
};

const joinArrayValues = (value) => {
  if (!Array.isArray(value)) return '';
  return value
    .map((item) => {
      if (typeof item === 'string') return item;
      if (typeof item === 'object' && item) return Object.values(item).join(' ');
      return '';
    })
    .join(' ');
};

const buildProfileText = (portfolioData) => {
  if (!portfolioData) return '';

  return [
    portfolioData.name,
    portfolioData.title,
    portfolioData.bio,
    joinArrayValues(portfolioData.skills),
    joinArrayValues(portfolioData.projects),
    joinArrayValues(portfolioData.experience),
    joinArrayValues(portfolioData.education),
    portfolioData.contact?.linkedin,
    portfolioData.contact?.github
  ]
    .filter(Boolean)
    .join(' ');
};

const templateToDocument = (template) => [
  template.name,
  template.description,
  Array.isArray(template.tags) ? template.tags.join(' ') : ''
]
  .filter(Boolean)
  .join(' ');

const termFrequencyMap = (tokens) => {
  const tf = new Map();
  for (const token of tokens) {
    tf.set(token, (tf.get(token) || 0) + 1);
  }
  return tf;
};

const magnitude = (vector) => Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0));

const cosineSimilarity = (a, b) => {
  const magA = magnitude(a);
  const magB = magnitude(b);
  if (magA === 0 || magB === 0) return 0;

  let dot = 0;
  for (let i = 0; i < a.length; i += 1) {
    dot += a[i] * b[i];
  }
  return dot / (magA * magB);
};

export const getTemplateRecommendations = (portfolioData, templates) => {
  if (!portfolioData || !Array.isArray(templates) || templates.length === 0) {
    return [];
  }

  const profileTokens = tokenize(buildProfileText(portfolioData));
  if (profileTokens.length === 0) return [];

  const templateTokenDocs = templates.map((template) => tokenize(templateToDocument(template)));

  const docs = [profileTokens, ...templateTokenDocs];
  const vocabulary = [...new Set(docs.flat())];

  const idf = new Map();
  for (const term of vocabulary) {
    const docsContainingTerm = docs.reduce((count, doc) => count + (doc.includes(term) ? 1 : 0), 0);
    idf.set(term, Math.log((docs.length + 1) / (docsContainingTerm + 1)) + 1);
  }

  const toTfidfVector = (tokens) => {
    const tf = termFrequencyMap(tokens);
    const tokenCount = tokens.length || 1;

    return vocabulary.map((term) => {
      const normalizedTf = (tf.get(term) || 0) / tokenCount;
      return normalizedTf * (idf.get(term) || 0);
    });
  };

  const profileVector = toTfidfVector(profileTokens);

  return templates
    .map((template, index) => {
      const templateVector = toTfidfVector(templateTokenDocs[index]);
      const similarity = cosineSimilarity(profileVector, templateVector);
      return {
        templateId: template.id,
        score: similarity,
        confidence: Math.round(Math.max(0, Math.min(1, similarity)) * 100)
      };
    })
    .sort((a, b) => b.score - a.score);
};
