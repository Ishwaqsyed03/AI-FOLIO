import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';

import ChatBot from './components/ChatBot';
import TemplateSelector from './components/TemplateSelector';
import LivePreview from './components/LivePreview';
import HomeHub from './components/HomeHub';
import ATSChecker from './components/ATSChecker';
import CareerCoachChat from './components/CareerCoachChat';
import ThemeToggle from './components/ThemeToggle';

const THEME_STORAGE_KEY = 'aiFolioTheme';

const NAME_STORAGE_KEY = 'aiFolioName';

function App() {
  const [route, setRoute] = useState('hub'); // hub | portfolio | ats | coach
  const [step, setStep] = useState('chat'); // portfolio sub-flow: chat | template | preview
  const [portfolioData, setPortfolioData] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [userName, setUserName] = useState('');
  const [welcomeDone, setWelcomeDone] = useState(false);
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem(THEME_STORAGE_KEY) || 'dark';
    } catch {
      return 'dark';
    }
  });

  useEffect(() => {
    const saved = sessionStorage.getItem(NAME_STORAGE_KEY);
    if (saved) {
      setUserName(saved);
      setWelcomeDone(true);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      /* ignore */
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  }, []);

  const handleWelcomeComplete = useCallback((n) => {
    const trimmed = (n || '').trim();
    if (trimmed) sessionStorage.setItem(NAME_STORAGE_KEY, trimmed);
    setUserName(trimmed);
    setWelcomeDone(true);
  }, []);

  const handleChangeName = useCallback(() => {
    sessionStorage.removeItem(NAME_STORAGE_KEY);
    setWelcomeDone(false);
  }, []);

  // --- Portfolio sub-flow handlers ---
  const handleDataComplete = (data) => {
    setPortfolioData(data);
    setSelectedTemplate(null);
    setStep('template');
  };

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setStep('preview');
  };

  const handleBackToChat = () => {
    setStep('chat');
    setPortfolioData(null);
    setSelectedTemplate(null);
  };

  const handleBackToTemplates = () => {
    setStep('template');
    setSelectedTemplate(null);
  };

  const handleDataChange = (updated) => setPortfolioData(updated);

  const navigateTo = (target) => {
    setRoute(target);
    if (target === 'portfolio') {
      setStep('chat');
    }
  };

  const goHome = () => setRoute('hub');

  return (
    <div className={`min-h-screen relative text-white ${theme === 'light' ? 'theme-light' : ''}`}>
      {/* Aurora background */}
      <div className="aurora-bg" />
      <div className="aurora-orb-teal" />

      <div className="relative z-10">
      <AnimatePresence mode="wait">
        {!welcomeDone && (
          <WelcomeOverlay key="welcome" onComplete={handleWelcomeComplete} />
        )}

        {welcomeDone && route === 'hub' && (
          <motion.div
            key="hub"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
          >
            <HomeHub
              userName={userName}
              onNavigate={navigateTo}
              onChangeName={handleChangeName}
            />
          </motion.div>
        )}

        {welcomeDone && route === 'ats' && (
          <motion.div
            key="ats"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.3 }}
          >
            <ATSChecker onBack={goHome} initialPortfolioData={portfolioData} />
          </motion.div>
        )}

        {welcomeDone && route === 'coach' && (
          <motion.div
            key="coach"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.3 }}
          >
            <CareerCoachChat userName={userName} portfolioData={portfolioData} onBack={goHome} />
          </motion.div>
        )}

        {welcomeDone && route === 'portfolio' && (
          <motion.div
            key="portfolio"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.3 }}
            className="min-h-screen"
          >
            <PortfolioFlow
              userName={userName}
              step={step}
              portfolioData={portfolioData}
              selectedTemplate={selectedTemplate}
              onDataComplete={handleDataComplete}
              onTemplateSelect={handleTemplateSelect}
              onBackToChat={handleBackToChat}
              onBackToTemplates={handleBackToTemplates}
              onDataChange={handleDataChange}
              onBackToHub={goHome}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {welcomeDone && route !== 'hub' && <Footer />}
      </div>

      {welcomeDone && <ThemeToggle theme={theme} onToggle={toggleTheme} />}
    </div>
  );
}

