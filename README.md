# AI Portfolio Maker 🎨✨

Create stunning portfolio websites with the power of AI! AI Portfolio Maker is a frontend-only application that uses conversational AI to collect your information and generates beautiful, ready-to-deploy portfolio websites.

## 🌟 Features

- **🤖 AI-Powered Data Collection**: Interactive chatbot powered by Google Gemini API collects your portfolio information through natural conversation
- **💡 Smart Suggestions**: Get contextual suggestions after every chatbot response for faster data entry
- **🎨 10 Premium Templates**: Choose from 10 professionally designed portfolio templates:
  - Modern Minimal
  - Creative Gradient
  - Professional Dark
  - Bold Colorful
  - Elegant Classic
  - Tech Futuristic
  - Clean Corporate
  - Artistic Portfolio
  - Developer Showcase
  - Designer Creative
- **👀 Live Preview**: See your portfolio come to life in real-time with responsive preview (desktop, tablet, mobile)
- **📦 One-Click Download**: Download your complete portfolio as a .zip file ready for deployment
- **✨ Premium UI**: Framer Motion animations, gradient themes, and glass-morphism effects
- **🚀 No Backend Required**: 100% client-side application
- **📱 Fully Responsive**: All templates work perfectly on all devices

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

### Installation

1. **Clone the repository**
   ```bash
   cd "c:\ishwaq college\projectss\AI-FOLIO"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example env file
   cp .env.example .env
   
   # Edit .env and add your Gemini API key
   # VITE_GEMINI_API_KEY=your_api_key_here
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🎯 How to Use

1. **Chat with AI**: Answer the chatbot's questions about your professional background
   - Name and title
   - Bio/About me
   - Skills
   - Work experience
   - Projects
   - Education
   - Contact information

2. **Use Quick Replies**: Click on suggested responses to speed up the process

3. **Select Template**: Choose from 10 beautiful portfolio designs

4. **Preview**: View your portfolio in desktop, tablet, or mobile view

5. **Download**: Click "Download Portfolio" to get a complete .zip file with:
   - HTML file
   - CSS file
   - README with deployment instructions
   - All assets included

## 📦 What's in the Downloaded Portfolio?

Your downloaded portfolio includes:
- ✅ Complete, standalone HTML file
- ✅ Custom CSS styles
- ✅ README with deployment instructions
- ✅ Fully responsive design
- ✅ Ready to deploy on Vercel, Netlify, GitHub Pages, etc.

## 🌐 Deployment

### Vercel (Recommended)

1. Install Vercel CLI
   ```bash
   npm install -g vercel
   ```

2. Deploy
   ```bash
   npm run build
   vercel --prod
   ```

### Netlify

1. Build the project
   ```bash
   npm run build
   ```

2. Drag and drop the `dist` folder to [Netlify Drop](https://app.netlify.com/drop)

### GitHub Pages

1. Build the project
   ```bash
   npm run build
   ```

2. Push the `dist` folder contents to your GitHub repository
3. Enable GitHub Pages in repository settings

## 🛠️ Technology Stack

- **Frontend Framework**: React 18
- **Styling**: TailwindCSS
- **Animations**: Framer Motion
- **AI Integration**: Google Gemini API
- **File Generation**: JSZip + FileSaver.js
- **Icons**: Lucide React
- **Build Tool**: Vite

## 📁 Project Structure

```
AI-FOLIO/
├── src/
│   ├── components/
│   │   ├── ChatBot.jsx          # AI chatbot interface
│   │   ├── TemplateSelector.jsx # Template selection UI
│   │   └── LivePreview.jsx      # Portfolio preview
│   ├── templates/
│   │   ├── ModernMinimal.jsx
│   │   ├── CreativeGradient.jsx
│   │   ├── ProfessionalDark.jsx
│   │   ├── BoldColorful.jsx
│   │   ├── ElegantClassic.jsx
│   │   ├── TechFuturistic.jsx
│   │   ├── CleanCorporate.jsx
│   │   ├── ArtisticPortfolio.jsx
│   │   ├── DeveloperShowcase.jsx
│   │   ├── DesignerCreative.jsx
│   │   └── index.js
│   ├── utils/
│   │   ├── gemini.js            # Gemini API integration
│   │   └── zipGenerator.js      # ZIP file generation
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── public/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## 🎨 Template Showcase

Each template is carefully crafted with:
- Unique visual design
- Professional typography
- Smooth animations
- Mobile-first responsive design
- Optimized for readability and impact

## 🔧 Configuration

### Gemini API

Create a `.env` file in the root directory:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests
- Add new templates

## 📝 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Google Gemini API for powering the conversational AI
- TailwindCSS for the utility-first styling
- Framer Motion for smooth animations
- The React community

## 📞 Support

If you encounter any issues or have questions:
- Check the [Issues](https://github.com/yourusername/ai-portfolio-maker/issues) page
- Create a new issue with detailed information
- Star ⭐ this repository if you find it useful!

---

**Made with ❤️ and AI**

Happy portfolio building! 🎉
