/**
 * Vercel serverless – skicka sitemap-URL:er till IndexNow.
 *
 * Skyddas med INDEXNOW_SUBMIT_SECRET (valfritt men rekommenderat).
 * Anropa efter deploy:
 *   curl -X POST "https://www.4days.ai/api/indexnow" \
 *     -H "Authorization: Bearer DITT_HEMLIGA_VARDE"
 */

const fs = require('fs');
const path = require('path');

function getUrlsFromSitemap() {
  const sitemapPath = path.join(process.cwd(), 'sitemap.xml');
  const xml = fs.readFileSync(sitemapPath, 'utf8');
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1].trim());
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Använd POST' });
  }

  const secret = process.env.INDEXNOW_SUBMIT_SECRET;
  if (secret) {
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
    if (token !== secret) {
      return res.status(401).json({ error: 'Ogiltig auktorisation' });
    }
  }

  const key = process.env.INDEXNOW_API_KEY;
  const host = (process.env.INDEXNOW_HOST || 'www.4days.ai').replace(/^https?:\/\//, '').replace(/\/$/, '');

  if (!key) {
    return res.status(500).json({ error: 'INDEXNOW_API_KEY saknas i miljövariabler.' });
  }

  const urlList = getUrlsFromSitemap();
  const keyLocation = `https://${host}/${key}.txt`;
  const payload = { host, key, keyLocation, urlList };

  try {
    const response = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(payload),
    });

    const body = await response.text();
    const ok = response.ok || response.status === 202;

    return res.status(ok ? 200 : response.status).json({
      ok,
      status: response.status,
      submitted: urlList.length,
      keyLocation,
      message: body || (ok ? 'URL:er skickade till IndexNow' : 'IndexNow returnerade fel'),
      urls: urlList,
    });
  } catch (error) {
    console.error('IndexNow-fel:', error);
    return res.status(500).json({ error: 'Kunde inte nå IndexNow API.' });
  }
};
