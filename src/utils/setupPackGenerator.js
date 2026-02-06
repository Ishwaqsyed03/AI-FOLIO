import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const SETUP_README = `# AI-FOLIO Setup Pack\n\nThanks for downloading the setup pack. This zip contains the full source code and configs needed to run the project locally.\n\n## Prerequisites\n- Node.js 18+\n- A Google Gemini API key (https://makersuite.google.com/app/apikey)\n\n## Quick Start\n1. Install dependencies\n   npm install\n\n2. Create your environment file\n   - macOS/Linux: cp .env.example .env\n   - Windows (PowerShell): Copy-Item .env.example .env\n\n3. Add your Gemini API key to .env\n   VITE_GEMINI_API_KEY=your_api_key_here\n\n4. Start the dev server\n   npm run dev\n\n5. Open http://localhost:3000\n\n## Build for Production\n- npm run build\n- npm run preview\n\nFor more details, see README.md and GETTING_STARTED.md in this pack.\n`;

const getSetupPackFiles = () => {
  return import.meta.glob(
    [
      '/src/**/*',
      '/index.html',
      '/package.json',
      '/package-lock.json',
      '/vite.config.js',
      '/tailwind.config.js',
      '/postcss.config.js',
      '/README.md',
      '/GETTING_STARTED.md',
      '/QUICKSTART.md',
      '/vercel.json',
      '/.env.example'
    ],
    { eager: true, as: 'raw' }
  );
};

export const generateSetupPackZip = async () => {
  const zip = new JSZip();
  zip.file('SETUP_PACK_README.md', SETUP_README);

  const files = getSetupPackFiles();
  Object.entries(files).forEach(([path, content]) => {
    if (typeof content !== 'string') return;
    const normalizedPath = path.replace(/^\//, '');
    zip.file(normalizedPath, content);
  });

  const blob = await zip.generateAsync({ type: 'blob' });
  saveAs(blob, 'ai-folio-setup-pack.zip');
};
