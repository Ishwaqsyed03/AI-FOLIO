import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Send,
  MessageSquareHeart,
  Sparkles,
  Briefcase,
  Map,
  GraduationCap,
  Wand2,
  Loader2,
} from 'lucide-react';
import { chatWithGemini } from '../utils/geminiProxy';

const SYSTEM_PROMPT = `You are an empathetic, expert AI career coach.
Your role is to give the user clear, practical, encouraging career advice.

Guidelines:
- Keep replies concise (3–6 short paragraphs or bullet points)
- Ask one clarifying question when the user's goal is vague
- Be specific: name roles, technologies, salary ranges, learning paths
- Use the user's profile context (if provided) to personalize
- If asked something outside career topics, gently steer back
- Format important parts as short bullet lists when helpful
- Never invent facts about a specific company or person`;

const STARTERS = [
  { icon: Briefcase, label: 'What roles fit my skills?', prompt: 'Based on my background, what 3 roles best match my skills and growth potential?' },
  { icon: Map, label: 'Plan my career transition', prompt: 'I want to transition into a new role. Walk me through a concrete 6-month plan.' },
  { icon: GraduationCap, label: 'What should I learn next?', prompt: 'What are the 3 most valuable skills I should learn next, and where can I learn them?' },
  { icon: Wand2, label: 'Help me write a cold email', prompt: 'Help me write a short, confident cold email to a recruiter at a company I admire.' },
];

const CareerCoachChat = ({ userName, portfolioData, onBack }) => {
  const [messages, setMessages] = useState([
    {
      role: 'coach',
      text: `Hey ${userName || 'there'} — I'm your AI Career Coach. Tell me what's on your mind, or pick a prompt below to get started.`,
    },
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [error, setError] = useState('');
  const scrollRef = useRef(null);

  const profileContext = React.useMemo(() => {
    if (!portfolioData) return '';
    const parts = [];
    if (portfolioData.name) parts.push(`Name: ${portfolioData.name}`);
    if (portfolioData.title) parts.push(`Current role: ${portfolioData.title}`);
    if (portfolioData.bio) parts.push(`Bio: ${portfolioData.bio}`);
    if (Array.isArray(portfolioData.skills) && portfolioData.skills.length) {
      parts.push(`Skills: ${portfolioData.skills.slice(0, 12).join(', ')}`);
    }
    if (Array.isArray(portfolioData.experience) && portfolioData.experience.length) {
      const exp = portfolioData.experience
        .slice(0, 3)
        .map((e) => `${e.role || ''} at ${e.company || ''}`.trim())
        .filter(Boolean)
        .join('; ');
      if (exp) parts.push(`Experience: ${exp}`);
    }
    return parts.join('\n');
  }, [portfolioData]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  const send = async (text) => {
    const content = (text ?? input).trim();
    if (!content || isThinking) return;

    setError('');
    setInput('');
    const next = [...messages, { role: 'user', text: content }];
    setMessages(next);
    setIsThinking(true);

    try {
      const history = next
        .slice(0, -1)
        .map((m) => ({
          role: m.role === 'coach' ? 'model' : 'user',
          parts: [{ text: m.text }],
        }));

      const systemPrompt = profileContext
        ? `${SYSTEM_PROMPT}\n\nUser profile context:\n${profileContext}`
        : SYSTEM_PROMPT;

      const reply = await chatWithGemini({
        message: content,
        history,
        systemPrompt,
        cfg: { maxOutputTokens: 600, temperature: 0.75 },
      });
      setMessages((m) => [...m, { role: 'coach', text: reply }]);
    } catch (e) {
      setError(e.message || 'AI request failed. Please try again.');
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="min-h-screen px-4 sm:px-6 md:px-10 pt-6 pb-32 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 glass rounded-full px-4 py-2.5 text-sm text-white/80 hover:text-white tap-scale"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="flex items-center gap-2 text-sm text-white/60">
          <Sparkles className="w-4 h-4 text-cyan-300" />
          Powered by Gemini
        </div>
      </motion.div>

      {/* Title */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center shadow-lg shadow-cyan-500/30">
            <MessageSquareHeart className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-white">AI Career Coach</h1>
            <p className="text-sm text-white/50">Personalized guidance, anytime.</p>
          </div>
        </div>
      </motion.div>

      {/* Chat */}
      <div className="glass-strong rounded-4xl overflow-hidden flex flex-col h-[60vh] min-h-[460px]">
        <div ref={scrollRef} className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 space-y-4">
          <AnimatePresence initial={false}>
            {messages.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm sm:text-[15px] leading-relaxed whitespace-pre-wrap ${
                    m.role === 'user'
                      ? 'bg-gradient-to-br from-fuchsia-500 to-purple-600 text-white shadow-lg shadow-fuchsia-500/20'
                      : 'glass text-white/90'
                  }`}
                >
                  {m.text}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isThinking && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-white/50 text-sm pl-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Coach is thinking…
            </motion.div>
          )}
          {error && (
            <div className="rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-200 text-sm px-4 py-3">
              {error}
            </div>
          )}
        </div>

        {/* Starters */}
        {messages.length <= 1 && (
          <div className="px-4 sm:px-6 pb-3">
            <p className="text-[11px] uppercase tracking-wider text-white/40 mb-2">Try one of these</p>
            <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-1">
              {STARTERS.map((s, i) => {
                const Icon = s.icon;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => send(s.prompt)}
                    className="shrink-0 inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-xs sm:text-sm text-white/80 hover:text-white tap-scale hover:bg-white/10 transition"
                  >
                    <Icon className="w-3.5 h-3.5" /> {s.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Composer */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
          className="border-t border-white/5 p-3 sm:p-4 flex items-end gap-2"
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            rows={1}
            placeholder="Ask your coach anything…"
            className="flex-1 resize-none bg-white/5 border border-white/10 focus:border-cyan-400/50 focus:outline-none rounded-2xl px-4 py-3 text-sm sm:text-[15px] text-white placeholder-white/30 max-h-32"
          />
          <button
            type="submit"
            disabled={!input.trim() || isThinking}
            className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-cyan-500/30 disabled:opacity-40 disabled:shadow-none tap-scale"
            aria-label="Send"
          >
            {isThinking ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CareerCoachChat;
