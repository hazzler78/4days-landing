import { NextResponse } from "next/server";
import { getNextSession, invalidWebinarSessions } from "@/content/webinar";
import { buildWebinarIcs } from "@/lib/server/webinar-ics";

export const dynamic = "force-dynamic";

export function GET() {
  const invalid = invalidWebinarSessions();
  if (invalid.length > 0) {
    console.error("Ogiltiga webbinartider i src/content/webinar.ts", invalid);
  }

  const next = getNextSession();
  if (!next) {
    return new NextResponse("Datum för nästa tillfälle är inte satt.\n", {
      status: 404,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  }

  return new NextResponse(buildWebinarIcs(next), {
    status: 200,
    headers: {
      "Content-Type": "text/calendar; charset=utf-8; method=PUBLISH",
      "Content-Disposition": 'inline; filename="webbinar-nasta.ics"',
      "Cache-Control": "public, max-age=60",
    },
  });
}
