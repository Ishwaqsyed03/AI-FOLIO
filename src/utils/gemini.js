import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

console.log('API Key loaded:', API_KEY ? 'Yes (length: ' + API_KEY.length + ')' : 'No');

let genAI;
let model;

if (API_KEY) {
  genAI = new GoogleGenerativeAI(API_KEY);
  model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  console.log('Gemini model initialized successfully');
}

const conversationHistory = [];

const systemPrompt = `You are an AI assistant helping users create their professional portfolio. Your job is to collect the following information through friendly conversation:

1. Full Name
2. Professional Title/Role (e.g., "Full Stack Developer", "UI/UX Designer")
3. Brief Bio/About Me (2-3 sentences)
4. Skills (at least 5 skills)
5. Work Experience (at least 1-2 positions with company, role, and duration)
6. Projects (at least 2-3 projects with name, description, and technologies used)
7. Education (degree, institution, year)
8. Contact Information (email, phone, LinkedIn, GitHub)

Guidelines:
- Ask ONE question at a time
- Be conversational and friendly
- Validate and confirm information
- If user provides multiple pieces of info at once, acknowledge all and continue
- Keep responses concise (2-3 sentences max)
- When all information is collected, say "PORTFOLIO_COMPLETE" followed by a summary

Start by greeting the user and asking for their name.`;

export const initializeChat = () => {
  conversationHistory.length = 0;
  conversationHistory.push({
    role: 'user',
    parts: [{ text: systemPrompt }],
  });
};

export const sendMessage = async (message) => {
  if (!model) {
    throw new Error('Gemini API key not configured. Please add VITE_GEMINI_API_KEY to your .env file.');
  }

  try {
    conversationHistory.push({
      role: 'user',
      parts: [{ text: message }],
    });

    const chat = model.startChat({
      history: conversationHistory.slice(0, -1),
      generationConfig: {
        maxOutputTokens: 200,
        temperature: 0.7,
      },
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    conversationHistory.push({
      role: 'model',
      parts: [{ text }],
    });

    return text;
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw error;
  }
};

export const parsePortfolioData = (conversationText) => {
  // Simple parser - in production, you might want to use Gemini to extract structured data
  const data = {
    name: '',
    title: '',
    bio: '',
    skills: [],
    experience: [],
    projects: [],
    education: [],
    contact: {
      email: '',
      phone: '',
      linkedin: '',
      github: '',
    },
  };

  // This is a placeholder - in a real implementation, you'd use NLP or ask Gemini to format the data
  return data;
};

// Generate contextual suggestions based on the conversation state
export const generateSuggestions = (lastBotMessage, collectedData) => {
  const lowerMessage = lastBotMessage.toLowerCase();

  // Name question - check for specific name-related words
  if ((lowerMessage.includes('name') || lowerMessage.includes('call you')) && lowerMessage.includes('?')) {
    return ['John Doe', 'Jane Smith', 'Alex Johnson'];
  }

  // Title/Role question - be more specific
  if ((lowerMessage.includes('what do you do') || lowerMessage.includes('your role') || lowerMessage.includes('job title') || lowerMessage.includes('professional title')) && !lowerMessage.includes('experience')) {
    return ['Full Stack Developer', 'Frontend Developer', 'UI/UX Designer'];
  }

  // Bio/About question
  if (lowerMessage.includes('about yourself') || lowerMessage.includes('tell me about you') || lowerMessage.includes('describe yourself') || (lowerMessage.includes('bio') && lowerMessage.includes('?'))) {
    return [
      'Passionate developer with 5+ years building web applications',
      'Creative designer focused on user-centered experiences',
      'Problem solver who loves creating innovative solutions',
    ];
  }

  // Skills question
  if (lowerMessage.includes('skill') || lowerMessage.includes('technologies') || lowerMessage.includes('tools')) {
    return [
      'JavaScript, React, Node.js, MongoDB, Docker',
      'Python, Django, PostgreSQL, AWS, CI/CD',
      'Figma, Adobe XD, HTML/CSS, Tailwind',
    ];
  }

  // Experience question
  if ((lowerMessage.includes('work experience') || lowerMessage.includes('where have you worked') || lowerMessage.includes('previous roles')) && !lowerMessage.includes('project')) {
    return [
      'Senior Software Engineer at Tech Corp (2020-2023)',
      'Frontend Developer at Startup Inc (2019-2022)',
      'Full Stack Developer at Digital Agency (2021-Present)',
    ];
  }

  // Projects question
  if (lowerMessage.includes('project') && (lowerMessage.includes('worked on') || lowerMessage.includes('built') || lowerMessage.includes('created'))) {
    return [
      'E-commerce Platform using React, Node.js, and Stripe',
      'Task Management App with Vue.js and Firebase',
      'Social Media Dashboard built with Next.js',
    ];
  }

  // Education question
  if (lowerMessage.includes('education') || lowerMessage.includes('degree') || lowerMessage.includes('studied') || lowerMessage.includes('university')) {
    return [
      'Bachelor of Computer Science, MIT, 2020',
      'Master of Software Engineering, Stanford, 2022',
      'BS Information Technology, State University, 2019',
    ];
  }

  // Contact/Email question
  if (lowerMessage.includes('email') || lowerMessage.includes('contact') || lowerMessage.includes('reach you')) {
    return [
      'john.doe@example.com',
      'jane.smith@email.com',
      'alex.developer@gmail.com',
    ];
  }

  // Phone question
  if (lowerMessage.includes('phone') || lowerMessage.includes('number')) {
    return [
      '+1 (555) 123-4567',
      '+44 20 1234 5678',
      '+91 98765 43210',
    ];
  }

  // LinkedIn question
  if (lowerMessage.includes('linkedin')) {
    return [
      'linkedin.com/in/johndoe',
      'linkedin.com/in/janesmith',
      'linkedin.com/in/alexjohnson',
    ];
  }

  // GitHub question
  if (lowerMessage.includes('github') || lowerMessage.includes('git')) {
    return [
      'github.com/johndoe',
      'github.com/janesmith',
      'github.com/alexdev',
    ];
  }

  // Default suggestions for confirmation
  return ['Yes, that\'s correct', 'Let me provide more details', 'Continue'];
};
