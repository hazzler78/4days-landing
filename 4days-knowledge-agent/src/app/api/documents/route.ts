import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { processDocument } from "@/lib/documents/process-document";
import { isAllowedFile } from "@/lib/utils";

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Ej autentiserad" }, { status: 401 });
  }

  const formData = await request.formData();
  const files = formData.getAll("files") as File[];

  if (!files.length) {
    return NextResponse.json({ error: "Inga filer mottagna" }, { status: 400 });
  }

  const results = [];

  for (const file of files) {
    if (!isAllowedFile(file)) {
      results.push({
        filename: file.name,
        success: false,
        error: "Filtyp stöds inte",
      });
      continue;
    }

    const filePath = `${user.id}/${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from("documents")
      .upload(filePath, file, { upsert: false });

    if (uploadError) {
      results.push({
        filename: file.name,
        success: false,
        error: uploadError.message,
      });
      continue;
    }

    const { data: doc, error: insertError } = await supabase
      .from("documents")
      .insert({
        user_id: user.id,
        filename: file.name,
        file_path: filePath,
        file_size: file.size,
        mime_type: file.type || "application/octet-stream",
        status: "pending",
      })
      .select()
      .single();

    if (insertError || !doc) {
      results.push({
        filename: file.name,
        success: false,
        error: insertError?.message ?? "Kunde inte spara dokument",
      });
      continue;
    }

    try {
      const { chunkCount } = await processDocument(supabase, doc.id);
      results.push({
        filename: file.name,
        success: true,
        documentId: doc.id,
        chunkCount,
      });
    } catch (err) {
      results.push({
        filename: file.name,
        success: false,
        documentId: doc.id,
        error: err instanceof Error ? err.message : "Indexering misslyckades",
      });
    }
  }

  return NextResponse.json({ results });
}
