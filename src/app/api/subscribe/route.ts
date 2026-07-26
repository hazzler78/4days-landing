import { NextResponse } from "next/server";

const MAILERLITE_API = "https://connect.mailerlite.com/api/subscribers";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function normalizePhone(phone: string) {
  return phone.replace(/[^\d+]/g, "");
}

function isValidPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 7 && digits.length <= 15;
}

export async function POST(request: Request) {
  const token = process.env.MAILERLITE_API_TOKEN;
  if (!token) {
    console.error("MAILERLITE_API_TOKEN saknas");
    return NextResponse.json(
      { error: "Serverkonfiguration saknas." },
      { status: 500 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Ogiltigt JSON-format." },
      { status: 400 }
    );
  }

  const email = String(body.email || "")
    .trim()
    .toLowerCase();
  const firstName = String(body.first_name || body.firstName || "").trim();
  const lastName = String(body.last_name || body.lastName || "").trim();
  const company = String(body.company || "").trim();
  const role = String(body.role || "").trim();
  const employees = String(body.employees || "").trim();
  const phoneRaw = String(body.phone || "").trim();
  const phone = phoneRaw ? normalizePhone(phoneRaw) : "";
  const consent = body.consent === "yes" || body.consent === true;

  let name = firstName;
  let last_name = lastName;
  if (!name && !last_name && body.name) {
    const parts = String(body.name).trim().split(/\s+/).filter(Boolean);
    name = parts[0] || "";
    last_name = parts.slice(1).join(" ") || "";
  }

  if (!email || !isValidEmail(email)) {
    return NextResponse.json(
      { error: "Ange en giltig e-postadress." },
      { status: 400 }
    );
  }
  if (!name) {
    return NextResponse.json({ error: "Förnamn krävs." }, { status: 400 });
  }
  if (!last_name) {
    return NextResponse.json({ error: "Efternamn krävs." }, { status: 400 });
  }
  if (!company) {
    return NextResponse.json({ error: "Företag krävs." }, { status: 400 });
  }
  if (!consent) {
    return NextResponse.json(
      { error: "Du måste godkänna att ta emot tips." },
      { status: 400 }
    );
  }
  if (phone && !isValidPhone(phone)) {
    return NextResponse.json(
      {
        error:
          "Ange ett giltigt telefonnummer eller lämna fältet tomt.",
      },
      { status: 400 }
    );
  }

  const source = String(body.source || "").trim();
  const tags = String(body.tags || "").trim();

  const fields: Record<string, string> = {
    name,
    last_name,
    company,
  };
  if (role) fields.role = role;
  if (employees) fields.employees = employees;
  if (phone) fields.phone = phone;
  if (source) fields.source = source;
  if (tags) fields.tags = tags;

  const payload: Record<string, unknown> = {
    email,
    fields,
    status: "unconfirmed",
    resubscribe: true,
  };

  const groupIds = new Set<string>();
  const defaultGroupId = process.env.MAILERLITE_GROUP_ID;
  const hermesGroupId = process.env.MAILERLITE_HERMES_GROUP_ID;

  const isHermesLead =
    source === "hermes-start" || source === "hermes-guide";

  if (isHermesLead && hermesGroupId) {
    // Hermes one-click / tips-mejl: endast Hermes-gruppen (separat automation)
    hermesGroupId
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean)
      .forEach((id) => groupIds.add(id));
  } else if (defaultGroupId) {
    defaultGroupId
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean)
      .forEach((id) => groupIds.add(id));
  }

  if (groupIds.size > 0) {
    payload.groups = Array.from(groupIds);
  }

  try {
    const mlRes = await fetch(MAILERLITE_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const mlData = await mlRes.json().catch(() => ({}));

    if (!mlRes.ok) {
      console.error("MailerLite error", mlRes.status, mlData);
      if (mlRes.status === 422) {
        return NextResponse.json(
          {
            error:
              "Kunde inte registrera adressen. Kontrollera uppgifterna och försök igen.",
          },
          { status: 400 }
        );
      }
      return NextResponse.json(
        {
          error: "Kunde inte nå e-posttjänsten. Försök igen om en stund.",
        },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Subscribe error", err);
    return NextResponse.json(
      { error: "Ett tekniskt fel uppstod. Försök igen om en stund." },
      { status: 500 }
    );
  }
}
