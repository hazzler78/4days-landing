/**
 * Vercel serverless: tar emot landningssidans formulär och skapar/uppdaterar
 * prenumerant i MailerLite (dubbel opt-in via status unconfirmed).
 *
 * Miljövariabler (Vercel → Settings → Environment Variables):
 *   MAILERLITE_API_TOKEN  – API-nyckel från MailerLite
 *   MAILERLITE_GROUP_ID   – (valfritt) grupp-ID för "Landningssida" etc.
 */

const MAILERLITE_API = 'https://connect.mailerlite.com/api/subscribers';

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function parseName(fullName) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { name: '', last_name: '' };
  if (parts.length === 1) return { name: parts[0], last_name: '' };
  return { name: parts[0], last_name: parts.slice(1).join(' ') };
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

module.exports = async (req, res) => {
  setCors(res);

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = process.env.MAILERLITE_API_TOKEN;
  if (!token) {
    console.error('MAILERLITE_API_TOKEN saknas');
    return res.status(500).json({ error: 'Serverkonfiguration saknas.' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({ error: 'Ogiltigt JSON-format.' });
    }
  }
  if (!body || typeof body !== 'object') {
    return res.status(400).json({ error: 'Ogiltig förfrågan.' });
  }

  const email = (body.email || '').trim().toLowerCase();
  const name = (body.name || '').trim();
  const company = (body.company || '').trim();
  const employees = (body.employees || '').trim();
  const consent = body.consent === 'yes' || body.consent === true;

  if (!email || !isValidEmail(email)) {
    return res.status(400).json({ error: 'Ange en giltig e-postadress.' });
  }
  if (!name) {
    return res.status(400).json({ error: 'Namn krävs.' });
  }
  if (!company) {
    return res.status(400).json({ error: 'Företag krävs.' });
  }
  if (!employees) {
    return res.status(400).json({ error: 'Välj antal anställda.' });
  }
  if (!consent) {
    return res.status(400).json({ error: 'Du måste godkänna att ta emot tips.' });
  }

  const { name: firstName, last_name: lastName } = parseName(name);

  const payload = {
    email,
    fields: {
      name: firstName,
      last_name: lastName,
      company,
      employees,
    },
    status: 'unconfirmed',
    resubscribe: true,
  };

  const groupId = process.env.MAILERLITE_GROUP_ID;
  if (groupId) {
    payload.groups = groupId.split(',').map((id) => id.trim()).filter(Boolean);
  }

  try {
    const mlRes = await fetch(MAILERLITE_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const mlData = await mlRes.json().catch(() => ({}));

    if (!mlRes.ok) {
      console.error('MailerLite error', mlRes.status, mlData);
      if (mlRes.status === 422) {
        return res.status(400).json({
          error: 'Kunde inte registrera adressen. Kontrollera uppgifterna och försök igen.',
        });
      }
      return res.status(502).json({
        error: 'Kunde inte nå e-posttjänsten. Försök igen om en stund.',
      });
    }

    return res.status(200).json({
      ok: true,
      message: 'Prenumerant registrerad. Bekräftelsemail skickas om dubbel opt-in är aktiverat.',
    });
  } catch (err) {
    console.error('Subscribe error', err);
    return res.status(500).json({
      error: 'Ett tekniskt fel uppstod. Försök igen om en stund.',
    });
  }
};
