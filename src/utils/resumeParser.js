import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

let genAI;
let model;

if (API_KEY) {
  genAI = new GoogleGenerativeAI(API_KEY);
  model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
}

// Extract text from PDF file using Gemini's vision capabilities
export const extractTextFromPDF = async (file) => {
  try {
    console.log('📄 Starting PDF extraction for:', file.name);
    
    // Convert PDF to base64
    const base64Data = await fileToBase64(file);
    
    console.log('📄 PDF converted to base64, length:', base64Data.length);
    
    // Use Gemini to read the PDF directly
    const text = await extractWithGemini(base64Data);
    
    console.log('📄 Text extracted from PDF, length:', text.length);
    console.log('📄 First 500 chars:', text.substring(0, 500));
    
    if (!text || text.length < 50) {
      throw new Error('Extracted text is too short. The PDF might be an image or encrypted.');
    }
    
    return text;
  } catch (error) {
    console.error('❌ PDF extraction error:', error);
    throw new Error(`Failed to read PDF: ${error.message}`);
  }
};

// Convert file to base64
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result.split(',')[1]; // Remove data:application/pdf;base64, prefix
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Use Gemini to extract text from PDF
const extractWithGemini = async (base64Data) => {
  if (!model) {
    throw new Error('Gemini API key not configured');
  }

  const prompt = `Extract all text content from this PDF document. Return only the raw text, no formatting or explanations. Include all information: names, contact details, work experience, education, skills, projects, etc.`;

  try {
    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: 'application/pdf',
          data: base64Data
        }
      },
      prompt
    ]);

    const response = await result.response;
    const text = response.text();
    
    return text;
  } catch (error) {
    console.error('❌ Gemini PDF extraction error:', error);
    
    // Fallback: try basic text extraction
    try {
      console.log('⚠️ Trying fallback text extraction method...');
      const fallbackText = await basicPDFExtraction(base64Data);
      if (fallbackText && fallbackText.length > 50) {
        return fallbackText;
      }
    } catch (fallbackError) {
      console.error('❌ Fallback extraction also failed:', fallbackError);
    }
    
    throw new Error('Could not extract text from PDF. Please ensure the PDF contains selectable text (not a scanned image).');
  }
};

// Basic PDF text extraction fallback
const basicPDFExtraction = async (base64Data) => {
  // Decode base64 to binary
  const binaryString = atob(base64Data);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  
  // Convert to text
  const decoder = new TextDecoder('utf-8', { fatal: false });
  let text = decoder.decode(bytes);
  
  // Extract text between common PDF text markers
  const patterns = [
    /\(([^)]+)\)/g,  // Text in parentheses
    /\[([^\]]+)\]/g, // Text in brackets
    /BT\s+(.*?)\s+ET/gs, // Between BT (Begin Text) and ET (End Text)
  ];
  
  let extractedText = '';
  
  for (const pattern of patterns) {
    let matches;
    while ((matches = pattern.exec(text)) !== null) {
      if (matches[1]) {
        extractedText += matches[1] + ' ';
      }
    }
  }
  
  // Clean up
  extractedText = extractedText
    .replace(/[^\x20-\x7E\n]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  
  return extractedText;
};

