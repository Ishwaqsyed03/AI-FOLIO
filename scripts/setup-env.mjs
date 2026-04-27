import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const envPath = path.join(repoRoot, '.env');
const examplePath = path.join(repoRoot, '.env.example');
const apiKey = process.env.VITE_GEMINI_API_KEY || '';
const hfApiKey = process.env.VITE_HF_API_KEY || '';

if (fs.existsSync(envPath)) {
  console.log('setup-env: .env already exists.');
  process.exit(0);
}

if (apiKey || hfApiKey) {
  const lines = [];
  if (apiKey) lines.push(`VITE_GEMINI_API_KEY=${apiKey}`);
  if (hfApiKey) lines.push(`VITE_HF_API_KEY=${hfApiKey}`);
  fs.writeFileSync(envPath, `${lines.join('\n')}\n`);
  console.log('setup-env: Created .env from provided environment variables.');
  process.exit(0);
}

if (!fs.existsSync(examplePath)) {
  console.warn('setup-env: .env.example not found. Skipping.');
  process.exit(0);
}

fs.copyFileSync(examplePath, envPath);
console.log('setup-env: Created .env from .env.example. Add your Gemini API key.');
