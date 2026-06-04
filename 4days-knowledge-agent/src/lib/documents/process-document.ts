import type { SupabaseClient } from "@supabase/supabase-js";
import { extractText } from "@/lib/documents/extract-text";
import { chunkText } from "@/lib/documents/chunk-text";
import { generateEmbeddings } from "@/lib/ai/embeddings";

interface ProcessOptions {
  chunkSize?: number;
  chunkOverlap?: number;
}

/** Laddar ner, extraherar, chunkar och indexerar ett dokument. */
export async function processDocument(
  supabase: SupabaseClient,
  documentId: string,
  options: ProcessOptions = {}
): Promise<{ chunkCount: number }> {
  const { data: doc, error: docError } = await supabase
    .from("documents")
    .select("*")
    .eq("id", documentId)
    .single();

  if (docError || !doc) {
    throw new Error("Dokument hittades inte");
  }

  await supabase
    .from("documents")
    .update({ status: "processing", error_message: null })
    .eq("id", documentId);

  try {
    const { data: fileData, error: downloadError } = await supabase.storage
      .from("documents")
      .download(doc.file_path);

    if (downloadError || !fileData) {
      throw new Error("Kunde inte ladda ner filen från storage");
    }

    const buffer = Buffer.from(await fileData.arrayBuffer());
    const text = await extractText(buffer, doc.filename, doc.mime_type);

    if (!text || text.length < 20) {
      throw new Error("Ingen text kunde extraheras från dokumentet");
    }

    let chunkSize = options.chunkSize ?? 1000;
    let chunkOverlap = options.chunkOverlap ?? 200;

    if (!options.chunkSize) {
      const { data: settings } = await supabase
        .from("app_settings")
        .select("chunk_size, chunk_overlap")
        .eq("id", 1)
        .single();
      if (settings) {
        chunkSize = settings.chunk_size;
        chunkOverlap = settings.chunk_overlap;
      }
    }

    const chunks = chunkText(text, chunkSize, chunkOverlap);

    if (chunks.length === 0) {
      throw new Error("Inga chunks kunde skapas från dokumentet");
    }

    // Ta bort gamla chunks vid re-indexering
    await supabase
      .from("document_chunks")
      .delete()
      .eq("document_id", documentId);

    const embeddings = await generateEmbeddings(chunks);

    const rows = chunks.map((content, index) => ({
      document_id: documentId,
      chunk_index: index,
      content,
      embedding: embeddings[index],
    }));

    // Infoga i batchar om många chunks
    const INSERT_BATCH = 50;
    for (let i = 0; i < rows.length; i += INSERT_BATCH) {
      const batch = rows.slice(i, i + INSERT_BATCH);

      const { error: insertError } = await supabase
        .from("document_chunks")
        .insert(batch);

      if (insertError) throw new Error(insertError.message);
    }

    await supabase
      .from("documents")
      .update({ status: "indexed", chunk_count: chunks.length })
      .eq("id", documentId);

    return { chunkCount: chunks.length };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Okänt fel vid indexering";
    await supabase
      .from("documents")
      .update({ status: "error", error_message: message })
      .eq("id", documentId);
    throw err;
  }
}
