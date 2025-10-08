import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatBot from './components/ChatBot';
import TemplateSelector from './components/TemplateSelector';
import LivePreview from './components/LivePreview';
import { Sparkles } from 'lucide-react';

function App() {
  const [step, setStep] = useState('chat'); // 'chat', 'template', 'preview'
  const [portfolioData, setPortfolioData] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [userName, setUserName] = useState('');
  const [welcomeDone, setWelcomeDone] = useState(false);
  const chatContainerRef = useRef(null);
  const chatFocusRef = useRef(null);

  useEffect(() => {
    if (welcomeDone) {
      // Focus input (if ChatBot exposes ref via id) without triggering auto-scroll
      setTimeout(() => {
        const el = document.querySelector('#chatbot-input');
        if (!el) return;
        try {
          // Modern browsers support preventScroll option
          el.focus({ preventScroll: true });
        } catch (err) {
          // Fallback for older browsers: record scroll position, focus, then restore
          const x = window.scrollX || window.pageXOffset;
          const y = window.scrollY || window.pageYOffset;
          el.focus();
          window.scrollTo(x, y);
        }
      }, 300);
    }
  }, [welcomeDone]);

  const handleDataComplete = (data) => {
    console.log('📊 App.jsx - Data received from ChatBot:', data);
    setPortfolioData(data);
    console.log('📊 App.jsx - portfolioData state updated, moving to template selection');
    setStep('template');
  };

  const handleTemplateSelect = (template) => {
    console.log('🎨 App.jsx - Template selected:', template.name);
    console.log('🎨 App.jsx - Current portfolioData:', portfolioData);
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

  const handleDataChange = (updated) => {
    setPortfolioData(updated);
  };

  return (
  <div className="min-h-screen relative pb-10 bg-[#050507] text-white overflow-x-hidden">
    <div style={{color:'red', fontSize:'2rem', textAlign:'center', marginTop:'2rem', zIndex:9999, position:'relative'}}>Hello World Test</div>
  {/* Metallic neutral radial highlights */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-1/4 -left-1/4 w-[60vw] h-[60vw] rounded-full bg-[radial-gradient(circle_at_center,rgba(80,80,85,0.18),rgba(0,0,0,0.02)70%,transparent)] blur-3xl" />
        <div className="absolute top-1/3 -right-1/3 w-[55vw] h-[55vw] rounded-full bg-[radial-gradient(circle_at_center,rgba(120,120,130,0.15),rgba(0,0,0,0.02)65%,transparent)] blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-[40vw] h-[40vw] rounded-full bg-[radial-gradient(circle_at_center,rgba(90,90,95,0.12),transparent)] blur-2xl" />
      </div>
      {/* Subtle animated shimmer layer (neutral grayscale) */}
      <div className="pointer-events-none absolute inset-0 opacity-30 animate-gradient bg-[linear-gradient(120deg,rgba(40,40,45,0.35),rgba(15,15,18,0.35),rgba(55,55,60,0.35))] mix-blend-lighten" />
      {/* Fine noise texture overlay */}
      <div className="pointer-events-none absolute inset-0 opacity-10 mix-blend-overlay" style={{backgroundImage:'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27120%27 height=%27120%27 viewBox=%270 0 120 120%27%3E%3Crect width=%27120%27 height=%27120%27 fill=%27%23000000%27/%3E%3Cg fill=%27%23ffffff%27 fill-opacity=%270.05%27%3E%3Ccircle cx=%271%27 cy=%271%27 r=%271%27/%3E%3Ccircle cx=%2750%27 cy=%2750%27 r=%271%27/%3E%3Ccircle cx=%2799%27 cy=%2799%27 r=%271%27/%3E%3C/g%3E%3C/svg%3E")',backgroundSize:'120px 120px'}} />
      {/* Header */}
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-4 inset-x-0 z-50 flex justify-center px-4"
      >
        <div className="relative max-w-5xl w-full">
          {/* Outer glow / ring */}
          <div className="absolute inset-0 rounded-full blur-xl bg-gradient-to-r from-purple-600/30 via-fuchsia-500/25 to-indigo-500/30 pointer-events-none" />
          <div className="relative flex items-center justify-between gap-8 md:gap-10 px-6 md:px-8 py-3 rounded-full backdrop-blur-xl bg-white/5 border border-white/10 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.05)]">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-8 h-8 text-purple-400" />
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold gradient-text tracking-tight">AI-FOLIO</h1>
              <p className="text-[11px] uppercase tracking-wider text-purple-300/80 -mt-1">make a portfolio in less than a minute</p>
            </div>
          </div>
          <div className="flex gap-2">
            <motion.div
              className={`px-4 py-2 rounded-full text-sm ${
                step === 'chat' ? 'bg-purple-500/30 text-purple-300' : 'text-gray-400'
              }`}
              whileHover={{ scale: 1.05 }}
            >
              1. Chat
            </motion.div>
            <motion.div
              className={`px-4 py-2 rounded-full text-sm ${
                step === 'template' ? 'bg-purple-500/30 text-purple-300' : 'text-gray-400'
              }`}
              whileHover={{ scale: 1.05 }}
            >
              2. Select Template
            </motion.div>
            <motion.div
              className={`px-4 py-2 rounded-full text-sm ${
                step === 'preview' ? 'bg-purple-500/30 text-purple-300' : 'text-gray-400'
              }`}
              whileHover={{ scale: 1.05 }}
            >
              3. Preview & Download
            </motion.div>
          </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
  <main className="pt-32 pb-8">
        {!welcomeDone && (
          <WelcomeOverlay onComplete={(n) => { setUserName(n); setWelcomeDone(true); }} />
        )}

        <AnimatePresence mode="wait">
          {welcomeDone && step === 'chat' && (
            <motion.div
              key="chat"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.3 }}
            >
              <div ref={chatContainerRef}>
                <ChatBot onDataComplete={handleDataComplete} userName={userName} />
              </div>
            </motion.div>
          )}

          {/* About Developer section intentionally removed per user request */}

          {welcomeDone && step === 'template' && (
            <motion.div
              key="template"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.3 }}
            >
              <TemplateSelector
                portfolioData={portfolioData}
                onTemplateSelect={handleTemplateSelect}
                onBack={handleBackToChat}
              />
            </motion.div>
          )}

          {welcomeDone && step === 'preview' && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.3 }}
            >
              <LivePreview
                portfolioData={portfolioData}
                template={selectedTemplate}
                onBack={handleBackToTemplates}
                onDataChange={handleDataChange}
              />
            </motion.div>
          )}
        </AnimatePresence>
        {welcomeDone && <Footer />}
      </main>
    </div>
  );
}

