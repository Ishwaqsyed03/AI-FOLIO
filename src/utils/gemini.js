import { chatWithGemini } from './geminiProxy';
import { isLocalModelEnabled, runLocalChat } from './localModelClient';

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
  conversationHistory.push({ role: 'user', parts: [{ text: message }] });

  try {
    const history = conversationHistory.slice(0, -1);
    const text = await chatWithGemini({
      message,
      history,
      cfg: { maxOutputTokens: 200, temperature: 0.7 },
    });

    conversationHistory.push({ role: 'model', parts: [{ text }] });
    return text;

  } catch (error) {
    // Try local model fallback if available
    if (isLocalModelEnabled()) {
      try {
        const localHistory = conversationHistory
          .slice(1, -1)
          .map((e) => ({
            role: e.role === 'model' ? 'assistant' : 'user',
            content: e.parts?.[0]?.text || '',
          }))
          .filter((e) => e.content.trim());

        const localReply = await runLocalChat({
          systemPrompt,
          history: localHistory,
          message,
          temperature: 0.7,
          maxOutputTokens: 220,
        });

        conversationHistory.push({ role: 'model', parts: [{ text: localReply }] });
        return localReply;
      } catch (localError) {
        throw new Error(`${error.message} — Local fallback also failed: ${localError.message}`);
      }
    }

    throw error;
  }
};

// Generate contextual quick-reply suggestions (pure client logic, no AI)
export const generateSuggestions = (lastBotMessage, collectedData) => {
  const lowerMessage = lastBotMessage.toLowerCase();

  if ((lowerMessage.includes('name') || lowerMessage.includes('call you')) && lowerMessage.includes('?')) {
    return ['John Doe', 'Jane Smith', 'Alex Johnson'];
  }
  if ((lowerMessage.includes('what do you do') || lowerMessage.includes('your role') || lowerMessage.includes('job title') || lowerMessage.includes('professional title')) && !lowerMessage.includes('experience')) {
    return ['Full Stack Developer', 'Frontend Developer', 'UI/UX Designer'];
  }
  if (lowerMessage.includes('about yourself') || lowerMessage.includes('tell me about you') || lowerMessage.includes('describe yourself') || (lowerMessage.includes('bio') && lowerMessage.includes('?'))) {
    return [
      'Passionate developer with 5+ years building web applications',
      'Creative designer focused on user-centered experiences',
      'Problem solver who loves creating innovative solutions',
    ];
  }
  if (lowerMessage.includes('skill') || lowerMessage.includes('technologies') || lowerMessage.includes('tools')) {
    return [
      'JavaScript, React, Node.js, MongoDB, Docker',
      'Python, Django, PostgreSQL, AWS, CI/CD',
      'Figma, Adobe XD, HTML/CSS, Tailwind',
    ];
  }
  if ((lowerMessage.includes('work experience') || lowerMessage.includes('where have you worked') || lowerMessage.includes('previous roles')) && !lowerMessage.includes('project')) {
    return [
      'Senior Software Engineer at Tech Corp (2020-2023)',
      'Frontend Developer at Startup Inc (2019-2022)',
      'Full Stack Developer at Digital Agency (2021-Present)',
    ];
  }
  if (lowerMessage.includes('project') && (lowerMessage.includes('worked on') || lowerMessage.includes('built') || lowerMessage.includes('created'))) {
    return [
      'E-commerce Platform using React, Node.js, and Stripe',
      'Task Management App with Vue.js and Firebase',
      'Social Media Dashboard built with Next.js',
    ];
  }
  if (lowerMessage.includes('education') || lowerMessage.includes('degree') || lowerMessage.includes('studied') || lowerMessage.includes('university')) {
    return [
      'Bachelor of Computer Science, MIT, 2020',
      'Master of Software Engineering, Stanford, 2022',
      'BS Information Technology, State University, 2019',
    ];
  }
  if (lowerMessage.includes('email') || lowerMessage.includes('contact') || lowerMessage.includes('reach you')) {
    return ['john.doe@example.com', 'jane.smith@email.com', 'alex.developer@gmail.com'];
  }
  if (lowerMessage.includes('phone') || lowerMessage.includes('number')) {
    return ['+1 (555) 123-4567', '+44 20 1234 5678', '+91 98765 43210'];
  }
  if (lowerMessage.includes('linkedin')) {
    return ['linkedin.com/in/johndoe', 'linkedin.com/in/janesmith', 'linkedin.com/in/alexjohnson'];
  }
  if (lowerMessage.includes('github') || lowerMessage.includes('git')) {
    return ['github.com/johndoe', 'github.com/janesmith', 'github.com/alexdev'];
  }

  return ["Yes, that's correct", 'Let me provide more details', 'Continue'];
};
