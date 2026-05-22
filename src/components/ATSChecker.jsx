import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Upload, FileText, Loader2, Target, Sparkles } from 'lucide-react';
import { extractTextFromPDF, parseResumeWithAI } from '../utils/resumeParser';
import ResumeScreeningDashboard from './ResumeScreeningDashboard';

const ATSChecker = ({ onBack, initialPortfolioData }) => {
  const [portfolioData, setPortfolioData] = useState(initialPortfolioData || null);
  const [pasteText, setPasteText] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [parseError, setParseError] = useState('');
  const fileInputRef = useRef(null);

  const handleUseText = async () => {
    const text = pasteText.trim();
    if (!text || isParsing) return;
    setIsParsing(true);
    setParseError('');
    try {
      const parsed = await parseResumeWithAI(text);
      setPortfolioData(parsed);
    } catch (e) {
      setParseError(e.message || 'Could not parse resume text. Try again or paste more detail.');
    } finally {
      setIsParsing(false);
    }
  };

  const handleFile = async (file) => {
    if (!file || isParsing) return;
    setIsParsing(true);
    setParseError('');
    try {
      const text = await extractTextFromPDF(file);
      const parsed = await parseResumeWithAI(text);
      setPortfolioData(parsed);
    } catch (e) {
      setParseError(e.message || 'Could not extract resume from this PDF.');
    } finally {
      setIsParsing(false);
    }
  };

  const reset = () => {
    setPortfolioData(null);
    setPasteText('');
    setParseError('');
  };

  return (
    <div className="min-h-screen px-4 sm:px-6 md:px-10 pt-6 pb-32 max-w-6xl mx-auto">
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
          <ArrowLeft className="w-4 h-4" /> Back to Hub
        </button>
        {portfolioData && (
          <button
            type="button"
            onClick={reset}
            className="text-xs text-white/60 hover:text-white underline-offset-4 hover:underline"
          >
            Use different resume
          </button>
        )}
      </motion.div>

      {/* Title */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center shadow-lg shadow-pink-500/30">
            <Target className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-white">ATS Score Check</h1>
            <p className="text-sm text-white/50">Beat the bots. Land the interview.</p>
          </div>
        </div>
      </motion.div>

      {!portfolioData ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-strong rounded-4xl p-6 sm:p-8"
        >
          <p className="text-sm text-white/70 mb-6">
            Upload your resume or paste its content. We'll parse it so you can score against any job description.
          </p>

          {/* Upload zone */}
          <div className="grid sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isParsing}
              className="group rounded-3xl border-2 border-dashed border-white/15 hover:border-pink-400/40 bg-white/3 hover:bg-white/5 p-8 flex flex-col items-center justify-center text-center transition tap-scale disabled:opacity-50"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <Upload className="w-6 h-6 text-white" />
              </div>
              <p className="text-white font-semibold mb-1">Upload PDF</p>
              <p className="text-xs text-white/50">Drag-and-drop or tap to choose</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0])}
              />
            </button>

            <div className="rounded-3xl glass p-5 flex flex-col">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-4 h-4 text-cyan-300" />
                <p className="text-sm font-medium text-white">Or paste resume text</p>
              </div>
              <textarea
                value={pasteText}
                onChange={(e) => setPasteText(e.target.value)}
                rows={6}
                placeholder="Paste your resume text here…"
                className="flex-1 resize-none bg-black/30 border border-white/10 focus:border-cyan-400/40 focus:outline-none rounded-2xl px-3 py-2.5 text-sm text-white placeholder-white/30"
              />
              <button
                type="button"
                onClick={handleUseText}
                disabled={!pasteText.trim() || isParsing}
                className="mt-3 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 text-white font-semibold py-2.5 disabled:opacity-40 tap-scale"
              >
                {isParsing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {isParsing ? 'Parsing…' : 'Parse resume'}
              </button>
            </div>
          </div>

          {isParsing && (
            <div className="mt-6 flex items-center justify-center gap-2 text-white/60 text-sm">
              <Loader2 className="w-4 h-4 animate-spin" /> Extracting your resume with AI…
            </div>
          )}

          {parseError && (
            <div className="mt-6 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-200 text-sm px-4 py-3">
              {parseError}
            </div>
          )}

          <div className="mt-8 grid sm:grid-cols-3 gap-3">
            <Tip title="Tailored scoring" body="Compare against any job description in seconds." />
            <Tip title="Missing keywords" body="See exactly what's hurting your chances." />
            <Tip title="Recruiter view" body="Read your resume the way the bots do." />
          </div>
        </motion.div>
      ) : (
        <ResumeScreeningDashboard
          portfolioData={portfolioData}
          onBack={onBack}
          standalone
          backLabel="Back to Hub"
        />
      )}
    </div>
  );
};

const Tip = ({ title, body }) => (
  <div className="glass rounded-2xl p-4">
    <p className="text-sm font-semibold text-white mb-1">{title}</p>
    <p className="text-xs text-white/55 leading-relaxed">{body}</p>
  </div>
);

export default ATSChecker;
