/**
 * Loggar publika chattmeddelanden till Supabase (service role).
 */

function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return { url: url.replace(/\/$/, ''), key };
}

async function supabaseRequest(config, method, apiPath, body, prefer) {
  const headers = {
    apikey: config.key,
    Authorization: `Bearer ${config.key}`,
    'Content-Type': 'application/json',
  };
  if (prefer) headers.Prefer = prefer;

  const res = await fetch(`${config.url}${apiPath}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!res.ok) {
    const msg =
      typeof data === 'object' && data?.message
        ? data.message
        : text || res.statusText;
    throw new Error(msg);
  }

  return data;
}

/**
 * Säkerställ session och logga senaste user/assistant-växling.
 * Misslyckad loggning ska inte stoppa chat-svar.
 */
async function logChatExchange({
  visitorSessionId,
  pageUrl,
  userAgent,
  userContent,
  assistantContent,
  sources,
}) {
  const config = getSupabaseConfig();
  if (!config || !visitorSessionId) return null;

  try {
    let sessionRows = await supabaseRequest(
      config,
      'GET',
      `/rest/v1/public_chat_sessions?visitor_session_id=eq.${encodeURIComponent(visitorSessionId)}&select=id&limit=1`
    );

    let sessionId = Array.isArray(sessionRows) && sessionRows[0]?.id;

    if (!sessionId) {
      const inserted = await supabaseRequest(
        config,
        'POST',
        '/rest/v1/public_chat_sessions',
        {
          visitor_session_id: visitorSessionId,
          page_url: pageUrl || null,
          user_agent: userAgent || null,
        },
        'return=representation'
      );
      sessionId = Array.isArray(inserted) ? inserted[0]?.id : inserted?.id;
    } else {
      await supabaseRequest(
        config,
        'PATCH',
        `/rest/v1/public_chat_sessions?visitor_session_id=eq.${encodeURIComponent(visitorSessionId)}`,
        {
          page_url: pageUrl || null,
          user_agent: userAgent || null,
          updated_at: new Date().toISOString(),
        }
      );
    }

    if (!sessionId) return null;

    await supabaseRequest(config, 'POST', '/rest/v1/public_chat_messages', {
      session_id: sessionId,
      role: 'user',
      content: userContent,
    });

    await supabaseRequest(config, 'POST', '/rest/v1/public_chat_messages', {
      session_id: sessionId,
      role: 'assistant',
      content: assistantContent,
      sources: sources?.length ? sources : null,
    });

    return sessionId;
  } catch (err) {
    console.error('Chat log error:', err.message);
    return null;
  }
}

module.exports = { logChatExchange };
