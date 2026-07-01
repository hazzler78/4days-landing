/**
 * Skickar alla URL:er i sitemap.xml till IndexNow (Bing m.fl.).
 *
 * Kör lokalt:
 *   npm run indexnow
 *
 * Kräver INDEXNOW_API_KEY i .env.local eller Vercel-miljön.
 */

const fs = require('fs');
const path = require('path');

function loadLocalEnv() {
  for (const file of ['.env.local', '.env']) {
    const filePath = path.join(process.cwd(), file);
    if (!fs.existsSync(filePath)) continue;

    for (const line of fs.readFileSync(filePath, 'utf8').split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const separator = trimmed.indexOf('=');
      if (separator === -1) continue;

      const key = trimmed.slice(0, separator).trim();
      const value = trimmed.slice(separator + 1).trim();
      if (!process.env[key]) process.env[key] = value;
    }
  }
}

function getUrlsFromSitemap(sitemapPath) {
  const xml = fs.readFileSync(sitemapPath, 'utf8');
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1].trim());
}

loadLocalEnv();

const key = process.env.INDEXNOW_API_KEY;
const host = (process.env.INDEXNOW_HOST || 'www.4days.ai').replace(/^https?:\/\//, '').replace(/\/$/, '');

if (!key) {
  console.error('Saknar INDEXNOW_API_KEY. Lägg den i .env.local eller Vercel Environment Variables.');
  process.exit(1);
}

const sitemapPath = path.join(process.cwd(), 'sitemap.xml');
if (!fs.existsSync(sitemapPath)) {
  console.error('Hittar inte sitemap.xml');
  process.exit(1);
}

const urlList = getUrlsFromSitemap(sitemapPath);
if (urlList.length === 0) {
  console.error('Inga URL:er hittades i sitemap.xml');
  process.exit(1);
}

const keyLocation = `https://${host}/${key}.txt`;
const payload = { host, key, keyLocation, urlList };

async function submit() {
  const response = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(payload),
  });

  const body = await response.text();
  if (response.ok || response.status === 202) {
    console.log(`IndexNow OK (${response.status}) – ${urlList.length} URL:er skickade.`);
    console.log(`Verifieringsfil: ${keyLocation}`);
    return;
  }

  console.error(`IndexNow misslyckades (${response.status}): ${body || 'inget svar'}`);
  process.exit(1);
}

submit().catch((error) => {
  console.error('IndexNow-fel:', error.message);
  process.exit(1);
});
