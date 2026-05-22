import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, CheckCircle2, ClipboardList, Loader2, Sparkles, Target, TrendingUp, AlertTriangle, Download } from 'lucide-react';
import { analyzeResumeAgainstJobDescription, buildATSPortfolioDraft } from '../utils/resumeScreening';

const scoreTone = (score) => {
  if (score >= 80) return 'from-emerald-500 to-cyan-400';
  if (score >= 60) return 'from-amber-400 to-orange-500';
  return 'from-rose-500 to-pink-600';
};

const ScorePill = ({ score }) => (
  <div className={`inline-flex items-center gap-2 rounded-full bg-gradient-to-r ${scoreTone(score)} px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-black/20`}>
    <Target className="h-4 w-4" />
    ATS Score {score}/100
  </div>
);

const ResumeScreeningDashboard = ({ portfolioData, onBack, onContinue, onApplyRecommendations, standalone = false, backLabel = 'Back to Chat' }) => {
  const [jobDescription, setJobDescription] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [applyStatus, setApplyStatus] = useState('');

  const hasPortfolio = useMemo(() => {
    if (!portfolioData) {
      return false;
    }

    return Boolean(
      portfolioData.name ||
      portfolioData.title ||
      (portfolioData.skills || []).length ||
      (portfolioData.projects || []).length ||
      (portfolioData.experience || []).length
    );
  }, [portfolioData]);

  const handleAnalyze = async () => {
    if (!jobDescription.trim() || isAnalyzing || !hasPortfolio) {
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = await analyzeResumeAgainstJobDescription(portfolioData || {}, jobDescription);
      setAnalysis(result);
    } catch (error) {
      setAnalysis({
        score: 0,
        summary: error.message || 'Unable to analyze this resume.',
        suggestions: [],
        recruiterNotes: [],
        resumeLine: '',
        matchedSkills: [],
        missingSkills: [],
        matchedCount: 0,
        keywordCount: 0,
        keywordCoverage: 0,
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleApplyRecommendations = () => {
    if (!analysis || !onApplyRecommendations) {
      return;
    }

    const updatedData = buildATSPortfolioDraft(portfolioData || {}, analysis);
    onApplyRecommendations(updatedData);
    setApplyStatus('ATS recommendations added to your portfolio draft.');
  };

  const exportPdfReport = () => {
    if (!analysis) {
      return;
    }

    const styles = `
      <style>
        @page { size: A4; margin: 18mm; }
        body { font-family: Arial, sans-serif; color: #0f172a; line-height: 1.5; }
        .header { border-bottom: 2px solid #0ea5e9; padding-bottom: 14px; margin-bottom: 18px; }
        .eyebrow { color: #0369a1; text-transform: uppercase; letter-spacing: 0.12em; font-size: 11px; font-weight: 700; }
        h1 { margin: 6px 0 0; font-size: 24px; }
        h2 { font-size: 15px; margin: 18px 0 8px; color: #0f172a; }
        .score { display: inline-block; background: #0ea5e9; color: white; padding: 8px 12px; border-radius: 999px; font-weight: 700; }
        .grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; margin-top: 10px; }
        .card { border: 1px solid #cbd5e1; border-radius: 12px; padding: 12px; background: #f8fafc; }
        .section { margin-top: 14px; }
        .chip-list { display: flex; flex-wrap: wrap; gap: 8px; }
        .chip { border: 1px solid #bae6fd; background: #e0f2fe; color: #075985; padding: 5px 10px; border-radius: 999px; font-size: 12px; }
        .muted { color: #475569; font-size: 12px; }
        ul { margin: 8px 0 0 18px; padding: 0; }
        li { margin: 6px 0; }
      </style>
    `;

    const chips = (items = [], emptyLabel) => items.length
      ? `<div class="chip-list">${items.map((item) => `<span class="chip">${item}</span>`).join('')}</div>`
      : `<p class="muted">${emptyLabel}</p>`;

    const reportHtml = `
      <!doctype html>
      <html>
        <head>
          <title>ATS Screening Report</title>
          ${styles}
        </head>
        <body>
          <div class="header">
            <div class="eyebrow">Smart Resume Screening System</div>
            <h1>ATS + AI Recruiter Report</h1>
            <div class="score">ATS Score ${analysis.score}/100</div>
            <p class="muted" style="margin-top:10px;">Generated from the current resume data and pasted job description.</p>
          </div>

          <div class="section">
            <h2>Summary</h2>
            <div class="card">${analysis.summary}</div>
          </div>

          <div class="grid">
            <div class="card">
              <h2>Matched Skills</h2>
              ${chips(analysis.matchedSkills, 'No direct skill matches found.')}
            </div>
            <div class="card">
              <h2>Missing Skills</h2>
              ${chips(analysis.missingSkills.slice(0, 10), 'The resume already covers the visible job keywords.')}
            </div>
          </div>

          <div class="section card">
            <h2>AI Suggestions</h2>
            ${analysis.suggestions.length ? `<ul>${analysis.suggestions.map((item) => `<li>${item}</li>`).join('')}</ul>` : '<p class="muted">No suggestions available.</p>'}
          </div>

          ${analysis.recruiterNotes.length ? `
            <div class="section card">
              <h2>Recruiter Notes</h2>
              <ul>${analysis.recruiterNotes.map((item) => `<li>${item}</li>`).join('')}</ul>
            </div>
          ` : ''}

          <div class="section card">
            <h2>Resume Line</h2>
            <p>${analysis.resumeLine}</p>
          </div>
        </body>
      </html>
    `;

    const previewWindow = window.open('', '_blank', 'noopener,noreferrer,width=1100,height=900');
    if (!previewWindow) {
      alert('Please allow popups to export the PDF report.');
      return;
    }

    previewWindow.document.open();
    previewWindow.document.write(reportHtml);
    previewWindow.document.close();
    previewWindow.focus();
    previewWindow.onload = () => {
      previewWindow.print();
    };
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mb-8 overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl shadow-black/25"
    >
      <div className="border-b border-white/10 bg-gradient-to-r from-indigo-950/70 via-slate-950/60 to-purple-950/70 px-6 py-5 md:px-8">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-200">
              <BrainCircuit className="h-3.5 w-3.5" />
              Smart Resume Screening System
            </div>
            <h3 className="text-2xl font-bold text-white md:text-3xl">ATS + AI recruiter dashboard</h3>
            <p className="mt-2 text-sm leading-6 text-slate-200/80 md:text-base">
              Paste a job description to score the resume, surface missing skills, and generate improvement suggestions.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-slate-300/80">
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">ATS scoring</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Missing skills</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">LLM suggestions</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Recruiter view</span>
          </div>
        </div>
      </div>

      <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="p-6 md:p-8">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-cyan-100">Job Description</p>
              <p className="text-xs text-slate-300/70">Use this to compare the current resume against a target role.</p>
            </div>
            <ClipboardList className="h-5 w-5 text-cyan-200/80" />
          </div>

          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste a job description here. Example: Senior Full Stack Developer with React, Node.js, TypeScript, AWS, API design, and CI/CD experience."
            className="min-h-[180px] w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAnalyze}
              disabled={isAnalyzing || !jobDescription.trim() || !hasPortfolio}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-950/30 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isAnalyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {isAnalyzing ? 'Analyzing resume...' : 'Run ATS Match'}
            </motion.button>
            <p className="text-xs text-slate-300/70">
              {hasPortfolio ? 'The score is based on the parsed portfolio data currently in the app.' : 'Complete resume extraction first.'}
            </p>
          </div>

          {analysis && (
            <div className="mt-4 grid gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 md:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-[0.15em] text-emerald-200/80">Add to portfolio</p>
                <ul className="mt-2 space-y-2 text-sm text-slate-200/85">
                  {analysis.recommendedAdditions.length > 0 ? analysis.recommendedAdditions.map((item) => (
                    <li key={item} className="rounded-lg border border-emerald-400/15 bg-emerald-500/10 px-3 py-2">{item}</li>
                  )) : (
                    <li className="text-slate-400">No extra additions required right now.</li>
                  )}
                </ul>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.15em] text-rose-200/80">De-prioritize</p>
                <ul className="mt-2 space-y-2 text-sm text-slate-200/85">
                  {analysis.deprioritizedKeywords.length > 0 ? analysis.deprioritizedKeywords.map((item) => (
                    <li key={item} className="rounded-lg border border-rose-400/15 bg-rose-500/10 px-3 py-2">{item}</li>
                  )) : (
                    <li className="text-slate-400">No generic keywords to remove from the deciding set.</li>
                  )}
                </ul>
              </div>
            </div>
          )}

          {applyStatus && <p className="mt-3 text-sm text-emerald-200">{applyStatus}</p>}

          <div className="mt-4 flex flex-wrap gap-3">
            {!standalone && (
              <>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleApplyRecommendations}
                  disabled={!analysis || !onApplyRecommendations}
                  className="rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-5 py-3 text-sm font-semibold text-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Apply to Portfolio Draft
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onContinue?.()}
                  disabled={!analysis || !onContinue}
                  className="rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-600 px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Continue to Templates
                </motion.button>
              </>
            )}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onBack}
              className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white"
            >
              {backLabel}
            </motion.button>
          </div>
        </div>

        <div className="border-t border-white/10 bg-slate-950/40 p-6 md:p-8 lg:border-l lg:border-t-0">
          <div className="flex h-full flex-col justify-between gap-6">
            <div>
              <div className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-200">
                <TrendingUp className="h-4 w-4 text-emerald-300" />
                Recruiter dashboard
              </div>

              {analysis ? (
                <>
                  <ScorePill score={analysis.score} />
                  <div className="mt-3 rounded-xl border border-cyan-400/20 bg-cyan-500/10 px-3 py-2 text-xs text-cyan-100">
                    Strict ATS Score: <span className="font-semibold">{analysis.strictScore ?? analysis.score}/100</span>
                  </div>
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${scoreTone(analysis.score)} transition-all duration-500`}
                      style={{ width: `${analysis.score}%` }}
                    />
                  </div>
                  <p className="mt-4 text-sm leading-6 text-slate-200/80">{analysis.summary}</p>
                  <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.15em] text-cyan-200/80">Shortlisting prediction</p>
                    <div className="mt-2 flex items-end justify-between gap-3">
                      <div>
                        <p className="text-2xl font-bold text-white">{analysis.shortlistingPrediction?.label || 'Unknown'}</p>
                        <p className="text-xs text-slate-300/70">Probability of getting shortlisted</p>
                      </div>
                      <p className="text-2xl font-semibold text-cyan-200">{analysis.shortlistingPrediction?.probability ?? 0}%</p>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-200/80">{analysis.shortlistingPrediction?.rationale || ''}</p>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                      <p className="text-xs uppercase tracking-[0.15em] text-slate-400">Matched Skills</p>
                      <p className="mt-1 text-lg font-semibold text-white">{analysis.matchedCount}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                      <p className="text-xs uppercase tracking-[0.15em] text-slate-400">Coverage</p>
                      <p className="mt-1 text-lg font-semibold text-white">{analysis.keywordCoverage}%</p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-5 text-sm text-slate-300/80">
                  <AlertTriangle className="mb-3 h-5 w-5 text-amber-300" />
                  Add a job description to see an ATS score, recruiter notes, and a priority list of missing skills.
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-cyan-500/10 to-indigo-500/10 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs uppercase tracking-[0.18em] text-cyan-200/80">Resume line</p>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={exportPdfReport}
                  disabled={!analysis}
                  className="inline-flex items-center gap-2 rounded-lg border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-xs font-semibold text-cyan-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Download className="h-3.5 w-3.5" />
                  Export PDF
                </motion.button>
              </div>
              <p className="mt-2 text-sm leading-6 text-white/90">
                Built an AI-based resume screening tool using NLP and LLMs to match candidates with job descriptions and generate improvement suggestions.
              </p>
            </div>
          </div>
        </div>
      </div>

      {analysis && (
        <div className="grid gap-0 border-t border-white/10 md:grid-cols-3">
          <div className="border-b border-white/10 p-5 md:border-b-0 md:border-r md:border-white/10">
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-emerald-200">
              <CheckCircle2 className="h-4 w-4" />
              Matched skills
            </div>
            <div className="flex flex-wrap gap-2">
              {analysis.matchedSkills.length > 0 ? analysis.matchedSkills.map((skill) => (
                <span key={skill} className="rounded-full border border-emerald-400/25 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-100">
                  {skill}
                </span>
              )) : (
                <p className="text-sm text-slate-400">No direct skill matches found yet.</p>
              )}
            </div>
          </div>

          <div className="border-b border-white/10 p-5 md:border-b-0 md:border-r md:border-white/10">
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-rose-200">
              <Target className="h-4 w-4" />
              Missing skills
            </div>
            <div className="flex flex-wrap gap-2">
              {analysis.missingSkills.length > 0 ? analysis.missingSkills.slice(0, 10).map((skill) => (
                <span key={skill} className="rounded-full border border-rose-400/25 bg-rose-500/10 px-3 py-1 text-xs text-rose-100">
                  {skill}
                </span>
              )) : (
                <p className="text-sm text-slate-400">The resume already covers the visible job keywords.</p>
              )}
            </div>
          </div>

          <div className="p-5">
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-cyan-200">
              <Sparkles className="h-4 w-4" />
              AI suggestions
            </div>
            <ul className="space-y-2 text-sm text-slate-200/85">
              {analysis.suggestions.length > 0 ? analysis.suggestions.map((suggestion) => (
                <li key={suggestion} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 leading-6">
                  {suggestion}
                </li>
              )) : (
                <li className="text-slate-400">No suggestions available right now.</li>
              )}
            </ul>
            {analysis.recruiterNotes.length > 0 && (
              <div className="mt-4 rounded-xl border border-white/10 bg-slate-950/40 p-3 text-xs text-slate-300/80">
                <p className="mb-2 font-semibold text-slate-200">Recruiter notes</p>
                <ul className="space-y-1">
                  {analysis.recruiterNotes.map((note) => <li key={note}>• {note}</li>)}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {analysis && (
        <div className="mt-4 grid gap-4 border-t border-white/10 p-5 md:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.15em] text-cyan-200/80">Recognized Job Context</p>
            <p className="mt-2 text-sm text-slate-100">
              Work mode: <span className="font-semibold capitalize">{analysis.jobContext?.workMode || 'unspecified'}</span>
            </p>
            <p className="mt-1 text-sm text-slate-100">
              Role skill requirements detected: <span className="font-semibold">{analysis.jobContext?.requiredSkillCount ?? 0}</span>
            </p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-200">
              {(analysis.jobContext?.locationMentions || []).length > 0 ? (
                analysis.jobContext.locationMentions.map((item) => (
                  <span key={item} className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-2.5 py-1">
                    {item}
                  </span>
                ))
              ) : (
                <span className="text-slate-400">No explicit location constraints detected.</span>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.15em] text-emerald-200/80">Suggested Roles You Can Apply For</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-100">
              {(analysis.suggestedJobRoles || []).length > 0 ? (
                analysis.suggestedJobRoles.map((item) => (
                  <li key={item.role} className="rounded-lg border border-emerald-400/15 bg-emerald-500/10 px-3 py-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium">{item.role}</span>
                      <span className="text-xs text-emerald-100">Fit {item.fitScore}%</span>
                    </div>
                    {item.evidence?.length > 0 && (
                      <p className="mt-1 text-xs text-emerald-100/85">Signals: {item.evidence.join(', ')}</p>
                    )}
                  </li>
                ))
              ) : (
                <li className="text-slate-400">No strong role matches found yet. Add more concrete skills and projects.</li>
              )}
            </ul>
          </div>
        </div>
      )}
    </motion.section>
  );
};

export default ResumeScreeningDashboard;
