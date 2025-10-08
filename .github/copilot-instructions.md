# Copilot Instructions

This is the AI Portfolio Maker project - a frontend-only React application that uses Google Gemini API to create beautiful portfolio websites through conversational AI.

## Project Overview

- **Type**: Frontend-only web application
- **Framework**: React + Vite
- **Styling**: TailwindCSS with Framer Motion
- **AI Integration**: Google Gemini API (client-side)
- **Key Features**: 
  - Conversational chatbot for data collection
  - 10 premium portfolio templates
  - Live preview with responsive modes
  - ZIP file generation for download
  - Suggestion chips after each chatbot response

## Key Technologies

- React 18
- TailwindCSS
- Framer Motion
- Google Generative AI SDK
- JSZip + FileSaver.js
- Lucide React (icons)
- Vite

## Project Structure

- `/src/components/` - Main React components (ChatBot, TemplateSelector, LivePreview)
- `/src/templates/` - 10 portfolio template components
- `/src/utils/` - Utility functions (Gemini API, ZIP generation)
- `/public/` - Static assets

## Important Notes

- All logic is client-side (no backend)
- Requires Gemini API key in `.env` file
- Fully responsive design
- Ready for Vercel deployment

## Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
