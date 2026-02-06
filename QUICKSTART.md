# Quick Reference - AI Portfolio Maker

## 🚀 Start the App
```bash
npm run dev
```
Then open: http://localhost:3000

## 🔑 Add Your API Key
1. Get key: https://makersuite.google.com/app/apikey
2. Edit `.env` file (created during `npm install`)
3. Add: `VITE_GEMINI_API_KEY=your_key_here`
4. Restart server

Optional one-command setup:
```bash
# macOS/Linux
VITE_GEMINI_API_KEY=your_key_here npm install

# Windows (PowerShell)
$env:VITE_GEMINI_API_KEY="your_key_here"; npm install
```

## 📦 Build & Deploy
```bash
# Build
npm run build

# Deploy to Vercel
vercel --prod

# Or drag 'dist' folder to Netlify
```

## ✨ Features Checklist
- ✅ AI Chatbot with Gemini API
- ✅ Smart suggestion chips after each response
- ✅ 10 premium portfolio templates
- ✅ Live preview (desktop/tablet/mobile)
- ✅ Download as ZIP file
- ✅ Framer Motion animations
- ✅ Fully responsive
- ✅ No backend required
- ✅ Ready for deployment

## 🎨 10 Templates Available
1. Modern Minimal
2. Creative Gradient
3. Professional Dark
4. Bold Colorful
5. Elegant Classic
6. Tech Futuristic
7. Clean Corporate
8. Artistic Portfolio
9. Developer Showcase
10. Designer Creative

## 📁 Key Files
- `src/components/ChatBot.jsx` - Main chatbot with suggestions
- `src/templates/` - All 10 portfolio templates
- `src/utils/gemini.js` - AI logic + suggestion generation
- `src/utils/zipGenerator.js` - Download functionality
- `.env` - Your API key goes here

## 🆘 Need Help?
- Read `GETTING_STARTED.md` for detailed guide
- Read `README.md` for full documentation
- Check that API key is set in `.env`
- Make sure dev server is running

## 🎯 User Flow
1. Chat with AI → Answer questions (use suggestion chips!)
2. Select Template → Choose from 10 designs
3. Preview → View in different screen sizes
4. Download → Get complete portfolio ZIP

**That's it! You're ready to create amazing portfolios! 🎉**
