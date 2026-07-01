/**
 * Serverar IndexNow-verifieringsfilen /{INDEXNOW_API_KEY}.txt
 * Anropas via rewrite i vercel.json för .txt-filer som inte finns som statiska filer.
 */

module.exports = (req, res) => {
  const key = process.env.INDEXNOW_API_KEY;
  const filename = req.query.filename || '';

  if (!key) {
    return res.status(500).send('INDEXNOW_API_KEY saknas');
  }

  if (filename !== key) {
    return res.status(404).send('Not Found');
  }

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  return res.status(200).send(key);
};
