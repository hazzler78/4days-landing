import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { processDocument } from "@/lib/documents/process-document";

export async function POST() {
  const supabase = await createClient();

  const { data: docs, error } = await supabase
    .from("documents")
    .select("id, filename")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const results = [];

  for (const doc of docs ?? []) {
    try {
      const { chunkCount } = await processDocument(supabase, doc.id);
      results.push({ id: doc.id, filename: doc.filename, success: true, chunkCount });
    } catch (err) {
      results.push({
        id: doc.id,
        filename: doc.filename,
        success: false,
        error: err instanceof Error ? err.message : "Fel",
      });
    }
  }

  return NextResponse.json({ results });
}
