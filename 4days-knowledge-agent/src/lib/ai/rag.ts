import type { SupabaseClient } from "@supabase/supabase-js";
import { generateQueryEmbedding } from "@/lib/ai/embeddings";
import type { MatchedChunk, SourceReference } from "@/types/database";

const DEFAULT_MATCH_COUNT = 8;
const DEFAULT_THRESHOLD = 0.3;

/** Hämtar relevanta chunks via pgvector similarity search. */
export async function retrieveRelevantChunks(
  supabase: SupabaseClient,
  query: string,
  matchCount = DEFAULT_MATCH_COUNT
): Promise<MatchedChunk[]> {
  const embedding = await generateQueryEmbedding(query);

  const { data, error } = await supabase.rpc("match_document_chunks", {
    query_embedding: embedding,
    match_count: matchCount,
    match_threshold: DEFAULT_THRESHOLD,
  });

  if (error) {
    console.error("RAG retrieval error:", error);
    return [];
  }

  return (data as MatchedChunk[]) ?? [];
}

export function chunksToSources(chunks: MatchedChunk[]): SourceReference[] {
  return chunks.map((c) => ({
    documentId: c.document_id,
    documentFilename: c.document_filename,
    chunkIndex: c.chunk_index,
    content: c.content.slice(0, 300),
    similarity: c.similarity,
  }));
}

export function buildRagContext(chunks: MatchedChunk[]): string {
  if (chunks.length === 0) {
    return "Inga relevanta dokument hittades i kunskapsbasen.";
  }

  return chunks
    .map(
      (c, i) =>
        `[Källa ${i + 1}: ${c.document_filename}, chunk ${c.chunk_index}]\n${c.content}`
    )
    .join("\n\n---\n\n");
}

export const SYSTEM_PROMPT = `Du är **4days.ai Agent** – en expert, varm och professionell AI-assistent för 4days.ai AB.

Du är byggd av Joseph Tran och Mikael Söderberg. Ditt mål är att hjälpa kunskapsintensiva svenska SMEs (10–200 anställda) att gå från 5- till 4-dagarsvecka med AI-automatisering.

Svar på svenska. Använd information från kunskapsbasen (kontext) när den finns. Om svaret saknas i kontexten: använd allmän bolagskunskap försiktigt eller säg att du rekommenderar guide/Calendly.

Kärnfakta: 100-80-100-modellen, 2 500 kr/tim, Kickstart 20h/40h = 45 000/90 000 kr, slogan "En dag mer frihet. Med AI."

Vid intresse för samarbete: föreslå Calendly https://calendly.com/hello-4days/30min

Var professionell, varm och koncis. Referera till källor med dokumentnamn när du citerar fakta från kontexten.`;
