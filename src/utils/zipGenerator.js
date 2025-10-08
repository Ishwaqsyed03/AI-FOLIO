import JSZip from 'jszip';
import { saveAs } from 'file-saver';

// Attempt lazy SSR render if running in an environment where react-dom/server is available (some bundlers will tree-shake if not used)
let reactRenderToStatic;
let ReactLib;
const tryLoadSSR = async () => {
  if (reactRenderToStatic) return true;
  try {
    const [react, rds] = await Promise.all([
      import('react'),
      import('react-dom/server')
    ]);
    ReactLib = react;
    reactRenderToStatic = rds.renderToStaticMarkup;
    return true;
  } catch (e) {
    // SSR not available (likely running purely in browser), silently ignore
    return false;
  }
};

// Map template ids to component dynamic import paths
const templateComponentImporters = {
  'modern-minimal': () => import('../templates/ModernMinimal.jsx'),
  'creative-gradient': () => import('../templates/CreativeGradient.jsx'),
  'professional-dark': () => import('../templates/ProfessionalDark.jsx'),
  'bold-colorful': () => import('../templates/BoldColorful.jsx'),
  'elegant-classic': () => import('../templates/ElegantClassic.jsx'),
  'tech-futuristic': () => import('../templates/TechFuturistic.jsx'),
  'clean-corporate': () => import('../templates/CleanCorporate.jsx'),
  'artistic-portfolio': () => import('../templates/ArtisticPortfolio.jsx'),
  'developer-showcase': () => import('../templates/DeveloperShowcase.jsx'),
  'designer-creative': () => import('../templates/DesignerCreative.jsx'),
};

const trySSRTemplate = async (templateId, data) => {
  const canSSR = await tryLoadSSR();
  if (!canSSR) return null;
  const importer = templateComponentImporters[templateId];
  if (!importer) return null;
  try {
    const mod = await importer();
    const Component = mod.default;
    const element = ReactLib.createElement(Component, { data });
    const html = reactRenderToStatic(element);
    return html;
  } catch (err) {
    console.warn('SSR template render failed, falling back to static generator:', err);
    return null;
  }
};

