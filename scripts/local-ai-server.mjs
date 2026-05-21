import cors from 'cors';
import express from 'express';

const PORT = Number(process.env.LOCAL_AI_PORT || 11435);
const OLLAMA_BASE_URL = (process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434').replace(/\/+$/, '');
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3.1:8b-instruct';

const app = express();
app.use(cors());
app.use(express.json({ limit: '8mb' }));

const buildMessages = ({ systemPrompt = '', history = [], message, prompt }) => {
  const messages = [];

  if (systemPrompt && systemPrompt.trim()) {
    messages.push({ role: 'system', content: systemPrompt.trim() });
  }

  for (const item of history) {
    const role = item?.role === 'assistant' ? 'assistant' : 'user';
    const content = String(item?.content || '').trim();
    if (content) {
      messages.push({ role, content });
    }
  }

  if (prompt && String(prompt).trim()) {
    messages.push({ role: 'user', content: String(prompt).trim() });
  }

  if (message && String(message).trim()) {
    messages.push({ role: 'user', content: String(message).trim() });
  }

  return messages;
};

const callOllama = async ({ messages, temperature = 0.5, maxOutputTokens = 600 }) => {
  const payload = {
    model: OLLAMA_MODEL,
    stream: false,
    messages,
    options: {
      temperature,
      num_predict: maxOutputTokens,
    },
  };

  let response;
  try {
    response = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    throw new Error(
      `Unable to connect to Ollama at ${OLLAMA_BASE_URL}. Start Ollama and run: ollama pull ${OLLAMA_MODEL}`
    );
  }

  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorText = body?.error || body?.message || `Ollama request failed with ${response.status}.`;
    throw new Error(errorText);
  }

  const text = String(body?.message?.content || '').trim();
  if (!text) {
    throw new Error('Ollama returned an empty response.');
  }

  return text;
};

app.get('/health', async (_req, res) => {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`);
    if (!response.ok) {
      return res.status(503).json({ ok: false, error: 'Ollama is reachable but not ready.' });
    }
    const body = await response.json().catch(() => ({}));
    const modelNames = Array.isArray(body?.models) ? body.models.map((m) => m.name) : [];
    res.json({ ok: true, model: OLLAMA_MODEL, availableModels: modelNames });
  } catch {
    res.status(503).json({
      ok: false,
      error: `Ollama not reachable at ${OLLAMA_BASE_URL}. Run: ollama serve`,
    });
  }
});

app.post('/v1/chat', async (req, res) => {
  const { systemPrompt = '', history = [], message = '', options = {} } = req.body || {};
  const messages = buildMessages({ systemPrompt, history, message });

  if (!message || !String(message).trim()) {
    return res.status(400).json({ error: 'message is required.' });
  }

  try {
    const text = await callOllama({
      messages,
      temperature: Number(options.temperature ?? 0.7),
      maxOutputTokens: Number(options.maxOutputTokens ?? 220),
    });

    return res.json({ text, provider: 'ollama', model: OLLAMA_MODEL });
  } catch (error) {
    return res.status(503).json({ error: error.message });
  }
});

app.post('/v1/generate', async (req, res) => {
  const { prompt = '', systemPrompt = '', options = {} } = req.body || {};

  if (!prompt || !String(prompt).trim()) {
    return res.status(400).json({ error: 'prompt is required.' });
  }

  const messages = buildMessages({
    systemPrompt: systemPrompt || 'Follow the user prompt exactly and return concise output.',
    prompt,
  });

  try {
    const text = await callOllama({
      messages,
      temperature: Number(options.temperature ?? 0.3),
      maxOutputTokens: Number(options.maxOutputTokens ?? 900),
    });

    return res.json({ text, provider: 'ollama', model: OLLAMA_MODEL });
  } catch (error) {
    return res.status(503).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`[local-ai-server] Listening on http://localhost:${PORT}`);
  console.log(`[local-ai-server] Proxying to ${OLLAMA_BASE_URL} using model ${OLLAMA_MODEL}`);
});