// Use Gemini AI to parse resume data from text
export const parseResumeWithAI = async (resumeText) => {
  if (!model) {
    throw new Error('Gemini API key not configured.');
  }

  const prompt = `You are a resume parser. Extract the following information from this resume text and return it in a structured JSON format:

Resume Text:
${resumeText}

Please extract and return ONLY a JSON object with this exact structure (no additional text):
{
  "name": "Full name of the person",
  "title": "Professional title or role (e.g., 'Full Stack Developer')",
  "bio": "A brief 2-3 sentence professional summary or objective",
  "skills": ["skill1", "skill2", "skill3", ...],
  "experience": [
    {
      "role": "Job title",
      "company": "Company name",
      "duration": "Date range (e.g., '2020-2023' or 'Jan 2020 - Present')",
      "description": "Brief description of responsibilities"
    }
  ],
  "projects": [
    {
      "name": "Project name",
      "description": "Project description",
      "technologies": ["tech1", "tech2", ...],
      "link": "Project link if available, otherwise empty string"
    }
  ],
  "education": [
    {
      "degree": "Degree name",
      "institution": "University/College name",
      "year": "Graduation year or date range"
    }
  ],
  "contact": {
    "email": "Email address",
    "phone": "Phone number",
    "linkedin": "LinkedIn profile (without https://)",
    "github": "GitHub profile (without https://)"
  }
}

Important: 
- Return ONLY the JSON object, no markdown formatting, no explanations
- Always include all fields even if some information is not found (use empty strings or empty arrays)
- Ensure all arrays are properly populated with at least one item if data exists`;

  try {
    console.log('🤖 Sending text to Gemini for parsing...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    
    console.log('🤖 Gemini AI response length:', text.length);
    console.log('🤖 First 200 chars of response:', text.substring(0, 200));
    
    // Clean up the response
    text = text.trim();
    
    // Remove markdown code blocks if present
    if (text.startsWith('```json')) {
      text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (text.startsWith('```')) {
      text = text.replace(/```\n?/g, '');
    }
    
    console.log('🤖 Cleaned response for parsing');
    
    // Parse JSON
    let parsedData;
    try {
      parsedData = JSON.parse(text);
      console.log('✅ JSON parsed successfully');
    } catch (jsonError) {
      console.error('❌ JSON parse error:', jsonError);
      console.error('❌ Problematic text:', text);
      throw new Error('AI response was not valid JSON. The resume format might be unusual.');
    }
    
    // Validate required fields
    if (!parsedData.name || !parsedData.title) {
      console.warn('⚠️ Missing name or title, using defaults');
      parsedData.name = parsedData.name || 'Your Name';
      parsedData.title = parsedData.title || 'Professional Title';
    }
    
    // Ensure arrays exist
    parsedData.skills = Array.isArray(parsedData.skills) ? parsedData.skills : [];
    parsedData.experience = Array.isArray(parsedData.experience) ? parsedData.experience : [];
    parsedData.projects = Array.isArray(parsedData.projects) ? parsedData.projects : [];
    parsedData.education = Array.isArray(parsedData.education) ? parsedData.education : [];
    parsedData.contact = parsedData.contact || {};
    
    // Add default values if arrays are empty
    if (parsedData.skills.length === 0) {
      console.warn('⚠️ No skills found, adding placeholder');
      parsedData.skills = ['Add your skills'];
    }
    if (parsedData.experience.length === 0) {
      console.warn('⚠️ No experience found, adding placeholder');
      parsedData.experience = [{
        role: 'Your Role',
        company: 'Company Name',
        duration: 'Date Range',
        description: 'Add your experience description'
      }];
    }
    if (parsedData.projects.length === 0) {
      console.warn('⚠️ No projects found, adding placeholder');
      parsedData.projects = [{
        name: 'Your Project',
        description: 'Add project description',
        technologies: parsedData.skills.slice(0, 3),
        link: ''
      }];
    }
    if (parsedData.education.length === 0) {
      console.warn('⚠️ No education found, adding placeholder');
      parsedData.education = [{
        degree: 'Your Degree',
        institution: 'Institution Name',
        year: 'Year'
      }];
    }
    
    console.log('✅ Parsed resume data with all fields:', parsedData);
    return parsedData;
  } catch (error) {
    console.error('❌ Error parsing resume with AI:', error);
    
    if (error.message.includes('JSON')) {
      throw new Error('Could not understand the resume format. The AI response was not properly structured.');
    } else if (error.message.includes('API')) {
      throw new Error('Gemini API error. Please check your API key or try again later.');
    } else {
      throw new Error(`Failed to parse resume: ${error.message}`);
    }
  }
};
