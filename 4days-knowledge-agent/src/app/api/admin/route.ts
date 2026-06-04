import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();

  const { data: docs, error } = await supabase
    .from("documents")
    .select("id, filename, status, chunk_count, file_size, created_at, error_message")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { count: totalChunks } = await supabase
    .from("document_chunks")
    .select("*", { count: "exact", head: true });

  const indexed = docs?.filter((d) => d.status === "indexed").length ?? 0;
  const errors = docs?.filter((d) => d.status === "error").length ?? 0;

  return NextResponse.json({
    documents: docs,
    stats: {
      totalDocuments: docs?.length ?? 0,
      indexedDocuments: indexed,
      errorDocuments: errors,
      totalChunks: totalChunks ?? 0,
    },
  });
}
