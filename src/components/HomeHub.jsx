import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Target,
  MessageSquareHeart,
  ArrowRight,
  Layers,
  Zap,
  Search,
  X,
} from 'lucide-react';

const features = [
  {
    id: 'portfolio',
    title: 'Build Portfolio',
    tagline: 'AI-guided in under a minute',
    description: 'Chat with AI, pick a template, and publish a stunning developer portfolio.',
    icon: Layers,
    accent: 'glass-purple',
    iconBg: 'bg-gradient-to-br from-purple-500 to-fuchsia-500',
    category: 'portfolio',
    cta: 'Start building',
    big: true,
  },
  {
    id: 'ats',
    title: 'ATS Score Check',
    tagline: 'Beat the bots',
    description: 'Paste a job description and your resume — get a score, missing keywords and recruiter notes.',
    icon: Target,
    accent: 'glass-pink',
    iconBg: 'bg-gradient-to-br from-rose-500 to-pink-500',
    category: 'ats',
    cta: 'Analyze resume',
    big: true,
  },
  {
    id: 'coach',
    title: 'AI Career Coach',
    tagline: 'Chat with your career guide',
    description: 'Get personalized career advice, role suggestions and skill roadmaps — based on your profile.',
    icon: MessageSquareHeart,
    accent: 'glass-teal',
    iconBg: 'bg-gradient-to-br from-teal-400 to-cyan-500',
    category: 'coach',
    cta: 'Chat now',
    big: false,
  },
];

const categories = [
  { id: 'all', label: 'All' },
  { id: 'portfolio', label: 'Portfolio' },
  { id: 'ats', label: 'ATS' },
  { id: 'coach', label: 'Coach' },
];

const HomeHub = ({ userName, onNavigate, onChangeName }) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  }, []);

  const q = query.trim().toLowerCase();
  const visible = features.filter((f) => {
    if (activeCategory !== 'all' && f.category !== activeCategory) return false;
    if (!q) return true;
    return (
      f.title.toLowerCase().includes(q) ||
      f.tagline.toLowerCase().includes(q) ||
      f.description.toLowerCase().includes(q) ||
      f.category.toLowerCase().includes(q)
    );
  });
  const recommended = visible.filter((f) => f.big);
  const more = visible.filter((f) => !f.big);
  const showRecommended = recommended.length > 0;

  const closeSearch = () => {
    setSearchOpen(false);
    setQuery('');
  };

  return (
    <div className="min-h-screen px-4 sm:px-6 md:px-10 pt-6 pb-32 max-w-6xl mx-auto">
      {/* Top bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl glass-strong flex items-center justify-center tap-scale">
            <Sparkles className="w-5 h-5 text-fuchsia-300" />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-white/40 font-medium">AI-FOLIO</p>
            <p className="text-sm font-medium text-white/90">make a portfolio in less than a minute</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSearchOpen((v) => !v)}
            aria-label={searchOpen ? 'Close search' : 'Open search'}
            title="Search tools"
            className={`w-11 h-11 rounded-2xl flex items-center justify-center tap-scale transition ${
              searchOpen ? 'bg-white text-slate-900' : 'glass text-white/70 hover:bg-white/10'
            }`}
          >
            {searchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
          </button>
          <button
            type="button"
            onClick={onChangeName}
            aria-label="Profile"
            title="Change name"
            className="w-11 h-11 rounded-2xl bg-gradient-to-br from-fuchsia-500 to-purple-600 flex items-center justify-center tap-scale font-bold text-white shadow-lg shadow-fuchsia-500/30"
          >
            {(userName || 'U').charAt(0).toUpperCase()}
          </button>
        </div>
      </motion.div>

      {/* Search input (expands when search button is tapped) */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <div className="glass-strong rounded-2xl flex items-center gap-3 px-4 py-3">
              <Search className="w-4 h-4 text-white/50 shrink-0" />
              <input
                ref={searchInputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Escape' && closeSearch()}
                placeholder="Search tools — try 'portfolio', 'ats', 'coach'…"
                className="flex-1 bg-transparent text-sm sm:text-base text-white placeholder-white/30 focus:outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="text-xs text-white/50 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Greeting */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-2"
      >
        <p className="text-sm text-white/50 mb-2">{greeting} 👋</p>
        <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-extrabold leading-[0.95] tracking-tight text-balance">
          <span className="block text-white">Hello,</span>
          <span className="block gradient-text">{userName || 'there'}</span>
        </h1>
        <p className="mt-4 text-base sm:text-lg text-white/60 max-w-xl">
          What do you want to build today? Pick a tool — portfolio, ATS score, or career coach.
        </p>
      </motion.div>

      {/* Category pills */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-8 flex gap-2 overflow-x-auto custom-scrollbar pb-2 -mx-1 px-1"
      >
        {categories.map((c) => {
          const active = activeCategory === c.id;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => setActiveCategory(c.id)}
              className={`shrink-0 px-5 py-2.5 rounded-full text-sm font-medium tap-scale transition ${
                active
                  ? 'bg-white text-slate-900 shadow-lg shadow-white/20'
                  : 'glass text-white/70 hover:text-white hover:bg-white/8'
              }`}
            >
              {c.label}
            </button>
          );
        })}
      </motion.div>

      {/* Recommended */}
      {showRecommended && recommended.length > 0 && (
        <section className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white/90">Recommended</h2>
            <span className="text-xs text-white/40">{recommended.length} tools</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {recommended.map((f, i) => (
              <FeatureCardLarge key={f.id} feature={f} onClick={() => onNavigate(f.id)} delay={0.05 * i} />
            ))}
          </div>
        </section>
      )}

      {/* More */}
      {more.length > 0 && (
        <section className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white/90">
              {activeCategory === 'all' ? 'More tools' : 'Available'}
            </h2>
          </div>
          <div className="space-y-3">
            {more.map((f, i) => (
              <FeatureCardRow key={f.id} feature={f} onClick={() => onNavigate(f.id)} delay={0.05 * i} />
            ))}
          </div>
        </section>
      )}

      {/* Empty state when search matches nothing */}
      {visible.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-10 glass-strong rounded-3xl p-8 text-center"
        >
          <p className="text-white/80 font-semibold">No tools match "{query}"</p>
          <p className="text-white/50 text-sm mt-1">Try "portfolio", "ats", or "coach".</p>
        </motion.div>
      )}

      {/* Spotlight CTA — Career Coach */}
      {!q && (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-10"
      >
        <div className="relative rounded-4xl overflow-hidden p-6 sm:p-8 glass-strong">
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-fuchsia-500/30 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-10 w-72 h-72 rounded-full bg-cyan-400/20 blur-3xl pointer-events-none" />
          <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-white/50 mb-3">
                <Zap className="w-3.5 h-3.5" /> Career challenge
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2 text-balance">
                Land your next role with a complete kit
              </h3>
              <p className="text-sm sm:text-base text-white/60 max-w-md">
                Build your portfolio, score it against the job, then sharpen with the AI coach — all in one place.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('portfolio')}
              className="self-start sm:self-auto inline-flex items-center gap-2 rounded-full bg-white text-slate-900 font-semibold px-6 py-3 tap-scale shadow-lg shadow-white/20 hover:shadow-white/40 transition"
            >
              Get started <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
      )}

    </div>
  );
};

