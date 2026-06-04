import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { processDocument } from "@/lib/documents/process-document";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  try {
    const { chunkCount } = await processDocument(supabase, id);
    return NextResponse.json({ success: true, chunkCount });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Re-indexering misslyckades" },
      { status: 500 }
    );
  }
}
