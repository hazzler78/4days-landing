/**
 * Indexerar knowledge/*.txt till Supabase (documents + document_chunks + embeddings)
 * Använder REST API direkt (ingen WebSocket – fungerar i Node 20).
 *
 * Kör: npm run seed:knowledge
 */

const fs = require('fs');
const path = require('path');
const { chunkText } = require('./lib/chunk-text');

const KNOWLEDGE_DIR = path.join(__dirname, '..', 'knowledge');
const EMBEDDING_MODEL = 'text-embedding-3-small';
const CHUNK_SIZE = 1000;
const CHUNK_OVERLAP = 200;

function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env');
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    const val = trimmed.slice(idx + 1).trim();
    if (!process.env[key]) process.env[key] = val;
  }
}

function createSupabaseRest(baseUrl, serviceKey) {
  const root = baseUrl.replace(/\/$/, '');

  async function request(method, apiPath, body, prefer) {
    const headers = {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      'Content-Type': 'application/json',
    };
    if (prefer) headers.Prefer = prefer;

    const res = await fetch(`${root}${apiPath}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    const text = await res.text();
    let data = null;
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }
    }

    if (!res.ok) {
      const msg =
        typeof data === 'object' && data?.message
          ? data.message
          : typeof data === 'object' && data?.error
            ? data.error
            : text || res.statusText;
      const err = new Error(msg);
      err.status = res.status;
      err.code = data?.code;
      throw err;
    }

    return data;
  }

  return {
    async findDocumentByFilename(filename) {
      const rows = await request(
        'GET',
        `/rest/v1/documents?filename=eq.${encodeURIComponent(filename)}&select=id,filename&limit=1`
      );
      return Array.isArray(rows) && rows[0] ? rows[0] : null;
    },

    async resolveUserId() {
      try {
        const data = await request('GET', '/auth/v1/admin/users?page=1&per_page=1');
        return data?.users?.[0]?.id ?? null;
      } catch {
        return null;
      }
    },

    async deleteChunks(documentId) {
      await request('DELETE', `/rest/v1/document_chunks?document_id=eq.${documentId}`);
    },

    async updateDocument(id, fields) {
      await request('PATCH', `/rest/v1/documents?id=eq.${id}`, fields);
    },

    async insertDocument(row) {
      const rows = await request('POST', '/rest/v1/documents', row, 'return=representation');
      return Array.isArray(rows) ? rows[0] : rows;
    },

    async insertChunks(rows) {
      await request('POST', '/rest/v1/document_chunks', rows);
    },
  };
}

async function generateEmbeddings(texts, openaiKey) {
  if (texts.length === 0) return [];

  const res = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${openaiKey}`,
    },
    body: JSON.stringify({
      model: EMBEDDING_MODEL,
      input: texts,
      dimensions: 1536,
    }),
  });

  if (!res.ok) {
    throw new Error(`OpenAI embeddings failed: ${res.status} ${await res.text()}`);
  }

  const data = await res.json();
  return data.data.sort((a, b) => a.index - b.index).map((d) => d.embedding);
}

async function indexFile(sb, openaiKey, filePath, userId) {
  const filename = path.basename(filePath);
  const text = fs.readFileSync(filePath, 'utf8');

  if (text.trim().length < 20) {
    console.log(`  SKIP ${filename} (för kort)`);
    return;
  }

  const chunks = chunkText(text, CHUNK_SIZE, CHUNK_OVERLAP);
  if (chunks.length === 0) {
    console.log(`  SKIP ${filename} (inga chunks)`);
    return;
  }

  let doc = await sb.findDocumentByFilename(filename);
  const fileStat = fs.statSync(filePath);

  if (doc) {
    await sb.deleteChunks(doc.id);
    await sb.updateDocument(doc.id, { status: 'processing', error_message: null });
  } else {
    try {
      doc = await sb.insertDocument({
        user_id: userId,
        filename,
        file_path: `knowledge/${filename}`,
        file_size: fileStat.size,
        mime_type: 'text/plain',
        status: 'processing',
      });
    } catch (err) {
      if (err.message.includes('user_id') || err.code === '23502') {
        throw new Error(
          'Ingen Supabase-användare hittades. Kör migration 003_public_knowledge.sql ' +
            'eller logga in en gång i knowledge-agent (/login).'
        );
      }
      throw new Error(`Kunde inte skapa dokument ${filename}: ${err.message}`);
    }
  }

  const embeddings = await generateEmbeddings(chunks, openaiKey);

  const rows = chunks.map((content, index) => ({
    document_id: doc.id,
    chunk_index: index,
    content,
    embedding: embeddings[index],
  }));

  const BATCH = 50;
  for (let i = 0; i < rows.length; i += BATCH) {
    try {
      await sb.insertChunks(rows.slice(i, i + BATCH));
    } catch (err) {
      throw new Error(`Chunk insert ${filename}: ${err.message}`);
    }
  }

  await sb.updateDocument(doc.id, {
    status: 'indexed',
    chunk_count: chunks.length,
    error_message: null,
  });

  console.log(`  OK ${filename} → ${chunks.length} chunks`);
}

async function main() {
  loadEnv();

  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  if (!supabaseUrl || !serviceKey) {
    console.error('Saknas SUPABASE_URL och SUPABASE_SERVICE_ROLE_KEY i .env');
    process.exit(1);
  }
  if (!openaiKey) {
    console.error('Saknas OPENAI_API_KEY i .env');
    process.exit(1);
  }

  const sb = createSupabaseRest(supabaseUrl, serviceKey);

  const files = fs
    .readdirSync(KNOWLEDGE_DIR)
    .filter((f) => f.endsWith('.txt'))
    .map((f) => path.join(KNOWLEDGE_DIR, f))
    .sort();

  if (files.length === 0) {
    console.error('Inga .txt-filer i knowledge/');
    process.exit(1);
  }

  console.log(`Indexerar ${files.length} filer till Supabase…\n`);

  const userId = await sb.resolveUserId();
  if (!userId) {
    console.log('Ingen auth-användare – använder user_id null (migration 003).\n');
  }

  for (const file of files) {
    await indexFile(sb, openaiKey, file, userId);
  }

  console.log('\nKlart! Testa chatten med en fråga om affärsplanen eller FAQ.');
}

main().catch((err) => {
  console.error('\nFel:', err.message);
  process.exit(1);
});
