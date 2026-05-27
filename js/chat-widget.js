/**
 * 4days.ai Agent – publik chat-widget
 */
(function () {
  const API_URL = '/api/chat';
  const CALENDLY_URL = 'https://calendly.com/hello-4days/30min';
  const STORAGE_KEY = '4days_chat_messages_v1';

  const STARTER_PROMPTS = [
    'Hur fungerar 4-dagarsvecka hos er?',
    'Vad kostar AI Kickstart?',
    'Jag vill boka ett möte',
  ];

  const styles = `
    #fourdays-chat-root { --fd-brand:#0A2540; --fd-accent:#00D4FF; --fd-growth:#00C48C; font-family:Inter,system-ui,sans-serif; }
    #fourdays-chat-launcher {
      position:fixed; bottom:1.25rem; right:1.25rem; z-index:90;
      display:flex; align-items:center; gap:.5rem;
      padding:.75rem 1rem; border:none; border-radius:9999px;
      background:linear-gradient(135deg,var(--fd-accent),#00b8e0);
      color:var(--fd-brand); font-weight:700; font-size:.875rem;
      box-shadow:0 10px 30px rgba(0,212,255,.35);
      cursor:pointer; transition:transform .2s, box-shadow .2s;
    }
    #fourdays-chat-launcher:hover { transform:translateY(-2px); box-shadow:0 14px 36px rgba(0,212,255,.45); }
    #fourdays-chat-panel {
      position:fixed; bottom:5.5rem; right:1.25rem; z-index:91;
      width:min(420px,calc(100vw - 1.5rem)); height:min(640px,calc(100vh - 7rem));
      display:none; flex-direction:column; overflow:hidden;
      border-radius:1rem; border:1px solid rgba(0,212,255,.25);
      background:#fff; box-shadow:0 24px 60px rgba(10,37,64,.25);
    }
    #fourdays-chat-panel.open { display:flex; }
    .dark #fourdays-chat-panel { background:#0f3354; border-color:rgba(0,212,255,.2); }
    #fourdays-chat-header {
      display:flex; align-items:center; justify-content:space-between; gap:.75rem;
      padding:1rem 1rem .875rem; background:var(--fd-brand); color:#fff;
    }
    #fourdays-chat-header strong { display:block; font-size:.95rem; }
    #fourdays-chat-header span { font-size:.75rem; color:#cbd5e1; }
    #fourdays-chat-close {
      border:none; background:rgba(255,255,255,.12); color:#fff;
      width:2rem; height:2rem; border-radius:.5rem; cursor:pointer; font-size:1.1rem;
    }
    #fourdays-chat-messages {
      flex:1; overflow-y:auto; padding:1rem; display:flex; flex-direction:column; gap:.75rem;
      background:linear-gradient(180deg,#f8fafc 0%,#fff 100%);
    }
    .dark #fourdays-chat-messages { background:linear-gradient(180deg,#061a2b 0%,#0f3354 100%); }
    .fd-msg { max-width:88%; padding:.75rem .875rem; border-radius:1rem; font-size:.875rem; line-height:1.55; word-break:break-word; }
    .fd-msg.user { align-self:flex-end; background:var(--fd-accent); color:var(--fd-brand); border-bottom-right-radius:.25rem; white-space:pre-wrap; }
    .fd-msg.bot { align-self:flex-start; background:#fff; color:#1e293b; border:1px solid #e2e8f0; border-bottom-left-radius:.25rem; }
    .fd-msg.bot .fd-md-p { margin:0 0 .5rem; }
    .fd-msg.bot .fd-md-p:last-child { margin-bottom:0; }
    .fd-msg.bot .fd-md-h2 { margin:0 0 .35rem; font-weight:700; font-size:.9375rem; }
    .fd-msg.bot .fd-md-h3 { margin:0 0 .35rem; font-weight:600; font-size:.875rem; }
    .fd-msg.bot .fd-md-ul { margin:.25rem 0 .5rem 1.1rem; padding:0; list-style:disc; }
    .fd-msg.bot .fd-md-ul li { margin-bottom:.25rem; }
    .fd-msg.bot .fd-md-hr { border:none; border-top:1px solid #e2e8f0; margin:.5rem 0; }
    .dark .fd-msg.bot .fd-md-hr { border-top-color:#334155; }
    .fd-msg.bot .fd-md-code { font-size:.8125rem; background:#f1f5f9; padding:.1rem .35rem; border-radius:.25rem; }
    .dark .fd-msg.bot .fd-md-code { background:#061a2b; }
    .fd-msg.bot strong { font-weight:700; }
    .dark .fd-msg.bot { background:#0A2540; color:#e2e8f0; border-color:#334155; }
    .fd-msg.bot a { color:#0284c7; text-decoration:underline; }
    .dark .fd-msg.bot a { color:var(--fd-accent); }
    .fd-msg.error { align-self:center; background:#fef2f2; color:#b91c1c; border:1px solid #fecaca; font-size:.8125rem; }
    .fd-typing { align-self:flex-start; display:flex; gap:.25rem; padding:.75rem 1rem; background:#fff; border:1px solid #e2e8f0; border-radius:1rem; }
    .dark .fd-typing { background:#0A2540; border-color:#334155; }
    .fd-typing span { width:.45rem; height:.45rem; border-radius:9999px; background:var(--fd-accent); animation:fd-bounce 1.2s infinite; }
    .fd-typing span:nth-child(2) { animation-delay:.15s; }
    .fd-typing span:nth-child(3) { animation-delay:.3s; }
    @keyframes fd-bounce { 0%,80%,100%{transform:translateY(0);opacity:.5} 40%{transform:translateY(-4px);opacity:1} }
    #fourdays-chat-starters { display:flex; flex-wrap:wrap; gap:.5rem; padding:0 1rem .5rem; }
    .fd-starter {
      border:1px solid rgba(0,212,255,.35); background:rgba(0,212,255,.08);
      color:var(--fd-brand); border-radius:9999px; padding:.375rem .75rem;
      font-size:.75rem; cursor:pointer;
    }
    .dark .fd-starter { color:#e2e8f0; background:rgba(0,212,255,.12); }
    #fourdays-chat-form {
      display:flex; gap:.5rem; padding:.75rem; border-top:1px solid #e2e8f0; background:#fff;
    }
    .dark #fourdays-chat-form { background:#0f3354; border-color:#334155; }
    #fourdays-chat-input {
      flex:1; resize:none; min-height:2.75rem; max-height:7rem;
      padding:.625rem .75rem; border:1px solid #cbd5e1; border-radius:.75rem;
      font-size:.875rem; font-family:inherit; outline:none;
    }
    #fourdays-chat-input:focus { border-color:var(--fd-accent); box-shadow:0 0 0 2px rgba(0,212,255,.25); }
    .dark #fourdays-chat-input { background:#061a2b; border-color:#475569; color:#fff; }
    #fourdays-chat-send {
      align-self:flex-end; border:none; border-radius:.75rem; padding:.625rem .875rem;
      background:var(--fd-growth); color:var(--fd-brand); font-weight:700; cursor:pointer;
    }
    #fourdays-chat-send:disabled { opacity:.55; cursor:not-allowed; }
    #fourdays-chat-footer { padding:0 .75rem .625rem; font-size:.6875rem; color:#64748b; text-align:center; }
    @media (max-width:480px) {
      #fourdays-chat-panel { right:.75rem; left:.75rem; width:auto; bottom:5rem; }
      #fourdays-chat-launcher { right:.75rem; bottom:.75rem; }
    }
  `;

  function escapeHtml(text) {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function inlineMarkdown(text) {
    let html = escapeHtml(text);
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');
    html = html.replace(/(?<!\*)\*([^*\n]+)\*(?!\*)/g, '<em>$1</em>');
    html = html.replace(/`([^`]+)`/g, '<code class="fd-md-code">$1</code>');
    html = html.replace(
      /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
    );
    html = html.replace(
      /(https?:\/\/[^\s<]+)/g,
      '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
    );
    return html;
  }

  function renderMarkdown(text) {
    const lines = text.replace(/\r\n/g, '\n').split('\n');
    const out = [];
    let inList = false;

    function closeList() {
      if (inList) {
        out.push('</ul>');
        inList = false;
      }
    }

    for (const line of lines) {
      const trimmed = line.trim();

      if (/^(-{3,}|─{3,}|\*{3,})$/.test(trimmed)) {
        closeList();
        out.push('<hr class="fd-md-hr">');
        continue;
      }

      const bullet = trimmed.match(/^[-•*]\s+(.+)/);
      if (bullet) {
        if (!inList) {
          out.push('<ul class="fd-md-ul">');
          inList = true;
        }
        out.push(`<li>${inlineMarkdown(bullet[1])}</li>`);
        continue;
      }

      closeList();

      if (!trimmed) continue;

      const h3 = trimmed.match(/^###\s+(.+)/);
      if (h3) {
        out.push(`<p class="fd-md-h3">${inlineMarkdown(h3[1])}</p>`);
        continue;
      }

      const h2 = trimmed.match(/^##\s+(.+)/);
      if (h2) {
        out.push(`<p class="fd-md-h2">${inlineMarkdown(h2[1])}</p>`);
        continue;
      }

      out.push(`<p class="fd-md-p">${inlineMarkdown(trimmed)}</p>`);
    }

    closeList();
    return out.join('') || inlineMarkdown(text);
  }

  function formatReply(text) {
    return renderMarkdown(text);
  }

  function loadMessages() {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  function saveMessages(messages) {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-30)));
    } catch { /* ignore */ }
  }

  function mountWidget() {
    const root = document.createElement('div');
    root.id = 'fourdays-chat-root';
    root.innerHTML = `
      <style>${styles}</style>
      <button type="button" id="fourdays-chat-launcher" aria-expanded="false" aria-controls="fourdays-chat-panel">
        💬 Fråga 4days.ai
      </button>
      <div id="fourdays-chat-panel" role="dialog" aria-label="4days.ai Agent chat" aria-modal="false">
        <div id="fourdays-chat-header">
          <div>
            <strong>4days.ai Agent</strong>
            <span>En dag mer frihet. Med AI.</span>
          </div>
          <button type="button" id="fourdays-chat-close" aria-label="Stäng chat">×</button>
        </div>
        <div id="fourdays-chat-messages" aria-live="polite"></div>
        <div id="fourdays-chat-starters"></div>
        <form id="fourdays-chat-form">
          <textarea id="fourdays-chat-input" rows="1" placeholder="Skriv din fråga…" maxlength="2000" aria-label="Chattmeddelande"></textarea>
          <button type="submit" id="fourdays-chat-send" aria-label="Skicka">Skicka</button>
        </form>
        <div id="fourdays-chat-footer">
          AI-assistent · <a href="/integritetspolicy">Integritetspolicy</a> ·
          <a href="${CALENDLY_URL}" target="_blank" rel="noopener noreferrer">Boka möte</a>
        </div>
      </div>
    `;
    document.body.appendChild(root);

    const launcher = root.querySelector('#fourdays-chat-launcher');
    const panel = root.querySelector('#fourdays-chat-panel');
    const closeBtn = root.querySelector('#fourdays-chat-close');
    const messagesEl = root.querySelector('#fourdays-chat-messages');
    const startersEl = root.querySelector('#fourdays-chat-starters');
    const form = root.querySelector('#fourdays-chat-form');
    const input = root.querySelector('#fourdays-chat-input');
    const sendBtn = root.querySelector('#fourdays-chat-send');

    let messages = loadMessages();
    let loading = false;

    function scrollToBottom() {
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    function renderMessages() {
      messagesEl.innerHTML = '';
      if (messages.length === 0) {
        appendBotMessage(
          'Hej! 👋 Jag är 4days.ai Agent. Fråga mig om 4-dagarsvecka, AI-automatisering eller boka ett möte direkt här i chatten.'
        );
      } else {
        messages.forEach((m) => appendMessage(m.role, m.content, false));
      }
      renderStarters();
      scrollToBottom();
    }

    function appendMessage(role, content, persist) {
      const div = document.createElement('div');
      div.className = `fd-msg ${role === 'user' ? 'user' : 'bot'}`;
      if (role === 'user') {
        div.textContent = content;
      } else {
        div.innerHTML = formatReply(content);
      }
      messagesEl.appendChild(div);
      if (persist !== false && role) {
        /* rendered from state separately */
      }
      scrollToBottom();
    }

    function appendBotMessage(content) {
      appendMessage('assistant', content, false);
    }

    function showTyping() {
      const el = document.createElement('div');
      el.className = 'fd-typing';
      el.id = 'fourdays-chat-typing';
      el.innerHTML = '<span></span><span></span><span></span>';
      messagesEl.appendChild(el);
      scrollToBottom();
    }

    function hideTyping() {
      document.getElementById('fourdays-chat-typing')?.remove();
    }

    function showError(text) {
      const div = document.createElement('div');
      div.className = 'fd-msg error';
      div.textContent = text;
      messagesEl.appendChild(div);
      scrollToBottom();
    }

    function renderStarters() {
      startersEl.innerHTML = '';
      if (messages.length > 0 || loading) return;
      STARTER_PROMPTS.forEach((prompt) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'fd-starter';
        btn.textContent = prompt;
        btn.addEventListener('click', () => sendUserMessage(prompt));
        startersEl.appendChild(btn);
      });
    }

    function setOpen(open) {
      panel.classList.toggle('open', open);
      launcher.setAttribute('aria-expanded', String(open));
      if (open) {
        renderMessages();
        setTimeout(() => input.focus(), 100);
      }
    }

    async function sendUserMessage(text) {
      const content = text.trim();
      if (!content || loading) return;

      loading = true;
      sendBtn.disabled = true;
      startersEl.innerHTML = '';

      messages.push({ role: 'user', content });
      appendMessage('user', content, false);
      saveMessages(messages);
      input.value = '';

      showTyping();

      try {
        const res = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages }),
        });
        const data = await res.json().catch(() => ({}));
        hideTyping();

        if (!res.ok) {
          showError(data.error || 'Kunde inte få svar just nu.');
          return;
        }

        messages.push({ role: 'assistant', content: data.reply });
        saveMessages(messages);
        appendBotMessage(data.reply);
      } catch {
        hideTyping();
        showError('Nätverksfel – kontrollera uppkopplingen och försök igen.');
      } finally {
        loading = false;
        sendBtn.disabled = false;
        input.focus();
      }
    }

    launcher.addEventListener('click', () => setOpen(!panel.classList.contains('open')));
    closeBtn.addEventListener('click', () => setOpen(false));

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      sendUserMessage(input.value);
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendUserMessage(input.value);
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && panel.classList.contains('open')) setOpen(false);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountWidget);
  } else {
    mountWidget();
  }
})();
