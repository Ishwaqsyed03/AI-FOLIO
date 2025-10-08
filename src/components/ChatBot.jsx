import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, Sparkles, CheckCircle, Upload, FileText } from 'lucide-react';
import { initializeChat, sendMessage, generateSuggestions } from '../utils/gemini';
import { extractTextFromPDF, parseResumeWithAI } from '../utils/resumeParser';

const ChatBot = ({ onDataComplete }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [collectedData, setCollectedData] = useState({});
  const [uploadingPDF, setUploadingPDF] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');
  const [progressError, setProgressError] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const initialMessageShownRef = useRef(false);

  useEffect(() => {
    initializeChat();
    // Send initial greeting
    handleInitialMessage();
  }, []);

  useEffect(() => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    // If first message (bot greeting), do not auto-scroll
    if (!initialMessageShownRef.current && messages.length === 1) {
      initialMessageShownRef.current = true;
      return; // skip auto scroll for greeting
    }
    // Determine if user is near bottom (within 120px) OR last message from user
    const last = messages[messages.length - 1];
    const nearBottom = (container.scrollHeight - container.scrollTop - container.clientHeight) < 120;
    const shouldScroll = nearBottom || (last && last.role === 'user');
    if (shouldScroll) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleInitialMessage = async () => {
    setIsLoading(true);
    try {
      const response = await sendMessage('Hello');
      const botMessage = {
        role: 'bot',
        content: response,
        timestamp: new Date(),
      };
      setMessages([botMessage]);
      setSuggestions(generateSuggestions(response, collectedData));
    } catch (error) {
      console.error('Initial message error:', error);
      const errorMessage = {
        role: 'bot',
        content: `Error: ${error.message || 'Please configure your Gemini API key in the .env file. Copy .env.example to .env and add your API key.'}`,
        timestamp: new Date(),
      };
      setMessages([errorMessage]);
    }
    setIsLoading(false);
  };

  const handleSend = async (text = input) => {
    if (!text.trim() || isLoading) return;

    const userMessage = {
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setSuggestions([]);

    try {
      const response = await sendMessage(text);
      
      // Check if portfolio is complete
      if (response.includes('PORTFOLIO_COMPLETE')) {
        const botMessage = {
          role: 'bot',
          content: response.replace('PORTFOLIO_COMPLETE', '').trim(),
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMessage]);
        
        // Extract data from conversation
        setTimeout(() => {
          const allMsgs = [...messages, userMessage, botMessage];
          const extractedData = extractPortfolioData(allMsgs);
          console.log('Extracted Portfolio Data:', extractedData);
          onDataComplete(extractedData);
        }, 2000);
      } else {
        const botMessage = {
          role: 'bot',
          content: response,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMessage]);
        
        // Generate suggestions for the next response
        setSuggestions(generateSuggestions(response, collectedData));
      }
    } catch (error) {
      const errorMessage = {
        role: 'bot',
        content: 'Sorry, I encountered an error. Please make sure your API key is configured correctly.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    }

    setIsLoading(false);
  };

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion);
    const el = inputRef.current;
    if (!el) return;
    try {
      el.focus({ preventScroll: true });
    } catch (err) {
      const x = window.scrollX || window.pageXOffset;
      const y = window.scrollY || window.pageYOffset;
      el.focus();
      window.scrollTo(x, y);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handlePDFUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file');
      return;
    }

    setUploadingPDF(true);
    setProgress(0);
    setProgressError(false);
    setProgressMessage('Initializing extraction...');

    // Helper to animate progress to a target with a minimum duration
    const animateTo = (target, message, minMs = 400) => new Promise(resolve => {
      if (message) setProgressMessage(message);
      const start = performance.now();
      const startVal = progress;
      const step = (now) => {
        setProgress(prev => {
          const elapsed = now - start;
            // Ease out cubic
          const t = Math.min(1, elapsed / minMs);
          const eased = 1 - Math.pow(1 - t, 3);
          const next = startVal + (target - startVal) * eased;
          return next;
        });
        if (now - start < minMs) {
          requestAnimationFrame(step);
        } else {
          setProgress(target);
          resolve();
        }
      };
      requestAnimationFrame(step);
    });
    
    // Add message showing upload started (will persist below progress UI)
    const uploadMessage = { role: 'bot', content: '📄 Processing your resume PDF... This may take a moment.', timestamp: new Date() };
    setMessages(prev => [...prev, uploadMessage]);

    try {
  console.log('📄 ChatBot - Starting PDF extraction...');
  await animateTo(15, 'Reading PDF...');
  const text = await extractTextFromPDF(file); // Actual extraction
  await animateTo(40, 'Extracting raw text...');
      console.log('📄 ChatBot - Text extracted, length:', text.length);
      
      if (!text || text.length < 50) {
        throw new Error('Could not extract enough text from PDF. The file might be:\n• A scanned image (not searchable text)\n• Encrypted or password-protected\n• Corrupted\n\nPlease try a different PDF or use manual chat entry.');
      }

  console.log('📄 ChatBot - Parsing text with AI...');
  await animateTo(55, 'Cleaning & preparing content...');
  await animateTo(70, 'Analyzing with AI...');
  const parsedData = await parseResumeWithAI(text);
  await animateTo(88, 'Structuring portfolio sections...');
      console.log('📄 ChatBot - Data parsed successfully:', parsedData);
      
      // Success message
      const successMessage = {
        role: 'bot',
        content: `✅ Successfully extracted your information from the resume! I found:\n\n👤 Name: ${parsedData.name}\n💼 Title: ${parsedData.title}\n🎯 Skills: ${parsedData.skills.slice(0, 3).join(', ')}${parsedData.skills.length > 3 ? '...' : ''}\n📧 Contact: ${parsedData.contact.email || 'Not found'}\n\nMoving to template selection...`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, successMessage]);

      await animateTo(100, 'Finalizing...');

      // Move to next step after a short delay
      setTimeout(() => {
        console.log('📄 ChatBot - Extracted data from PDF:', parsedData);
        console.log('📄 ChatBot - Calling onDataComplete with parsed data');
        onDataComplete(parsedData);
      }, 2000);

    } catch (error) {
      console.error('❌ PDF upload error:', error);
      const errorMessage = {
        role: 'bot',
        content: `❌ ${error.message}\n\n💡 **Troubleshooting:**\n• Make sure your PDF contains selectable text (not a scanned image)\n• Try a different PDF file\n• Or continue with the chat below to enter your information manually\n\nI'm ready to help you create your portfolio! 😊`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      setProgressMessage('Failed to extract resume');
      setProgressError(true);
      await new Promise(r => setTimeout(r, 1200));
    }

    setTimeout(() => {
      setUploadingPDF(false);
      setProgress(0);
      setProgressMessage('');
      setProgressError(false);
    }, 900);
    event.target.value = ''; // Reset file input
  };

  const extractPortfolioData = (msgs) => {
    // Extract data from conversation messages
    const allMessages = msgs.map(m => ({ role: m.role, content: m.content }));
    
    // Helper function to find user responses after bot questions
    const findAnswer = (keywords) => {
      for (let i = 0; i < allMessages.length - 1; i++) {
        if (allMessages[i].role === 'bot') {
          const botMsg = allMessages[i].content.toLowerCase();
          const hasKeyword = keywords.some(k => botMsg.includes(k));
          if (hasKeyword && allMessages[i + 1] && allMessages[i + 1].role === 'user') {
            return allMessages[i + 1].content;
          }
        }
      }
      return null;
    };

    // Extract name
    const name = findAnswer(['name', 'call you']) || 'Your Name';

    // Extract title
    const title = findAnswer(['title', 'role', 'what do you do', 'job title']) || 'Professional Title';

    // Extract bio
    const bio = findAnswer(['about yourself', 'tell me about', 'describe yourself']) || 
                'Professional with experience in creating innovative solutions.';

    // Extract skills
    const skillsText = findAnswer(['skill', 'technologies', 'tools']);
    const skills = skillsText ? 
      skillsText.split(/[,،]+/).map(s => s.trim()).filter(s => s.length > 0) : 
      ['JavaScript', 'React', 'Node.js'];

    // Extract experience
    const expText = findAnswer(['work experience', 'where have you worked', 'previous roles', 'employment']);
    const experience = expText ? 
      [{ 
        role: 'Professional Role', 
        company: 'Company Name', 
        duration: '2020 - Present',
        description: expText 
      }] : 
      [{ role: 'Your Role', company: 'Company', duration: '2020 - 2023', description: 'Your experience here' }];

    // Extract projects
    const projectText = findAnswer(['project', 'built', 'created', 'developed']);
    const projects = projectText ? 
      [{ 
        name: 'Project Name', 
        description: projectText,
        technologies: skills.slice(0, 3),
        link: '' 
      }] : 
      [{ name: 'Your Project', description: 'Project description', technologies: skills.slice(0, 3), link: '' }];

    // Extract education
    const eduText = findAnswer(['education', 'degree', 'studied', 'university', 'college']);
    const education = eduText ? 
      [{ degree: 'Degree', institution: eduText, year: '2020' }] : 
      [{ degree: 'Bachelor Degree', institution: 'University Name', year: '2020' }];

    // Extract contact
    const email = findAnswer(['email', 'contact']) || 'your.email@example.com';
    const phone = findAnswer(['phone', 'number']) || '';
    const linkedin = findAnswer(['linkedin']) || '';
    const github = findAnswer(['github', 'git']) || '';

    return {
      name,
      title,
      bio,
      skills,
      experience,
      projects,
      education,
      contact: { email, phone, linkedin, github },
    };
  };

  return (
    <div className="container mx-auto px-4 max-w-4xl relative">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="glass rounded-3xl shadow-2xl overflow-hidden flex flex-col min-h-[70vh]"
      >
        {/* Chat Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-8 h-8 text-white" />
              </motion.div>
              <div>
                <h2 className="text-2xl font-bold text-white">AI Portfolio Assistant</h2>
                <p className="text-indigo-100 text-sm">Let's create your amazing portfolio together!</p>
              </div>
            </div>
            {/* PDF Upload Button */}
            <div className="relative">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handlePDFUpload}
                className="hidden"
                disabled={uploadingPDF}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingPDF}
                className="bg-white/20 hover:bg-white/30 text-white rounded-xl px-4 py-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 border border-white/30"
              >
                {uploadingPDF ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Processing...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    <span className="text-sm">Upload Resume PDF</span>
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Progress Bar for PDF Extraction */}
        {uploadingPDF && (
          <div className="px-6 pt-4 bg-slate-900/70 border-b border-white/10">
            <div className="flex items-center justify-between text-[11px] font-medium tracking-wide mb-2 text-indigo-200">
              <span>{progressMessage}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className={`h-2 w-full rounded-full bg-slate-700/50 overflow-hidden relative ${progressError ? 'ring-1 ring-red-500/60' : 'ring-1 ring-indigo-500/30'}`}
                 role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100}>
              <div
                className={`h-full transition-all duration-300 ease-out ${progressError ? 'bg-gradient-to-r from-red-500 via-rose-500 to-pink-600' : 'bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-purple-600'} shadow-[0_0_8px_rgba(168,85,247,0.6)]`}
                style={{ width: `${progress}%` }}
              />
              {!progressError && (
                <div className="absolute inset-0 animate-pulse bg-white/5 mix-blend-overlay" />
              )}
            </div>
            <div className="mt-1 flex gap-1 flex-wrap text-[10px] text-indigo-300/70">
              <span className={`${progress < 20 ? 'opacity-100' : 'opacity-40'} transition-opacity`}>Read</span>
              <span>•</span>
              <span className={`${progress >= 20 && progress < 50 ? 'opacity-100' : 'opacity-40'} transition-opacity`}>Extract</span>
              <span>•</span>
              <span className={`${progress >= 50 && progress < 75 ? 'opacity-100' : 'opacity-40'} transition-opacity`}>Analyze</span>
              <span>•</span>
              <span className={`${progress >= 75 && progress < 95 ? 'opacity-100' : 'opacity-40'} transition-opacity`}>Structure</span>
              <span>•</span>
              <span className={`${progress >= 95 ? 'opacity-100' : 'opacity-40'} transition-opacity`}>Finalize</span>
            </div>
          </div>
        )}

  {/* Messages Container (internal scroll) */}
  <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-900/50 custom-scrollbar min-h-[280px]">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                      : 'glass text-gray-100'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <span className="text-xs opacity-60 mt-1 block">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {/* Loading bar shown only for the PDF processing message while uploading */}
                  {uploadingPDF && message.content.startsWith('📄 Processing your resume PDF') && (
                    <div className="mt-3 w-full h-1.5 bg-slate-700/60 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-purple-600 animate-[loadingBar_1.4s_linear_infinite]" />
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="glass rounded-2xl px-4 py-3 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                <span className="text-sm text-gray-300">AI is thinking...</span>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions */}
        {suggestions.length > 0 && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-6 py-3 bg-slate-800/50 border-t border-white/10"
          >
            <p className="text-xs text-gray-400 mb-2">Quick replies:</p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="px-3 py-1.5 text-sm rounded-full bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/30 transition-colors"
                >
                  {suggestion}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Input Area */}
  <div className="p-4 bg-slate-800/50 border-t border-white/10">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              id="chatbot-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 bg-slate-700/50 text-white placeholder-gray-400 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 border border-white/10"
              disabled={isLoading}
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSend()}
              disabled={isLoading || !input.trim()}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl px-6 py-3 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Removed bottom info cards; replaced with contextual floating callouts */}
      {/* External Callouts (positioned outside the chat card) */}
  <div className="hidden xl:block absolute top-10 right-0 translate-x-full w-72">
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="relative glass rounded-xl p-4 shadow-lg border border-white/10 backdrop-blur-xl"
        >
          <div className="absolute -left-3 top-6 w-6 h-6 rotate-45 bg-white/10 border-l border-b border-white/10" />
          <div className="flex items-start gap-2">
            <FileText className="w-5 h-5 text-blue-300 mt-0.5" />
            <div>
              <h3 className="text-white font-medium text-sm mb-1">🚀 Quick Start</h3>
              <p className="text-indigo-100/90 text-xs leading-relaxed">
                Upload your resume PDF and let AI extract your details instantly.
              </p>
              <p className="text-[10px] mt-1 text-blue-200/70">Supports searchable (non-scanned) PDFs.</p>
            </div>
          </div>
        </motion.div>
      </div>

  <div className="hidden xl:block absolute top-32 left-0 -translate-x-full w-72">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.35 }}
          className="relative glass rounded-xl p-4 shadow-lg border border-white/10 backdrop-blur-xl"
        >
          <div className="absolute -right-3 top-6 w-6 h-6 rotate-45 bg-white/10 border-r border-t border-white/10" />
          <div className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-green-300 mt-0.5" />
            <div>
              <h3 className="text-white font-medium text-sm mb-1">💬 Chat Manually</h3>
              <p className="text-indigo-100/90 text-xs leading-relaxed">
                Prefer guidance? Answer AI questions to build each section step-by-step.
              </p>
              <p className="text-[10px] mt-1 text-green-200/70">Use the quick reply buttons for speed.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ChatBot;

/* Tailwind keyframes (add to tailwind config if not existing):
  keyframes: {
    loadingBar: {
      '0%': { transform: 'translateX(-100%)' },
      '100%': { transform: 'translateX(100%)' }
    }
  },
  animation: { 'loadingBar': 'loadingBar 1.4s linear infinite' }
*/
