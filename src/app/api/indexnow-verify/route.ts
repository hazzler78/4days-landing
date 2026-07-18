import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const key = process.env.INDEXNOW_API_KEY;
  const filename = request.nextUrl.searchParams.get("filename") || "";

  if (!key) {
    return new NextResponse("INDEXNOW_API_KEY saknas", { status: 500 });
  }

  if (filename !== key) {
    return new NextResponse("Not Found", { status: 404 });
  }

  return new NextResponse(key, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