function PortfolioFlow({
  userName,
  step,
  portfolioData,
  selectedTemplate,
  onDataComplete,
  onTemplateSelect,
  onBackToChat,
  onBackToTemplates,
  onDataChange,
  onBackToHub,
}) {
  return (
    <div className="px-4 sm:px-6 md:px-10 pt-6 pb-32 max-w-7xl mx-auto">
      {/* Header with breadcrumbs */}
      <div className="flex items-center justify-between mb-6">
        <button
          type="button"
          onClick={onBackToHub}
          className="flex items-center gap-2 glass rounded-full px-4 py-2.5 text-sm text-white/80 hover:text-white tap-scale"
        >
          <ArrowLeft className="w-4 h-4" /> Hub
        </button>
        <div className="hidden sm:flex items-center gap-2 text-xs">
          <StepPill label="Chat" active={step === 'chat'} />
          <StepPill label="Template" active={step === 'template'} />
          <StepPill label="Preview" active={step === 'preview'} />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 'chat' && (
          <motion.div
            key="chat"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.25 }}
          >
            <ChatBot onDataComplete={onDataComplete} userName={userName} />
          </motion.div>
        )}
        {step === 'template' && (
          <motion.div
            key="template"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.25 }}
          >
            <TemplateSelector
              portfolioData={portfolioData}
              onTemplateSelect={onTemplateSelect}
              onBack={onBackToChat}
            />
          </motion.div>
        )}
        {step === 'preview' && (
          <motion.div
            key="preview"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.25 }}
          >
            <LivePreview
              portfolioData={portfolioData}
              template={selectedTemplate}
              onBack={onBackToTemplates}
              onDataChange={onDataChange}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const StepPill = ({ label, active }) => (
  <div
    className={`px-4 py-1.5 rounded-full transition ${
      active ? 'bg-white text-slate-900 font-semibold shadow' : 'glass text-white/60'
    }`}
  >
    {label}
  </div>
);

function WelcomeOverlay({ onComplete }) {
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleContinue = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setSubmitted(true);
    // Short delay so the "Hello [name]" reveal animation is visible before the hub mounts
    setTimeout(() => onComplete(trimmed), 1400);
  };

  return (
    <motion.div
      key="welcome"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[60] flex items-center justify-center px-4"
    >
      {/* Backdrop with aurora */}
      <div className="absolute inset-0 bg-[#05060f]/95 backdrop-blur-md" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-fuchsia-500/30 blur-3xl animate-blob pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-cyan-400/20 blur-3xl animate-blob pointer-events-none" />

      <div className="relative w-full max-w-md">
        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.25 }}
              className="glass-strong rounded-4xl p-8 shadow-card"
            >
              <div className="flex items-center gap-3 mb-6">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                  className="w-12 h-12 rounded-2xl bg-gradient-to-br from-fuchsia-500 to-purple-600 flex items-center justify-center shadow-lg shadow-fuchsia-500/40"
                >
                  <Sparkles className="w-6 h-6 text-white" />
                </motion.div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-white/50">AI-FOLIO</p>
                  <p className="text-sm text-white/80">Build smarter. In a minute.</p>
                </div>
              </div>

              <h2 className="font-display text-3xl font-bold text-white mb-1.5">Welcome 👋</h2>
              <p className="text-sm text-white/60 mb-6">Tell us your name to personalize the experience.</p>

              <input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleContinue()}
                placeholder="Your name"
                className="w-full rounded-2xl bg-white/5 border border-white/10 focus:border-fuchsia-400/50 focus:outline-none px-4 py-3.5 text-base text-white placeholder-white/30 mb-4"
              />

              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => onComplete('Friend')}
                  className="text-sm text-white/50 hover:text-white tap-scale"
                >
                  Skip
                </button>
                <button
                  type="button"
                  onClick={handleContinue}
                  disabled={!name.trim()}
                  className="inline-flex items-center gap-2 rounded-full bg-white text-slate-900 font-semibold px-6 py-3 tap-scale shadow-lg shadow-white/10 hover:shadow-white/30 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="greet"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.35 }}
              className="text-center"
            >
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="text-sm uppercase tracking-[0.3em] text-white/50 mb-3"
              >
                Welcome aboard
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.5 }}
                className="font-display text-5xl sm:text-7xl font-extrabold leading-tight tracking-tight"
              >
                <span className="block text-white">HELLO,</span>
                <span className="block gradient-text">{name.trim().toUpperCase()}</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-6 text-white/60 text-sm"
              >
                Setting things up for you…
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function Footer() {
  return (
    <footer className="pb-8 pt-4">
      <div className="container mx-auto px-4 text-center text-xs text-white/40">
        © {new Date().getFullYear()} AI-FOLIO • Ishwaq Syed
      </div>
    </footer>
  );
}

export default App;
