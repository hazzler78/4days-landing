type SupabaseConfig = { url: string; key: string };

function getSupabaseConfig(): SupabaseConfig | null {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return { url: url.replace(/\/$/, ""), key };
}

async function supabaseRequest(
  config: SupabaseConfig,
  method: string,
  apiPath: string,
  body?: unknown,
  prefer?: string
) {
  const headers: Record<string, string> = {
    apikey: config.key,
    Authorization: `Bearer ${config.key}`,
    "Content-Type": "application/json",
  };
  if (prefer) headers.Prefer = prefer;

  const res = await fetch(`${config.url}${apiPath}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  let data: unknown = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!res.ok) {
    const msg =
      typeof data === "object" &&
      data &&
      "message" in data &&
      typeof (data as { message: unknown }).message === "string"
        ? (data as { message: string }).message
        : text || res.statusText;
    throw new Error(msg);
  }

  return data;
}

export async function logChatExchange({
  visitorSessionId,
  pageUrl,
  userAgent,
  userContent,
  assistantContent,
  sources,
}: {
  visitorSessionId: string;
  pageUrl: string;
  userAgent: string;
  userContent: string;
  assistantContent: string;
  sources: unknown[];
}) {
  const config = getSupabaseConfig();
  if (!config || !visitorSessionId) return null;

  try {
    const sessionRows = (await supabaseRequest(
      config,
      "GET",
      `/rest/v1/public_chat_sessions?visitor_session_id=eq.${encodeURIComponent(visitorSessionId)}&select=id&limit=1`
    )) as Array<{ id: string }> | null;

    let sessionId = Array.isArray(sessionRows) ? sessionRows[0]?.id : undefined;

    if (!sessionId) {
      const inserted = (await supabaseRequest(
        config,
        "POST",
        "/rest/v1/public_chat_sessions",
        {
          visitor_session_id: visitorSessionId,
          page_url: pageUrl || null,
          user_agent: userAgent || null,
        },
        "return=representation"
      )) as Array<{ id: string }>;
      sessionId = inserted?.[0]?.id;
    } else {
      await supabaseRequest(
        config,
        "PATCH",
        `/rest/v1/public_chat_sessions?id=eq.${sessionId}`,
        {
          page_url: pageUrl || null,
          user_agent: userAgent || null,
          last_message_at: new Date().toISOString(),
        }
      );
    }

    if (!sessionId) return null;

    await supabaseRequest(config, "POST", "/rest/v1/public_chat_messages", [
      {
        session_id: sessionId,
        role: "user",
        content: userContent,
      },
      {
        session_id: sessionId,
        role: "assistant",
        content: assistantContent,
        sources: sources || [],
      },
    ]);

    return sessionId;
  } catch (err) {
    console.error(
      "Chat log error",
      err instanceof Error ? err.message : err
    );
    return null;
  }
}
