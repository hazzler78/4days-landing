import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";

async function getUrlsFromSitemap() {
  const candidates = [
    path.join(process.cwd(), "public", "sitemap.xml"),
    path.join(process.cwd(), "sitemap.xml"),
  ];

  for (const sitemapPath of candidates) {
    try {
      const xml = await fs.readFile(sitemapPath, "utf8");
      return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) =>
        match[1].trim()
      );
    } catch {
      /* try next */
    }
  }

  return [];
}

export async function POST(request: Request) {
  const secret = process.env.INDEXNOW_SUBMIT_SECRET;
  if (secret) {
    const auth = request.headers.get("authorization") || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
    if (token !== secret) {
      return NextResponse.json(
        { error: "Ogiltig auktorisation" },
        { status: 401 }
      );
    }
  }

  const key = process.env.INDEXNOW_API_KEY;
  const host = (process.env.INDEXNOW_HOST || "www.4days.ai")
    .replace(/^https?:\/\//, "")
    .replace(/\/$/, "");

  if (!key) {
    return NextResponse.json(
      { error: "INDEXNOW_API_KEY saknas i miljövariabler." },
      { status: 500 }
    );
  }

  const urlList = await getUrlsFromSitemap();
  if (urlList.length === 0) {
    return NextResponse.json(
      { error: "Kunde inte läsa URL:er från sitemap.xml." },
      { status: 500 }
    );
  }

  const keyLocation = `https://${host}/${key}.txt`;
  const payload = { host, key, keyLocation, urlList };

  try {
    const response = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(payload),
    });

    const body = await response.text();
    const ok = response.ok || response.status === 202;

    return NextResponse.json(
      {
        ok,
        status: response.status,
        submitted: urlList.length,
        keyLocation,
        message:
          body ||
          (ok
            ? "URL:er skickade till IndexNow"
            : "IndexNow returnerade fel"),
        urls: urlList,
      },
      { status: ok ? 200 : response.status }
    );
  } catch (error) {
    console.error("IndexNow-fel:", error);
    return NextResponse.json(
      { error: "Kunde inte nå IndexNow API." },
      { status: 500 }
    );
  }
}
