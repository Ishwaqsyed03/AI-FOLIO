const BASE_URL = (import.meta.env.VITE_LOCAL_AI_BASE_URL || 'http://localhost:11435').replace(/\/+$/, '');

const localModelEnabled = () => String(import.meta.env.VITE_ENABLE_LOCAL_MODEL || 'true').toLowerCase() !== 'false';

const requestLocalAI = async (path, body) => {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = payload?.error || `Local AI server request failed (${response.status}).`;
    throw new Error(message);
  }

  const text = String(payload?.text || '').trim();
  if (!text) {
    throw new Error('Local model returned an empty response.');
  }

  return text;
};

export const isLocalModelEnabled = () => localModelEnabled();

export const runLocalChat = async ({ systemPrompt = '', history = [], message = '', temperature = 0.7, maxOutputTokens = 220 }) => {
  if (!localModelEnabled()) {
    throw new Error('Local model is disabled by VITE_ENABLE_LOCAL_MODEL=false');
  }

  return requestLocalAI('/v1/chat', {
    systemPrompt,
    history,
    message,
    options: {
      temperature,
      maxOutputTokens,
    },
  });
};

export const runLocalPrompt = async ({ prompt = '', systemPrompt = '', temperature = 0.3, maxOutputTokens = 900 }) => {
  if (!localModelEnabled()) {
    throw new Error('Local model is disabled by VITE_ENABLE_LOCAL_MODEL=false');
  }

  return requestLocalAI('/v1/generate', {
    prompt,
    systemPrompt,
    options: {
      temperature,
      maxOutputTokens,
    },
  });
};
