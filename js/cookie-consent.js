/**
 * Cookie-samtycke + analytics (laddas först efter godkännande).
 *
 * Konfiguration:
 *   provider: 'vercel' | 'plausible' | 'ga4' | 'none'
 *   Aktivera Web Analytics i Vercel → Project → Analytics
 */
(function () {
  const CONFIG = {
    provider: 'vercel',
    plausibleDomain: '4days.ai',
    ga4Id: '',
    storageKey: '4days_cookie_consent',
  };

  function getConsent() {
    try {
      return localStorage.getItem(CONFIG.storageKey);
    } catch {
      return null;
    }
  }

  function setConsent(value) {
    try {
      localStorage.setItem(CONFIG.storageKey, value);
    } catch { /* ignore */ }
  }

  function loadAnalytics() {
    if (CONFIG.provider === 'vercel') {
      if (document.querySelector('script[data-vercel-analytics]')) return;
      window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
      const s = document.createElement('script');
      s.defer = true;
      s.dataset.vercelAnalytics = 'true';
      s.src = '/_vercel/insights/script.js';
      document.head.appendChild(s);
      return;
    }
    if (CONFIG.provider === 'plausible' && CONFIG.plausibleDomain) {
      if (document.querySelector('script[data-plausible]')) return;
      const s = document.createElement('script');
      s.defer = true;
      s.dataset.plausible = 'true';
      s.src = 'https://plausible.io/js/script.js';
      s.setAttribute('data-domain', CONFIG.plausibleDomain);
      document.head.appendChild(s);
      return;
    }
    if (CONFIG.provider === 'ga4' && CONFIG.ga4Id) {
      if (document.querySelector('script[data-ga4]')) return;
      const g = document.createElement('script');
      g.async = true;
      g.dataset.ga4 = 'true';
      g.src = `https://www.googletagmanager.com/gtag/js?id=${CONFIG.ga4Id}`;
      document.head.appendChild(g);
      window.dataLayer = window.dataLayer || [];
      function gtag() { window.dataLayer.push(arguments); }
      window.gtag = gtag;
      gtag('js', new Date());
      gtag('config', CONFIG.ga4Id, { anonymize_ip: true });
    }
  }

  function hideBanner(el) {
    el.classList.add('translate-y-full', 'opacity-0', 'pointer-events-none');
    setTimeout(() => el.remove(), 300);
  }

  function acceptAnalytics(banner) {
    setConsent('analytics');
    loadAnalytics();
    hideBanner(banner);
  }

  function acceptNecessaryOnly(banner) {
    setConsent('necessary');
    hideBanner(banner);
  }

  function createBanner() {
    const banner = document.createElement('div');
    banner.id = 'cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Cookie-inställningar');
    banner.className =
      'fixed bottom-0 inset-x-0 z-[90] p-4 transition-all duration-300 translate-y-0 opacity-100';
    banner.innerHTML = `
      <div class="max-w-3xl mx-auto rounded-2xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-brand-light shadow-2xl p-5 sm:p-6">
        <p class="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
          Vi använder nödvändiga cookies för att sidan ska fungera. Med ditt samtycke använder vi även analytics för att förbättra webbplatsen.
          <a href="/cookies" class="text-accent-deep dark:text-accent hover:underline font-medium">Läs mer om cookies</a>
        </p>
        <div class="mt-4 flex flex-col sm:flex-row gap-2 sm:justify-end">
          <button type="button" data-cookie-necessary class="px-4 py-2.5 text-sm font-medium rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-brand transition-colors">
            Endast nödvändiga
          </button>
          <button type="button" data-cookie-accept class="px-4 py-2.5 text-sm font-semibold rounded-lg bg-accent text-brand hover:bg-accent-dim transition-colors">
            Godkänn analytics
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(banner);
    banner.querySelector('[data-cookie-accept]').addEventListener('click', () => acceptAnalytics(banner));
    banner.querySelector('[data-cookie-necessary]').addEventListener('click', () => acceptNecessaryOnly(banner));
  }

  const consent = getConsent();
  if (consent === 'analytics') {
    loadAnalytics();
  } else if (!consent) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', createBanner);
    } else {
      createBanner();
    }
  }
})();
