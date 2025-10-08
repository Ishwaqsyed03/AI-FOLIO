import React, { useRef, useState, useLayoutEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Layout } from 'lucide-react';
import { templates } from '../templates';

const TemplateSelector = ({ portfolioData, onTemplateSelect, onBack }) => {
  console.log('🎨 TemplateSelector - Received portfolioData:', portfolioData);
  
  return (
    <div className="container mx-auto px-4 max-w-7xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex items-center gap-4"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="glass rounded-xl px-4 py-2 text-white flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Chat
        </motion.button>
        <div>
          <h2 className="text-3xl font-bold gradient-text flex items-center gap-2">
            <Layout className="w-8 h-8" />
            Choose Your Template
          </h2>
          <p className="text-gray-300 mt-1">Select a design that represents you best</p>
        </div>
      </motion.div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8">
        {templates.map((template, index) => (
          <TemplateThumbnail
            key={template.id}
            template={template}
            index={index}
            data={portfolioData}
            onSelect={() => onTemplateSelect(template)}
          />
        ))}
      </div>
    </div>
  );
};

// Thumbnail subcomponent renders the real template component scaled for a pixel snapshot
const TemplateThumbnail = ({ template, data, index, onSelect }) => {
  const containerRef = useRef(null);
  const [scale, setScale] = useState(0.2); // default fallback scale
  const BASE_WIDTH = 1440; // design reference width
  const BASE_HEIGHT = 900; // reference height for cropping

  const recalc = useCallback(() => {
    if (!containerRef.current) return;
    const w = containerRef.current.clientWidth;
    const newScale = w / BASE_WIDTH;
    setScale(newScale);
  }, []);

  useLayoutEffect(() => {
    recalc();
    window.addEventListener('resize', recalc);
    return () => window.removeEventListener('resize', recalc);
  }, [recalc]);

  // Trim content data for performance inside thumbnails (avoid huge lists)
  const trimmedData = data ? {
    ...data,
    skills: (data.skills || []).slice(0, 8),
    projects: (data.projects || []).slice(0, 2),
    experience: (data.experience || []).slice(0, 2),
    education: (data.education || []).slice(0, 1)
  } : data;

  const TemplateComponent = template.component;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className="group cursor-pointer"
      onClick={onSelect}
    >
      <div className="glass rounded-2xl overflow-hidden border-2 border-white/10 hover:border-purple-500/50 transition-all relative">
        {/* REAL TEMPLATE PREVIEW */}
        <div ref={containerRef} className="relative aspect-video overflow-hidden bg-black/40">
          <div
            className="absolute top-0 left-0 origin-top-left pointer-events-none template-thumbnail-preview"
            style={{ width: BASE_WIDTH, height: BASE_HEIGHT, transform: `scale(${scale})` }}
          >
            <div className="preview-isolated font-sans">
              <TemplateComponent data={trimmedData || { name: 'Your Name', title: 'Title', bio: 'Short bio here' }} />
            </div>
          </div>
          {/* Gradient overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-40 transition-opacity" />
        </div>
        {/* Template Info */}
        <div className="p-4">
          <h3 className="text-xl font-bold text-white mb-1">{template.name}</h3>
          <p className="text-sm text-gray-300 mb-3 line-clamp-2">{template.description}</p>
          <div className="flex flex-wrap gap-2">
            {template.tags.map((tag, i) => (
              <span
                key={i}
                className="px-2 py-1 text-xs rounded-full bg-purple-600/30 text-purple-200 border border-purple-500/30"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* Style adjustments for thumbnails: neutralize full-screen constraints inside preview */
// We inject a style tag once (idempotent) so classes like min-h-screen don't force huge scroll inside the scaled preview.
if (typeof document !== 'undefined' && !document.getElementById('template-thumbnail-preview-styles')) {
  const style = document.createElement('style');
  style.id = 'template-thumbnail-preview-styles';
  style.innerHTML = `
    .template-thumbnail-preview .min-h-screen { min-height: auto !important; }
    .template-thumbnail-preview .bg-gradient-to-br, 
    .template-thumbnail-preview .bg-gradient-to-r { background-attachment: local; }
    .template-thumbnail-preview { isolation: isolate; }
    .template-thumbnail-preview * { scrollbar-width: none; }
    .template-thumbnail-preview *::-webkit-scrollbar { display: none; }
  `;
  document.head.appendChild(style);
}

export default TemplateSelector;
