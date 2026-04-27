import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, Eye, Code, Github, Rocket, Loader2 } from 'lucide-react';
import { generateZip } from '../utils/zipGenerator';
import { deployPortfolioToGitHubPages, waitForGitHubPagesReady } from '../utils/githubPages';
import AdvancedEditor from './AdvancedEditor';

const LivePreview = ({ portfolioData, template, onBack, onDataChange }) => {
  console.log('👁️ LivePreview - Received portfolioData:', portfolioData);
  console.log('👁️ LivePreview - Template:', template.name);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [showDeployPanel, setShowDeployPanel] = useState(false);
  const [githubToken, setGithubToken] = useState('');
  const [repoName, setRepoName] = useState((portfolioData?.name || 'my').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-portfolio');
  const [isPrivateRepo, setIsPrivateRepo] = useState(false);
  const [deployStatus, setDeployStatus] = useState('');
  const [deployResult, setDeployResult] = useState(null);
  const [isWaitingForPages, setIsWaitingForPages] = useState(false);
  const [pagesWaitSeconds, setPagesWaitSeconds] = useState(0);
  const [pagesBuildStatus, setPagesBuildStatus] = useState('queued');
  const [viewMode, setViewMode] = useState('desktop'); // desktop, tablet, mobile
  const TemplateComponent = template.component;

  const handleDownload = async () => {
    console.log('💾 LivePreview - Starting ZIP generation with data:', portfolioData);
    setIsGenerating(true);
    try {
      await generateZip(portfolioData, template);
      console.log('💾 LivePreview - ZIP generated successfully');
    } catch (error) {
      console.error('❌ Error generating portfolio:', error);
      alert('Failed to generate portfolio. Please try again.');
    }
    setIsGenerating(false);
  };

  const handleDeployToGitHub = async () => {
    if (!githubToken.trim()) {
      setDeployStatus('Please provide a GitHub token (fine-grained PAT).');
      return;
    }
    if (!repoName.trim()) {
      setDeployStatus('Please provide a repository name.');
      return;
    }

    setIsDeploying(true);
    setDeployResult(null);
    setIsWaitingForPages(false);
    setPagesWaitSeconds(0);
    setPagesBuildStatus('queued');
    setDeployStatus('Creating repository and uploading files...');

    try {
      const result = await deployPortfolioToGitHubPages({
        token: githubToken,
        repoName,
        isPrivate: isPrivateRepo,
        portfolioData,
        template
      });

      setDeployResult(result);
      setIsWaitingForPages(true);
      setDeployStatus('Deployment created. Waiting for GitHub Pages to go live...');

      const waitResult = await waitForGitHubPagesReady({
        token: githubToken,
        owner: result.owner,
        repoName: result.repoName,
        timeoutSeconds: 180,
        intervalSeconds: 4,
        onTick: ({ elapsedSeconds, buildStatus }) => {
          setPagesWaitSeconds(elapsedSeconds);
          setPagesBuildStatus(buildStatus);
        }
      });

      if (waitResult.ready) {
        setDeployStatus(`Live link is ready in ${waitResult.elapsedSeconds}s.`);
      } else {
        setDeployStatus('Pages build is taking longer than expected. Your link may become live shortly.');
      }

      setIsWaitingForPages(false);
    } catch (error) {
      setIsWaitingForPages(false);
      setDeployStatus(`Deploy failed: ${error.message}`);
    }

    setIsDeploying(false);
  };

  const viewportSizes = {
    desktop: 'w-full',
    tablet: 'w-[768px]',
    mobile: 'w-[375px]',
  };

  return (
    <div className="container mx-auto px-4 max-w-[1600px]">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="glass rounded-xl px-4 py-2 text-white flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </motion.button>
          <div>
            <h2 className="text-2xl font-bold gradient-text flex items-center gap-2">
              <Eye className="w-6 h-6" />
              Live Preview
            </h2>
            <p className="text-gray-300 text-sm">{template.name} Template</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowDeployPanel((prev) => !prev)}
            className="bg-gradient-to-r from-slate-700 to-slate-800 text-white rounded-xl px-5 py-3 font-medium flex items-center gap-2"
          >
            <Github className="w-5 h-5" />
            Push it to GitHub
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDownload}
            disabled={isGenerating}
            className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl px-6 py-3 font-medium flex items-center gap-2 disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Code className="w-5 h-5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                Download Portfolio
              </>
            )}
          </motion.button>
        </div>
      </motion.div>

      {showDeployPanel && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 glass rounded-2xl p-5 border border-white/10"
        >
          <h3 className="text-white text-lg font-semibold mb-2 flex items-center gap-2">
            <Rocket className="w-5 h-5 text-cyan-300" />
            Deploy to GitHub Pages
          </h3>
          <p className="text-sm text-gray-300 mb-4">
            This creates/updates a repository and enables GitHub Pages. For automatic repo creation, use a classic PAT with repo scope, or a fine-grained token that includes repository creation permission.
          </p>
          <p className="text-xs text-amber-200/90 mb-4">
            If you see "Resource not accessible by personal access token", create the repo manually first and ensure token permissions: Contents (RW), Pages (RW), Metadata (R).
          </p>

          <div className="grid md:grid-cols-2 gap-3">
            <input
              type="password"
              value={githubToken}
              onChange={(e) => setGithubToken(e.target.value)}
              placeholder="GitHub token (PAT)"
              className="bg-slate-700/50 text-white placeholder-gray-400 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 border border-white/10"
            />
            <input
              type="text"
              value={repoName}
              onChange={(e) => setRepoName(e.target.value)}
              placeholder="Repository name"
              className="bg-slate-700/50 text-white placeholder-gray-400 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 border border-white/10"
            />
          </div>

          <label className="mt-3 inline-flex items-center gap-2 text-sm text-gray-300">
            <input
              type="checkbox"
              checked={isPrivateRepo}
              onChange={(e) => setIsPrivateRepo(e.target.checked)}
              className="rounded"
            />
            Create private repository
          </label>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleDeployToGitHub}
              disabled={isDeploying}
              className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl px-5 py-2.5 font-medium flex items-center gap-2 disabled:opacity-50"
            >
              {isDeploying ? (
                <>
                  <Code className="w-4 h-4 animate-spin" />
                  Deploying...
                </>
              ) : (
                <>
                  <Rocket className="w-4 h-4" />
                  Deploy Now
                </>
              )}
            </motion.button>
            {deployStatus && <span className="text-sm text-gray-300">{deployStatus}</span>}
          </div>

          {deployResult && (
            <div className="mt-4 rounded-xl bg-slate-800/60 p-4 border border-emerald-500/30">
              <p className="text-sm text-emerald-300 font-medium mb-2">Deployment created successfully</p>

              {isWaitingForPages && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-3 rounded-lg border border-cyan-500/30 bg-cyan-500/10 p-3"
                >
                  <div className="flex items-center gap-2 text-cyan-200 text-sm font-medium">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Publishing to GitHub Pages...
                  </div>
                  <div className="mt-1 text-xs text-cyan-100/90">
                    {pagesWaitSeconds}s elapsed • build status: {pagesBuildStatus}
                  </div>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-700/70">
                    <motion.div
                      className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500"
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
                      style={{ width: '50%' }}
                    />
                  </div>
                </motion.div>
              )}

              <div className="text-sm text-gray-200 space-y-1">
                <div>
                  Repo: <a className="text-cyan-300 hover:underline" href={deployResult.repoUrl} target="_blank" rel="noreferrer">{deployResult.repoUrl}</a>
                </div>
                <div>
                  Live link: <a className="text-cyan-300 hover:underline" href={deployResult.pagesUrl} target="_blank" rel="noreferrer">{deployResult.pagesUrl}</a>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Viewport Selector */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-center gap-2 mb-6"
      >
        {['desktop', 'tablet', 'mobile'].map((mode) => (
          <motion.button
            key={mode}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setViewMode(mode)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              viewMode === mode
                ? 'bg-purple-600 text-white'
                : 'glass text-gray-300 hover:text-white'
            }`}
          >
            {mode.charAt(0).toUpperCase() + mode.slice(1)}
          </motion.button>
        ))}
      </motion.div>

      {/* Editor + Preview Split */}
      <div className="grid lg:grid-cols-5 gap-6 items-start">
        {/* Editor Panel */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass rounded-2xl p-5 max-h-[80vh] overflow-y-auto lg:col-span-2"
        >
          <AdvancedEditor data={portfolioData} onChange={onDataChange} />
        </motion.div>
        {/* Preview Panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass rounded-2xl p-6 overflow-hidden lg:col-span-3"
        >
          <div className="flex justify-center">
            <motion.div
              layout
              className={`${viewportSizes[viewMode]} transition-all duration-300 mx-auto bg-white rounded-lg overflow-hidden shadow-2xl`}
              style={{ maxHeight: '75vh', overflowY: 'auto' }}
            >
              <TemplateComponent data={portfolioData} />
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-6 glass rounded-2xl p-4"
      >
        <h3 className="text-white font-medium mb-2">📦 What's included in the download:</h3>
        <ul className="text-gray-300 text-sm space-y-1 list-disc list-inside">
          <li>Complete HTML, CSS, and JavaScript files</li>
          <li>Ready to deploy on any hosting platform</li>
          <li>Fully responsive design</li>
          <li>All images and assets included</li>
          <li>Easy to customize and extend</li>
        </ul>
      </motion.div>
    </div>
  );
};

export default LivePreview;
