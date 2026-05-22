// Client-side proxy — all Gemini calls go through /api/gemini (server-side key)

const PROXY = '/api/gemini';

const post = async (body) => {
  const res = await fetch(PROXY, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }

  return data.text;
};

/** Multi-turn chat with optional system prompt */
export const chatWithGemini = ({ message, history = [], systemPrompt, cfg }) =>
  post({ mode: 'chat', message, history, systemPrompt, cfg });

/** Single-turn text/JSON generation */
export const generateWithGemini = ({ prompt, cfg }) =>
  post({ mode: 'generate', prompt, cfg });

/** Extract text from a base64-encoded PDF */
export const extractPDFWithGemini = ({ base64Data }) =>
  post({ mode: 'pdf', base64Data });
