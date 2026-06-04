import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const EMBEDDING_MODEL = "text-embedding-3-small";
const EMBEDDING_DIMENSIONS = 1536;
const BATCH_SIZE = 100;

/** Genererar embeddings för en lista av text-chunks via OpenAI. */
export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  if (texts.length === 0) return [];

  const allEmbeddings: number[][] = [];

  for (let i = 0; i < texts.length; i += BATCH_SIZE) {
    const batch = texts.slice(i, i + BATCH_SIZE);
    const response = await openai.embeddings.create({
      model: EMBEDDING_MODEL,
      input: batch,
      dimensions: EMBEDDING_DIMENSIONS,
    });

    const sorted = response.data.sort((a, b) => a.index - b.index);
    allEmbeddings.push(...sorted.map((d) => d.embedding));
  }

  return allEmbeddings;
}

/** Genererar embedding för en enskild fråga (RAG retrieval). */
export async function generateQueryEmbedding(query: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: EMBEDDING_MODEL,
    input: query,
    dimensions: EMBEDDING_DIMENSIONS,
  });
  return response.data[0].embedding;
}
