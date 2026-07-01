/**
 * Skapar IndexNow-verifieringsfilen {API_KEY}.txt i sajtroten vid build/deploy.
 * Kräver miljövariabeln INDEXNOW_API_KEY (Vercel Dashboard eller .env.local).
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

loadLocalEnv();

const key = process.env.INDEXNOW_API_KEY;
if (!key) {
  console.log('INDEXNOW_API_KEY saknas – hoppar över IndexNow-verifieringsfil.');
  process.exit(0);
}

if (!/^[a-zA-Z0-9-]{8,128}$/.test(key)) {
  console.error('INDEXNOW_API_KEY måste vara 8–128 tecken (a-z, A-Z, 0-9, bindestreck).');
  process.exit(1);
}

const outputPath = path.join(process.cwd(), `${key}.txt`);
fs.writeFileSync(outputPath, key, 'utf8');
console.log(`IndexNow-verifieringsfil skapad: ${key}.txt`);