const FeatureCardLarge = ({ feature, onClick, delay = 0 }) => {
  const Icon = feature.icon;
  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -4 }}
      className={`group relative text-left rounded-4xl p-6 sm:p-7 ${feature.accent} shadow-card overflow-hidden tap-scale min-h-[200px] flex flex-col`}
    >
      <div className={`w-12 h-12 rounded-2xl ${feature.iconBg} flex items-center justify-center mb-5 shadow-lg`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div className="flex-1">
        <h3 className="text-xl sm:text-2xl font-bold text-white mb-1.5">{feature.title}</h3>
        <p className="text-sm text-white/70 leading-relaxed">{feature.description}</p>
      </div>
      <div className="mt-5 flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider text-white/50">{feature.tagline}</span>
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/10 group-hover:bg-white/20 transition">
          <ArrowRight className="w-4 h-4 text-white" />
        </span>
      </div>
    </motion.button>
  );
};

const FeatureCardRow = ({ feature, onClick, delay = 0 }) => {
  const Icon = feature.icon;
  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ x: 4 }}
      className="group w-full text-left rounded-3xl p-4 sm:p-5 glass-strong flex items-center gap-4 tap-scale hover:bg-white/10 transition"
    >
      <div className={`shrink-0 w-12 h-12 rounded-2xl ${feature.iconBg} flex items-center justify-center shadow-lg`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-base sm:text-lg font-semibold text-white">{feature.title}</h3>
        <p className="text-xs sm:text-sm text-white/60 truncate">{feature.tagline}</p>
      </div>
      <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/10 group-hover:bg-white/20 transition">
        <ArrowRight className="w-4 h-4 text-white" />
      </span>
    </motion.button>
  );
};

export default HomeHub;