// Generate full static HTML (no runtime injection) for better fidelity
const generateHTML = (portfolioData, template) => {
  const { name, title } = portfolioData;
  const bodyContent = generateTemplateHTML(portfolioData, template);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${name} - ${title}</title>
  <!-- Tailwind CSS with full configuration -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            fuchsia: {50:'#fdf4ff',100:'#fae8ff',200:'#f5d0fe',300:'#f0abfc',400:'#e879f9',500:'#d946ef',600:'#c026d3',700:'#a21caf',800:'#86198f',900:'#701a75'},
            purple: {50:'#faf5ff',100:'#f3e8ff',200:'#e9d5ff',300:'#d8b4fe',400:'#c084fc',500:'#a855f7',600:'#9333ea',700:'#7e22ce',800:'#6b21a8',900:'#581c87'},
            indigo: {50:'#eef2ff',100:'#e0e7ff',200:'#c7d2fe',300:'#a5b4fc',400:'#818cf8',500:'#6366f1',600:'#4f46e5',700:'#4338ca',800:'#3730a3',900:'#312e81'}
          },
          blur: { '3xl':'96px' }
        }
      }
    }
  </script>
  <!-- Safelist hint (non-functional comment for reference of unusual classes) -->
  <!-- SAFELIST: bg-gradient-to-br from-fuchsia-50 via-purple-50 to-indigo-50 from-fuchsia-600 via-purple-600 to-indigo-600 from-fuchsia-200 to-purple-200 from-fuchsia-500 to-purple-600 -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="styles.css" />
  <style>
    body { font-family: 'Inter', sans-serif; margin:0; padding:0; }
    html { scroll-behavior:smooth; }
    .gradient-text { background:linear-gradient(to right,#c026d3,#9333ea,#4f46e5); -webkit-background-clip:text; background-clip:text; -webkit-text-fill-color:transparent; }
  </style>
</head>
<body>
${bodyContent}
</body>
</html>`;
};

// Generate inline HTML based on template
const generateTemplateHTML = (data, template) => {
  // This will generate static HTML based on the template
  // For simplicity, we'll create a basic structure
  
  switch (template.id) {
    case 'modern-minimal':
      return generateModernMinimalHTML(data);
    case 'creative-gradient':
      return generateCreativeGradientHTML(data);
    case 'professional-dark':
      return generateProfessionalDarkHTML(data);
    case 'bold-colorful':
      return generateBoldColorfulHTML(data);
    case 'elegant-classic':
      return generateElegantClassicHTML(data);
    case 'tech-futuristic':
      return generateTechFuturisticHTML(data);
    case 'clean-corporate':
      return generateCleanCorporateHTML(data);
    case 'artistic-portfolio':
      return generateArtisticPortfolioHTML(data);
    case 'developer-showcase':
      return generateDeveloperShowcaseHTML(data);
    case 'designer-creative':
      return generateDesignerCreativeHTML(data);
    default:
      return generateModernMinimalHTML(data);
  }
};

// Template HTML generators (simplified versions)
const generateModernMinimalHTML = (data) => {
  return `
    <div class="bg-white text-gray-900 min-h-screen">
      <header class="border-b border-gray-200 py-16 px-8">
        <div class="max-w-4xl mx-auto">
          <h1 class="text-5xl font-bold mb-2">${data.name}</h1>
          <p class="text-xl text-gray-600 mb-4">${data.title}</p>
          <p class="text-gray-700 max-w-2xl">${data.bio}</p>
        </div>
      </header>
      
      <section class="py-8 px-8 bg-gray-50">
        <div class="max-w-4xl mx-auto flex flex-wrap gap-6">
          ${data.contact.email ? `<a href="mailto:${data.contact.email}" class="text-gray-600 hover:text-gray-900">📧 ${data.contact.email}</a>` : ''}
          ${data.contact.phone ? `<a href="tel:${data.contact.phone}" class="text-gray-600 hover:text-gray-900">📱 ${data.contact.phone}</a>` : ''}
          ${data.contact.linkedin ? `<a href="https://${data.contact.linkedin}" target="_blank" class="text-gray-600 hover:text-gray-900">💼 LinkedIn</a>` : ''}
          ${data.contact.github ? `<a href="https://${data.contact.github}" target="_blank" class="text-gray-600 hover:text-gray-900">🐙 GitHub</a>` : ''}
        </div>
      </section>

      <section class="py-12 px-8">
        <div class="max-w-4xl mx-auto">
          <h2 class="text-2xl font-bold mb-6">Skills</h2>
          <div class="flex flex-wrap gap-3">
            ${data.skills.map(skill => `<span class="px-4 py-2 bg-gray-100 text-gray-800 rounded-full text-sm">${skill}</span>`).join('')}
          </div>
        </div>
      </section>

      <section class="py-12 px-8 bg-gray-50">
        <div class="max-w-4xl mx-auto">
          <h2 class="text-2xl font-bold mb-6">Experience</h2>
          <div class="space-y-8">
            ${data.experience.map(exp => `
              <div>
                <h3 class="text-xl font-semibold">${exp.role}</h3>
                <p class="text-gray-600 mb-2">${exp.company} • ${exp.duration}</p>
                <p class="text-gray-700">${exp.description}</p>
              </div>
            `).join('')}
          </div>
        </div>
      </section>

      <section class="py-12 px-8">
        <div class="max-w-4xl mx-auto">
          <h2 class="text-2xl font-bold mb-6">Projects</h2>
          <div class="grid md:grid-cols-2 gap-6">
            ${data.projects.map(project => `
              <div class="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <h3 class="text-xl font-semibold mb-2">${project.name}</h3>
                <p class="text-gray-700 mb-3">${project.description}</p>
                <div class="flex flex-wrap gap-2 mb-3">
                  ${project.technologies.map(tech => `<span class="px-2 py-1 bg-gray-100 text-xs rounded">${tech}</span>`).join('')}
                </div>
                ${project.link ? `<a href="${project.link}" target="_blank" class="text-blue-600 hover:underline text-sm">View Project →</a>` : ''}
              </div>
            `).join('')}
          </div>
        </div>
      </section>

      <section class="py-12 px-8 bg-gray-50">
        <div class="max-w-4xl mx-auto">
          <h2 class="text-2xl font-bold mb-6">Education</h2>
          <div class="space-y-4">
            ${data.education.map(edu => `
              <div>
                <h3 class="text-xl font-semibold">${edu.degree}</h3>
                <p class="text-gray-600">${edu.institution} • ${edu.year}</p>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
    </div>
  `;
};

// Simplified generators for other templates (using similar pattern)
const generateCreativeGradientHTML = (data) => {
  return `
    <div class="bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 text-white min-h-screen">
      <section class="py-20 px-8">
        <div class="max-w-5xl mx-auto text-center">
          <h1 class="text-6xl font-bold mb-4">${data.name}</h1>
          <p class="text-2xl mb-6">${data.title}</p>
          <p class="text-lg max-w-2xl mx-auto">${data.bio}</p>
        </div>
      </section>
      
      <section class="py-16 px-8">
        <div class="max-w-5xl mx-auto">
          <h2 class="text-4xl font-bold mb-8 text-center">Skills & Expertise</h2>
          <div class="flex flex-wrap justify-center gap-4">
            ${data.skills.map(skill => `<span class="px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full text-lg font-medium">${skill}</span>`).join('')}
          </div>
        </div>
      </section>
      
      ${generateCommonSections(data, 'gradient')}
    </div>
  `;
};

const generateProfessionalDarkHTML = (data) => {
  return `
    <div class="bg-gray-900 text-gray-100 min-h-screen">
      <div class="max-w-6xl mx-auto px-8 py-12">
        <header class="mb-16">
          <h1 class="text-5xl font-bold mb-3 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">${data.name}</h1>
          <p class="text-2xl text-gray-300 mb-4">${data.title}</p>
          <p class="text-gray-400 max-w-2xl">${data.bio}</p>
        </header>
        ${generateCommonSections(data, 'dark')}
      </div>
    </div>
  `;
};

const generateBoldColorfulHTML = (data) => generateCreativeGradientHTML(data);
const generateElegantClassicHTML = (data) => generateModernMinimalHTML(data);
const generateTechFuturisticHTML = (data) => generateProfessionalDarkHTML(data);
const generateCleanCorporateHTML = (data) => generateModernMinimalHTML(data);
const generateArtisticPortfolioHTML = (data) => generateCreativeGradientHTML(data);
const generateDeveloperShowcaseHTML = (data) => generateProfessionalDarkHTML(data);
const generateDesignerCreativeHTML = (data) => {
  // Lucide SVGs for Smile, Heart, Star
  const smileSVG = `<svg xmlns="http://www.w3.org/2000/svg" class="w-20 h-20 mx-auto mb-6 text-fuchsia-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/><path d="M8 15s1.5 2 4 2 4-2 4-2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 9h.01M15 9h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const heartSVG = `<svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-fuchsia-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M12 21C12 21 4 13.5 4 8.5C4 5.5 6.5 3 9.5 3C11.04 3 12.5 3.81 13.28 5.09C14.06 3.81 15.52 3 17.05 3C20.05 3 22.5 5.5 22.5 8.5C22.5 13.5 12 21 12 21Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const starSVG = `<svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 mx-auto mb-3 text-fuchsia-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><polygon points="12 17.27 18.18 21 16.54 13.97 22 9.24 14.81 8.63 12 2 9.19 8.63 2 9.24 7.46 13.97 5.82 21 12 17.27" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>`;

  return `
    <div class="bg-gradient-to-br from-fuchsia-50 via-purple-50 to-indigo-50 min-h-screen">
      <!-- Creative Hero -->
      <section class="relative py-24 px-8 overflow-hidden">
        <div class="absolute top-0 left-1/4 w-64 h-64 bg-fuchsia-300 rounded-full opacity-20 blur-3xl"></div>
        <div class="absolute bottom-0 right-1/4 w-80 h-80 bg-indigo-300 rounded-full opacity-20 blur-3xl"></div>
        <div class="max-w-5xl mx-auto text-center relative z-10">
          ${smileSVG}
          <h1 class="text-7xl font-black mb-4 bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            ${data.name}
          </h1>
          <p class="text-3xl font-bold text-purple-700 mb-6">${data.title}</p>
          <p class="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">${data.bio}</p>
        </div>
      </section>

      <div class="max-w-6xl mx-auto px-8 pb-16">
        <!-- Design Skills -->
        <section class="mb-20">
          <h2 class="text-5xl font-black text-center mb-12 text-purple-900">Design Arsenal</h2>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-6">
            ${data.skills.map(skill => `
              <div class="bg-white rounded-3xl p-6 shadow-xl text-center transform hover:scale-105 transition-transform">
                ${starSVG}
                <h3 class="text-lg font-bold text-purple-900">${skill}</h3>
              </div>
            `).join('')}
          </div>
        </section>

        <!-- Portfolio Showcase -->
        <section class="mb-20">
          <h2 class="text-5xl font-black text-center mb-12 text-purple-900 flex items-center justify-center gap-3">
            ${heartSVG}
            Portfolio Pieces
          </h2>
          <div class="space-y-12">
            ${data.projects.map((project, index) => `
              <div class="flex flex-col md:flex-row gap-8 items-center ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}">
                <div class="flex-1 bg-gradient-to-br from-fuchsia-200 to-purple-200 rounded-3xl aspect-video shadow-2xl flex items-center justify-center">
                  <div class="text-white text-4xl font-black opacity-50">${project.name}</div>
                </div>
                <div class="flex-1">
                  <h3 class="text-3xl font-black mb-4 text-purple-900">${project.name}</h3>
                  <p class="text-gray-700 text-lg mb-4 leading-relaxed">${project.description}</p>
                  <div class="flex flex-wrap gap-3">
                    ${project.technologies.map(tech => `
                      <span class="px-4 py-2 bg-gradient-to-r from-fuchsia-500 to-purple-500 text-white rounded-full font-medium shadow-lg">
                        ${tech}
                      </span>
                    `).join('')}
                  </div>
                  ${project.link ? `<a href="${project.link}" target="_blank" class="inline-block mt-4 text-purple-600 hover:text-purple-800 font-bold">View Project →</a>` : ''}
                </div>
              </div>
            `).join('')}
          </div>
        </section>

        <!-- Experience Journey -->
        <section class="mb-20">
          <h2 class="text-5xl font-black text-center mb-12 text-purple-900">My Design Journey</h2>
          <div class="relative">
            <div class="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-fuchsia-500 via-purple-500 to-indigo-500 transform -translate-x-1/2"></div>
            <div class="space-y-12">
              ${data.experience.map((exp, index) => `
                <div class="flex items-center gap-8 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}">
                  <div class="flex-1 ${index % 2 === 0 ? 'text-right' : 'text-left'}">
                    <div class="bg-white rounded-3xl p-8 shadow-xl inline-block">
                      <h3 class="text-2xl font-black text-purple-900 mb-2">${exp.role}</h3>
                      <p class="text-xl font-bold text-fuchsia-600 mb-2">${exp.company}</p>
                      <p class="text-sm text-gray-600 mb-3">${exp.duration}</p>
                      <p class="text-gray-700">${exp.description}</p>
                    </div>
                  </div>
                  <div class="w-6 h-6 bg-fuchsia-500 rounded-full border-4 border-white shadow-lg z-10"></div>
                  <div class="flex-1"></div>
                </div>
              `).join('')}
            </div>
          </div>
        </section>

        <!-- Education -->
        <section class="mb-20">
          <h2 class="text-5xl font-black text-center mb-12 text-purple-900">Education</h2>
          <div class="grid md:grid-cols-2 gap-8">
            ${data.education.map(edu => `
              <div class="bg-gradient-to-br from-fuchsia-500 to-purple-600 text-white rounded-3xl p-8 shadow-2xl text-center">
                <h3 class="text-2xl font-black mb-2">${edu.degree}</h3>
                <p class="text-xl mb-2">${edu.institution}</p>
                <p class="text-lg opacity-90">${edu.year}</p>
              </div>
            `).join('')}
          </div>
        </section>

        <!-- Contact CTA -->
        <section class="text-center bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-600 text-white rounded-3xl p-16 shadow-2xl">
          <h2 class="text-5xl font-black mb-6">Let's Create Magic Together!</h2>
          <p class="text-xl mb-8">Ready to bring your ideas to life?</p>
          <div class="flex flex-wrap justify-center gap-6 text-lg font-bold">
            ${data.contact.email ? `<a href="mailto:${data.contact.email}" class="bg-white text-purple-600 px-8 py-4 rounded-full hover:bg-gray-100 transition-colors shadow-lg">📧 ${data.contact.email}</a>` : ''}
            ${data.contact.phone ? `<a href="tel:${data.contact.phone}" class="bg-white text-purple-600 px-8 py-4 rounded-full hover:bg-gray-100 transition-colors shadow-lg">📱 ${data.contact.phone}</a>` : ''}
            ${data.contact.linkedin ? `<a href="https://${data.contact.linkedin}" target="_blank" class="bg-white text-purple-600 px-8 py-4 rounded-full hover:bg-gray-100 transition-colors shadow-lg">💼 LinkedIn</a>` : ''}
            ${data.contact.github ? `<a href="https://${data.contact.github}" target="_blank" class="bg-white text-purple-600 px-8 py-4 rounded-full hover:bg-gray-100 transition-colors shadow-lg">🐙 GitHub</a>` : ''}
          </div>
        </section>
      </div>
    </div>
  `;
};

const generateCommonSections = (data, theme) => {
  return `
    <section class="py-16 px-8">
      <div class="max-w-5xl mx-auto">
        <h2 class="text-4xl font-bold mb-10 text-center">Experience</h2>
        ${data.experience.map(exp => `
          <div class="mb-8">
            <h3 class="text-2xl font-bold">${exp.role}</h3>
            <p class="text-xl">${exp.company}</p>
            <p class="text-sm mb-2">${exp.duration}</p>
            <p>${exp.description}</p>
          </div>
        `).join('')}
      </div>
    </section>
    
    <section class="py-16 px-8">
      <div class="max-w-5xl mx-auto">
        <h2 class="text-4xl font-bold mb-10 text-center">Projects</h2>
        ${data.projects.map(project => `
          <div class="mb-8 p-6 rounded-lg border">
            <h3 class="text-2xl font-bold mb-2">${project.name}</h3>
            <p class="mb-4">${project.description}</p>
            <div class="flex flex-wrap gap-2">
              ${project.technologies.map(tech => `<span class="px-3 py-1 rounded text-sm">${tech}</span>`).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    </section>
  `;
};

// CSS content
const generateCSS = (template) => {
  return `
/* Portfolio Styles - ${template.name} */
/* 
 * Note: This portfolio uses Tailwind CSS via CDN for styling.
 * Additional custom styles and overrides are defined below.
 */

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Inter', sans-serif;
    line-height: 1.6;
    background: #fff;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

/* Smooth scrolling */
html {
    scroll-behavior: smooth;
}

/* Custom animations */
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes float {
    0%, 100% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-20px);
    }
}

@keyframes pulse {
    0%, 100% {
        opacity: 1;
    }
    50% {
        opacity: 0.5;
    }
}

.fade-in {
    animation: fadeIn 0.6s ease-out;
}

.float {
    animation: float 3s ease-in-out infinite;
}

/* Enhanced hover effects */
.hover-lift {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.hover-lift:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* Gradient text utility */
.gradient-text {
    background: linear-gradient(to right, #c026d3, #9333ea, #4f46e5);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    color: transparent;
}

/* Custom scrollbar for webkit browsers */
::-webkit-scrollbar {
    width: 10px;
    height: 10px;
}

::-webkit-scrollbar-track {
    background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
    background: linear-gradient(to bottom, #c026d3, #9333ea);
    border-radius: 5px;
}

::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(to bottom, #a21caf, #7e22ce);
}

/* Print styles */
@media print {
    body {
        background: white;
    }
    
    .no-print {
        display: none;
    }
    
    a[href]:after {
        content: " (" attr(href) ")";
    }
}

/* Responsive typography */
@media (max-width: 768px) {
    h1 { 
        font-size: 2.5rem !important; 
        line-height: 1.2 !important;
    }
    h2 { 
        font-size: 2rem !important; 
        line-height: 1.3 !important;
    }
    h3 { 
        font-size: 1.5rem !important; 
    }
    
    .text-7xl { font-size: 3rem !important; }
    .text-6xl { font-size: 2.5rem !important; }
    .text-5xl { font-size: 2rem !important; }
    .text-4xl { font-size: 1.75rem !important; }
    .text-3xl { font-size: 1.5rem !important; }
    .text-2xl { font-size: 1.25rem !important; }
    .text-xl { font-size: 1.125rem !important; }
    
    /* Adjust padding and spacing */
    .py-24 { padding-top: 3rem !important; padding-bottom: 3rem !important; }
    .py-20 { padding-top: 2.5rem !important; padding-bottom: 2.5rem !important; }
    .py-16 { padding-top: 2rem !important; padding-bottom: 2rem !important; }
    .py-12 { padding-top: 1.5rem !important; padding-bottom: 1.5rem !important; }
    
    .px-8 { padding-left: 1rem !important; padding-right: 1rem !important; }
    
    .gap-8 { gap: 1rem !important; }
    .gap-6 { gap: 0.75rem !important; }
    
    .mb-12 { margin-bottom: 2rem !important; }
    .mb-8 { margin-bottom: 1.5rem !important; }
    .mb-6 { margin-bottom: 1rem !important; }
}

@media (max-width: 640px) {
    .text-8xl { font-size: 2.5rem !important; }
    
    /* Force single column on mobile */
    .grid-cols-2,
    .grid-cols-3,
    .grid-cols-4 {
        grid-template-columns: 1fr !important;
    }
}

/* Reduced motion for accessibility */
@media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
}
`;
};

// README content
const generateREADME = (portfolioData, template) => {
  return `# ${portfolioData.name}'s Portfolio

This portfolio was generated using **AI-FOLIO** – *make a portfolio in less than a minute*.

## Template: ${template.name}

${template.description}

## How to Use

1. Open \`index.html\` in your web browser
2. Deploy to any web hosting service (Vercel, Netlify, GitHub Pages, etc.)

## Deployment Instructions

### Vercel
\`\`\`bash
npm install -g vercel
vercel --prod
\`\`\`

### Netlify
1. Drag and drop this folder to https://app.netlify.com/drop
2. Your site will be live instantly!

### GitHub Pages
1. Create a new repository
2. Upload these files
3. Go to Settings → Pages → Select "main" branch
4. Your site will be live at https://username.github.io/repo-name

## Customization

- Edit \`index.html\` to update content
- Modify \`styles.css\` to change styling
- All responsive and works on mobile!

## Technologies Used

- HTML5
- CSS3 (TailwindCSS)
- JavaScript

---

Generated with ❤️ by AI-FOLIO
`;
};

// Main export function
export const generateZip = async (portfolioData, template) => {
  console.log('Generating ZIP with data:', portfolioData);
  console.log('Template:', template.name);
  
  const zip = new JSZip();

  // Try SSR first (only for mapped templates)
  let htmlBody = null;
  if (template && template.id) {
    htmlBody = await trySSRTemplate(template.id, portfolioData);
  }

  // If SSR succeeded, wrap manually; else use existing static generator
  let finalIndex;
  if (htmlBody) {
    // Build head similar to generateHTML but reuse styling config
    const { name, title } = portfolioData;
    finalIndex = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><title>${name} - ${title}</title>
    <script src="https://cdn.tailwindcss.com"></script><script>tailwind.config={theme:{extend:{colors:{fuchsia:{50:'#fdf4ff',100:'#fae8ff',200:'#f5d0fe',300:'#f0abfc',400:'#e879f9',500:'#d946ef',600:'#c026d3',700:'#a21caf',800:'#86198f',900:'#701a75'},purple:{50:'#faf5ff',100:'#f3e8ff',200:'#e9d5ff',300:'#d8b4fe',400:'#c084fc',500:'#a855f7',600:'#9333ea',700:'#7e22ce',800:'#6b21a8',900:'#581c87'},indigo:{50:'#eef2ff',100:'#e0e7ff',200:'#c7d2fe',300:'#a5b4fc',400:'#818cf8',500:'#6366f1',600:'#4f46e5',700:'#4338ca',800:'#3730a3',900:'#312e81'}},blur:{'3xl':'96px'}}}}</script>
    <link rel="preconnect" href="https://fonts.googleapis.com" /><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin /><link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet" /><link rel="stylesheet" href="styles.css" />
    </head><body>${htmlBody}</body></html>`;
  } else {
    finalIndex = generateHTML(portfolioData, template);
  }

  // Add files to zip
  zip.file('index.html', finalIndex);
  zip.file('styles.css', generateCSS(template));
  zip.file('README.md', generateREADME(portfolioData, template));

  // Generate and download zip
  try {
    const content = await zip.generateAsync({ type: 'blob' });
    const fileName = `${portfolioData.name.replace(/\s+/g, '-').toLowerCase()}-portfolio.zip`;
    saveAs(content, fileName);
  } catch (error) {
    console.error('Error generating ZIP:', error);
    throw error;
  }
};
