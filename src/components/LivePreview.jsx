import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, Eye, Code } from 'lucide-react';
import { generateZip } from '../utils/zipGenerator';
import AdvancedEditor from './AdvancedEditor';

const LivePreview = ({ portfolioData, template, onBack, onDataChange }) => {
  console.log('👁️ LivePreview - Received portfolioData:', portfolioData);
  console.log('👁️ LivePreview - Template:', template.name);
  
  const [isGenerating, setIsGenerating] = useState(false);
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
      </motion.div>

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
