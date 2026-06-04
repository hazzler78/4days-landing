import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();

  const { data: settings, error: settingsError } = await supabase
    .from("app_settings")
    .select("*")
    .eq("id", 1)
    .single();

  if (settingsError) {
    return NextResponse.json({ error: settingsError.message }, { status: 500 });
  }

  const { data: docs, error: docsError } = await supabase
    .from("documents")
    .select("id, filename, status, chunk_count, created_at")
    .order("created_at", { ascending: false });

  if (docsError) {
    return NextResponse.json({ error: docsError.message }, { status: 500 });
  }

  const { count: totalChunks } = await supabase
    .from("document_chunks")
    .select("*", { count: "exact", head: true });

  return NextResponse.json({
    settings,
    documents: docs,
    totalChunks: totalChunks ?? 0,
    totalDocuments: docs?.length ?? 0,
  });
}

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const body = await request.json();

  const { chunk_size, chunk_overlap } = body;

  if (
    typeof chunk_size !== "number" ||
    typeof chunk_overlap !== "number" ||
    chunk_size < 200 ||
    chunk_size > 4000 ||
    chunk_overlap < 0 ||
    chunk_overlap >= chunk_size
  ) {
    return NextResponse.json({ error: "Ogiltiga inställningar" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("app_settings")
    .update({ chunk_size, chunk_overlap })
    .eq("id", 1)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
