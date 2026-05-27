/**
 * Indexerar knowledge/*.txt till Supabase (documents + document_chunks + embeddings)
 *
 * Kör: npm run seed:knowledge
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
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

async function findDocumentByFilename(supabase, filename) {
  const { data } = await supabase
    .from('documents')
    .select('id, filename')
    .eq('filename', filename)
    .maybeSingle();
  return data;
}

async function resolveUserId(supabase) {
  const { data, error } = await supabase.auth.admin.listUsers({ perPage: 1 });
  if (error) throw new Error(`Kunde inte hämta användare: ${error.message}`);
  if (data.users?.[0]?.id) return data.users[0].id;
  return null;
}

async function indexFile(supabase, openaiKey, filePath, userId) {
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

  let doc = await findDocumentByFilename(supabase, filename);
  const fileStat = fs.statSync(filePath);

  if (doc) {
    await supabase.from('document_chunks').delete().eq('document_id', doc.id);
    await supabase
      .from('documents')
      .update({ status: 'processing', error_message: null })
      .eq('id', doc.id);
  } else {
    const { data: inserted, error } = await supabase
      .from('documents')
      .insert({
        user_id: userId,
        filename,
        file_path: `knowledge/${filename}`,
        file_size: fileStat.size,
        mime_type: 'text/plain',
        status: 'processing',
      })
      .select('id')
      .single();

    if (error) {
      if (error.message.includes('user_id') || error.code === '23502') {
        throw new Error(
          'Ingen Supabase-användare hittades. Logga in en gång i knowledge-agent (/login) ' +
            'eller kör migration supabase/migrations/003_public_knowledge.sql.'
        );
      }
      throw new Error(`Kunde inte skapa dokument ${filename}: ${error.message}`);
    }
    doc = inserted;
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
    const { error } = await supabase.from('document_chunks').insert(rows.slice(i, i + BATCH));
    if (error) throw new Error(`Chunk insert ${filename}: ${error.message}`);
  }

  await supabase
    .from('documents')
    .update({ status: 'indexed', chunk_count: chunks.length, error_message: null })
    .eq('id', doc.id);

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

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

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

  const userId = await resolveUserId(supabase);
  if (!userId) {
    console.warn('Varning: ingen auth-användare – försöker med user_id null (kräver migration 003).\n');
  }

  for (const file of files) {
    await indexFile(supabase, openaiKey, file, userId);
  }

  console.log('\nKlart! Testa chatten med en fråga om affärsplanen eller FAQ.');
}

main().catch((err) => {
  console.error('\nFel:', err.message);
  process.exit(1);
});
