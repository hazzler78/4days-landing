/**
 * Publik chatbot → Grok (xAI) + Supabase RAG
 * Miljövariabler: XAI_API_KEY, OPENAI_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 */

const { buildSystemPrompt } = require('../lib/agent-prompt');
const { logChatExchange } = require('../lib/chat-log');

const XAI_API = 'https://api.x.ai/v1/chat/completions';
const OPENAI_EMBEDDINGS_API = 'https://api.openai.com/v1/embeddings';
const EMBEDDING_MODEL = 'text-embedding-3-small';
const CHAT_MODEL = process.env.XAI_MODEL || 'grok-3-mini';
const MAX_MESSAGES = 20;
const MAX_USER_CHARS = 2000;

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return { url: url.replace(/\/$/, ''), key };
}

async function generateQueryEmbedding(query, openaiKey) {
  const res = await fetch(OPENAI_EMBEDDINGS_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${openaiKey}`,
    },
    body: JSON.stringify({
      model: EMBEDDING_MODEL,
      input: query,
      dimensions: 1536,
    }),
  });

  if (!res.ok) {
    console.error('OpenAI embedding error', res.status, await res.text());
    return null;
  }

  const data = await res.json();
  return data?.data?.[0]?.embedding ?? null;
}

async function retrieveRelevantChunks(query, openaiKey) {
  const supabase = getSupabaseConfig();
  if (!supabase || !openaiKey) return [];

  try {
    const embedding = await generateQueryEmbedding(query, openaiKey);
    if (!embedding) return [];

    const res = await fetch(`${supabase.url}/rest/v1/rpc/match_document_chunks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: supabase.key,
        Authorization: `Bearer ${supabase.key}`,
      },
      body: JSON.stringify({
        query_embedding: embedding,
        match_count: 8,
        match_threshold: 0.3,
      }),
    });

    if (!res.ok) {
      console.error('Supabase RAG error', res.status, await res.text());
      return [];
    }

    return res.json();
  } catch (err) {
    console.error('Supabase RAG unreachable:', err instanceof Error ? err.message : err);
    return [];
  }
}

function buildRagContext(chunks) {
  if (!Array.isArray(chunks) || chunks.length === 0) {
    return '';
  }

  return chunks
    .map(
      (c, i) =>
        `[Källa ${i + 1}: ${c.document_filename || 'dokument'}, chunk ${c.chunk_index}]\n${c.content}`
    )
    .join('\n\n---\n\n');
}

function normalizeMessages(messages) {
  if (!Array.isArray(messages)) return [];

  return messages
    .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .map((m) => ({
      role: m.role,
      content: m.content.trim().slice(0, MAX_USER_CHARS),
    }))
    .filter((m) => m.content.length > 0)
    .slice(-MAX_MESSAGES);
}

async function chatWithGrok(systemPrompt, messages, xaiKey) {
  const res = await fetch(XAI_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${xaiKey}`,
    },
    body: JSON.stringify({
      model: CHAT_MODEL,
      temperature: 0.6,
      messages: [{ role: 'system', content: systemPrompt }, ...messages],
    }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const msg = data?.error?.message || data?.error || `xAI svarade ${res.status}`;
    throw new Error(msg);
  }

  const reply = data?.choices?.[0]?.message?.content;
  if (!reply) throw new Error('Tomt svar från xAI');
  return reply.trim();
}

const CHAT_BUSY_MESSAGE =
  'Hög belastning just nu – vänta en stund och försök igen.';

const CHAT_UNAVAILABLE_MESSAGE =
  'Jag kunde inte svara just nu. Prova igen om en stund, eller maila hello@4days.ai så hjälper vi dig personligen.';

function formatChatError(error) {
  const message = error instanceof Error ? error.message : String(error);

  // Tekniska detaljer loggas i catch – aldrig visa credits, API-nycklar eller infra till besökare.
  if (message.includes('rate limit') || message.includes('429')) {
    return CHAT_BUSY_MESSAGE;
  }
  return CHAT_UNAVAILABLE_MESSAGE;
}

module.exports = async (req, res) => {
  setCors(res);

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const xaiKey = process.env.XAI_API_KEY;
  if (!xaiKey) {
    console.error('XAI_API_KEY saknas');
    return res.status(503).json({ error: CHAT_UNAVAILABLE_MESSAGE });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({ error: 'Ogiltigt JSON-format.' });
    }
  }

  const messages = normalizeMessages(body?.messages);
  if (messages.length === 0) {
    return res.status(400).json({ error: 'Skicka minst ett meddelande.' });
  }

  const lastUser = [...messages].reverse().find((m) => m.role === 'user');
  if (!lastUser) {
    return res.status(400).json({ error: 'Ingen användarfråga hittades.' });
  }

  try {
    const openaiKey = process.env.OPENAI_API_KEY;
    const chunks = await retrieveRelevantChunks(lastUser.content, openaiKey);
    const ragContext = buildRagContext(chunks);
    const systemPrompt = buildSystemPrompt(ragContext);
    const reply = await chatWithGrok(systemPrompt, messages, xaiKey);

    const sources = Array.isArray(chunks)
      ? chunks.slice(0, 4).map((c) => ({
          document: c.document_filename,
          chunk: c.chunk_index,
          similarity: c.similarity,
        }))
      : [];

    const visitorSessionId =
      typeof body?.visitorSessionId === 'string' ? body.visitorSessionId.trim().slice(0, 64) : '';

    await logChatExchange({
      visitorSessionId,
      pageUrl: typeof body?.pageUrl === 'string' ? body.pageUrl.slice(0, 500) : '',
      userAgent: req.headers['user-agent'] || '',
      userContent: lastUser.content,
      assistantContent: reply,
      sources,
    });

    return res.status(200).json({ reply, sources });
  } catch (err) {
    console.error('Chat error', err);
    return res.status(502).json({ error: formatChatError(err) });
  }
};
