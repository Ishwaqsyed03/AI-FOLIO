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

const promptForRuntimeKey = ({ force = false } = {}) => {
  if (typeof window === 'undefined' || (hasPromptedForKey && !force)) {
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

export const getGeminiApiKey = ({ allowPrompt = false, preferPrompt = false, forcePrompt = false } = {}) => {
  const runtimeKey = readRuntimeKey();
  if (runtimeKey) {
    return runtimeKey;
  }

  if (allowPrompt && preferPrompt) {
    const promptedKey = promptForRuntimeKey({ force: forcePrompt });
    if (promptedKey) {
      return promptedKey;
    }
  }

  const envKey = sanitizeApiKey(import.meta.env.VITE_GEMINI_API_KEY);
  if (envKey) {
    return envKey;
  }

  if (allowPrompt) {
    return promptForRuntimeKey({ force: forcePrompt });
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

export const resetGeminiPromptState = () => {
  hasPromptedForKey = false;
};

export const createGeminiModel = ({ allowPrompt = false, preferPrompt = false, forcePrompt = false } = {}) => {
  const apiKey = getGeminiApiKey({ allowPrompt, preferPrompt, forcePrompt });
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

export const isGeminiRateLimitError = (error) => {
  const message = (error?.message || '').toLowerCase();
  return (
    message.includes('429') ||
    message.includes('quota') ||
    message.includes('rate limit') ||
    message.includes('rate-limit') ||
    message.includes('generate_requestsperdayperprojectpermodel') ||
    message.includes('free_tier_requests')
  );
};

export const isGeminiServiceBusyError = (error) => {
  const message = (error?.message || '').toLowerCase();
  return (
    message.includes('503') ||
    message.includes('service unavailable') ||
    message.includes('temporarily unavailable') ||
    message.includes('high demand')
  );
};

export const toGeminiUserMessage = (error) => {
  if (isGeminiInvalidKeyError(error)) {
    return 'Gemini API key is invalid for this live site. Paste a valid key when prompted, or store it in browser localStorage as ai_folio_gemini_api_key.';
  }

  if (isGeminiRateLimitError(error)) {
    return 'Gemini request limit reached (HTTP 429). You have hit the current quota for this API key. Wait for quota reset, switch to a billed key/project, or add another valid Gemini key and retry.';
  }

  if (isGeminiServiceBusyError(error)) {
    return 'Gemini is temporarily busy (HTTP 503/high demand). Please retry in a few moments.';
  }

  const message = error?.message || '';
  if (message.toLowerCase().includes('not configured')) {
    return 'Gemini API key is not configured. Paste a valid key when prompted to continue.';
  }

  return message || 'Gemini request failed. Please try again.';
};