export default App;

// Welcome overlay component (asks for user's name)
function WelcomeOverlay({ onComplete }) {
  const [name, setName] = useState('');
  useEffect(() => {
    const saved = sessionStorage.getItem('aiFolioName');
    if (saved) onComplete(saved);
  }, [onComplete]);
  const handleContinue = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    sessionStorage.setItem('aiFolioName', trimmed);
    onComplete(trimmed);
  };
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="glass rounded-2xl p-8 max-w-md w-full">
        <h3 className="text-xl font-semibold mb-2">Welcome</h3>
        <p className="text-sm text-gray-200/80 mb-4">What's your name? We'll personalize the experience.</p>
        <input className="w-full rounded-lg px-4 py-2 mb-3 bg-slate-800 text-white border border-white/10" placeholder="Your name" value={name} onChange={e => setName(e.target.value)} />
        <div className="flex justify-end gap-2">
          <button onClick={() => onComplete('')} className="px-4 py-2 rounded-md text-sm text-gray-300">Skip</button>
          <button onClick={handleContinue} className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white">Continue</button>
        </div>
      </div>
    </div>
  );
}

// Footer
function Footer() {
  return (
    <footer className="mt-20 pb-8">
      <div className="container mx-auto px-4 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} AI-FOLIO • Ishwaq Syed
      </div>
    </footer>
  );
}
