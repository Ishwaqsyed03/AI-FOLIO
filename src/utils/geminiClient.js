import { GoogleGenerativeAI } from '@google/generative-ai';

const MODEL_NAME = 'gemini-2.5-flash';
const RUNTIME_KEY_STORAGE = 'ai_folio_gemini_api_key';
const PLACEHOLDER_VALUES = new Set([
  '',
  'your_api_key_here',
  'your_gemini_api_key_here',
  'replace_with_your_key',
]);

let hasPromptedForKey = false;

const sanitizeApiKey = (value) => {
  const key = (value || '').trim();
  if (!key) {
    return '';
  }
  return PLACEHOLDER_VALUES.has(key.toLowerCase()) ? '' : key;
};

const readRuntimeKey = () => {
  if (typeof window === 'undefined') {
    return '';
  }
  try {
    return sanitizeApiKey(window.localStorage.getItem(RUNTIME_KEY_STORAGE));
  } catch {
    return '';
  }
};

const writeRuntimeKey = (apiKey) => {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    const key = sanitizeApiKey(apiKey);
    if (key) {
      window.localStorage.setItem(RUNTIME_KEY_STORAGE, key);
    }
  } catch {
    // Intentionally ignore localStorage write failures.
  }
};

const promptForRuntimeKey = () => {
  if (typeof window === 'undefined' || hasPromptedForKey) {
    return '';
  }

  hasPromptedForKey = true;
  const entered = window.prompt(
    'Gemini API key required for AI features. Paste your Gemini API key to continue (saved only in this browser).'
  );
  const key = sanitizeApiKey(entered);
  if (key) {
    writeRuntimeKey(key);
  }
  return key;
};

export const getGeminiApiKey = ({ allowPrompt = false } = {}) => {
  const runtimeKey = readRuntimeKey();
  if (runtimeKey) {
    return runtimeKey;
  }

  const envKey = sanitizeApiKey(import.meta.env.VITE_GEMINI_API_KEY);
  if (envKey) {
    return envKey;
  }

  if (allowPrompt) {
    return promptForRuntimeKey();
  }

  return '';
};

export const clearRuntimeGeminiKey = () => {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    window.localStorage.removeItem(RUNTIME_KEY_STORAGE);
  } catch {
    // Intentionally ignore localStorage remove failures.
  }
};

export const createGeminiModel = ({ allowPrompt = false } = {}) => {
  const apiKey = getGeminiApiKey({ allowPrompt });
  if (!apiKey) {
    return null;
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ model: MODEL_NAME });
};

export const isGeminiInvalidKeyError = (error) => {
  const message = (error?.message || '').toLowerCase();
  return (
    message.includes('api_key_invalid') ||
    message.includes('api key not valid') ||
    message.includes('apikey invalid') ||
    message.includes('invalid api key')
  );
};

export const toGeminiUserMessage = (error) => {
  if (isGeminiInvalidKeyError(error)) {
    return 'Gemini API key is invalid for this live site. Paste a valid key when prompted, or store it in browser localStorage as ai_folio_gemini_api_key.';
  }

  const message = error?.message || '';
  if (message.toLowerCase().includes('not configured')) {
    return 'Gemini API key is not configured. Paste a valid key when prompted to continue.';
  }

  return message || 'Gemini request failed. Please try again.';
};