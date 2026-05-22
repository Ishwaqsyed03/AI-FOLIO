import { generateWithGemini, extractPDFWithGemini } from './geminiProxy';
import { isLocalModelEnabled, runLocalPrompt } from './localModelClient';

// Extract text from a PDF file via the server-side proxy
export const extractTextFromPDF = async (file) => {
  const base64Data = await fileToBase64(file);

  try {
    const text = await extractPDFWithGemini({ base64Data });
    if (!text || text.length < 50) {
      throw new Error('Extracted text is too short. The PDF might be a scanned image.');
    }
    return text;
  } catch (error) {
    // Basic client-side fallback for simple PDFs
    try {
      const fallback = await basicPDFExtraction(base64Data);
      if (fallback && fallback.length > 50) return fallback;
    } catch {
      // ignore fallback failure
    }
    throw new Error(`Failed to read PDF: ${error.message}`);
  }
};

const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

// Lightweight regex-based PDF text fallback (no AI)
const basicPDFExtraction = async (base64Data) => {
  const binaryString = atob(base64Data);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
  let text = new TextDecoder('utf-8', { fatal: false }).decode(bytes);

  let extractedText = '';
  const patterns = [/\(([^)]+)\)/g, /\[([^\]]+)\]/g, /BT\s+(.*?)\s+ET/gs];
  for (const pattern of patterns) {
    let m;
    while ((m = pattern.exec(text)) !== null) {
      if (m[1]) extractedText += m[1] + ' ';
    }
  }
  return extractedText.replace(/[^\x20-\x7E\n]/g, ' ').replace(/\s+/g, ' ').trim();
};

// Parse resume text into structured portfolio data via AI
export const parseResumeWithAI = async (resumeText) => {
  const prompt = `You are a resume parser. Extract the following information from this resume text and return it as a JSON object.

Resume Text:
${resumeText}

Return ONLY a JSON object with this exact structure (no markdown, no extra text):
{
  "name": "Full name",
  "title": "Professional title or role",
  "bio": "2-3 sentence professional summary",
  "skills": ["skill1", "skill2"],
  "experience": [{ "role": "Job title", "company": "Company", "duration": "Date range", "description": "Responsibilities" }],
  "projects": [{ "name": "Project", "description": "Description", "technologies": ["tech1"], "link": "" }],
  "education": [{ "degree": "Degree", "institution": "University", "year": "Year" }],
  "contact": { "email": "", "phone": "", "linkedin": "", "github": "" }
}

Rules: Return ONLY JSON. Include all fields. Use empty strings/arrays when data is absent.`;

  let text = '';

  try {
    text = await generateWithGemini({ prompt, cfg: { maxOutputTokens: 2000, temperature: 0.1 } });
  } catch (err) {
    if (isLocalModelEnabled()) {
      text = await runLocalPrompt({
        prompt,
        systemPrompt: 'You are a strict resume parser. Return only valid JSON.',
        temperature: 0.2,
        maxOutputTokens: 1400,
      });
    } else {
      throw new Error(`Resume parsing failed: ${err.message}`);
    }
  }

  // Strip markdown fences if present
  text = text.trim().replace(/^```json\n?|^```\n?|```$/gm, '').trim();

  let parsedData;
  try {
    parsedData = JSON.parse(text);
  } catch {
    throw new Error('AI returned unexpected format. Try again or paste cleaner resume text.');
  }

  // Apply defaults for missing fields
  parsedData.name = parsedData.name || 'Your Name';
  parsedData.title = parsedData.title || 'Professional Title';
  parsedData.bio = parsedData.bio || '';
  parsedData.skills = Array.isArray(parsedData.skills) && parsedData.skills.length ? parsedData.skills : ['Add your skills'];
  parsedData.experience = Array.isArray(parsedData.experience) && parsedData.experience.length
    ? parsedData.experience
    : [{ role: 'Your Role', company: 'Company Name', duration: 'Date Range', description: 'Add description' }];
  parsedData.projects = Array.isArray(parsedData.projects) && parsedData.projects.length
    ? parsedData.projects
    : [{ name: 'Your Project', description: 'Add description', technologies: parsedData.skills.slice(0, 3), link: '' }];
  parsedData.education = Array.isArray(parsedData.education) && parsedData.education.length
    ? parsedData.education
    : [{ degree: 'Your Degree', institution: 'Institution', year: 'Year' }];
  parsedData.contact = parsedData.contact || {};

  return parsedData;
};
