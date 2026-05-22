import { GoogleGenerativeAI } from '@google/generative-ai';

const MODEL = 'gemini-2.5-flash';

// Increase body size limit for base64 PDF payloads (~10MB)
export const config = {
  api: { bodyParser: { sizeLimit: '12mb' } },
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Service not configured. Contact the site owner.' });
  }

  const { mode, message, history = [], systemPrompt, prompt, base64Data, cfg = {} } = req.body || {};

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: MODEL });

    // --- Chat (multi-turn with history) ---
    if (mode === 'chat') {
      if (!message) return res.status(400).json({ error: 'message is required' });

      const fullHistory = systemPrompt
        ? [{ role: 'user', parts: [{ text: systemPrompt }] }, ...history]
        : history;

      const chat = model.startChat({
        history: fullHistory,
        generationConfig: {
          maxOutputTokens: cfg.maxOutputTokens || 500,
          temperature: cfg.temperature ?? 0.7,
        },
      });

      const result = await chat.sendMessage(message);
      return res.status(200).json({ text: result.response.text() });
    }

    // --- Single-turn text generation ---
    if (mode === 'generate') {
      if (!prompt) return res.status(400).json({ error: 'prompt is required' });

      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          maxOutputTokens: cfg.maxOutputTokens || 3000,
          temperature: cfg.temperature ?? 0.1,
        },
      });
      return res.status(200).json({ text: result.response.text() });
    }

    // --- PDF extraction (base64 inline data) ---
    if (mode === 'pdf') {
      if (!base64Data) return res.status(400).json({ error: 'base64Data is required' });

      const result = await model.generateContent([
        { inlineData: { mimeType: 'application/pdf', data: base64Data } },
        'Extract all text content from this PDF document. Return only the raw text, preserving structure. Include all details: name, contact, work experience, education, skills, and projects.',
      ]);
      return res.status(200).json({ text: result.response.text() });
    }

    return res.status(400).json({ error: `Unknown mode: ${mode}` });

  } catch (err) {
    console.error('[api/gemini] error:', err.message);

    // Surface quota / rate-limit errors clearly
    const msg = err.message || '';
    if (msg.includes('429') || msg.toLowerCase().includes('quota')) {
      return res.status(429).json({ error: 'AI quota reached. Please try again in a moment.' });
    }
    if (msg.includes('503') || msg.toLowerCase().includes('unavailable')) {
      return res.status(503).json({ error: 'AI service is temporarily busy. Please retry.' });
    }

    return res.status(500).json({ error: msg || 'AI request failed. Please try again.' });
  }
}
