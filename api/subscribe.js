/**
 * Vercel serverless → MailerLite API
 * Miljövariabler: MAILERLITE_API_TOKEN, MAILERLITE_GROUP_ID (valfritt)
 */

const MAILERLITE_API = 'https://connect.mailerlite.com/api/subscribers';

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function normalizePhone(phone) {
  return phone.replace(/[^\d+]/g, '');
}

function isValidPhone(phone) {
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 7 && digits.length <= 15;
}

module.exports = async (req, res) => {
  setCors(res);

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

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
  const firstName = (body.first_name || '').trim();
  const lastName = (body.last_name || '').trim();
  const company = (body.company || '').trim();
  const employees = (body.employees || '').trim();
  const phoneRaw = (body.phone || '').trim();
  const phone = phoneRaw ? normalizePhone(phoneRaw) : '';
  const consent = body.consent === 'yes' || body.consent === true;

  // Bakåtkompatibilitet om endast "name" skickas
  let name = firstName;
  let last_name = lastName;
  if (!name && !last_name && body.name) {
    const parts = String(body.name).trim().split(/\s+/).filter(Boolean);
    name = parts[0] || '';
    last_name = parts.slice(1).join(' ') || '';
  }

  if (!email || !isValidEmail(email)) {
    return res.status(400).json({ error: 'Ange en giltig e-postadress.' });
  }
  if (!name) {
    return res.status(400).json({ error: 'Förnamn krävs.' });
  }
  if (!last_name) {
    return res.status(400).json({ error: 'Efternamn krävs.' });
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
  if (phone && !isValidPhone(phone)) {
    return res.status(400).json({ error: 'Ange ett giltigt telefonnummer eller lämna fältet tomt.' });
  }

  const fields = { name, last_name, company, employees };
  if (phone) fields.phone = phone;

  const payload = {
    email,
    fields,
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

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Subscribe error', err);
    return res.status(500).json({
      error: 'Ett tekniskt fel uppstod. Försök igen om en stund.',
    });
  }
};
