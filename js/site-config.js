/**
 * Uppdatera LinkedIn-URL:er här – alla länkar på sidan uppdateras automatiskt.
 */
window.SITE_CONFIG = {
  linkedinJoseph: 'https://www.linkedin.com/in/joseph-tran-844993150/',
  linkedinMikael: 'https://www.linkedin.com/in/mikaelsoderberg1/',
  linkedinCompany: 'https://www.linkedin.com/company/4days-ai',
};

(function () {
  const cfg = window.SITE_CONFIG || {};
  const map = [
    ['linkedin-joseph', cfg.linkedinJoseph || cfg.linkedinCompany],
    ['linkedin-mikael', cfg.linkedinMikael || cfg.linkedinCompany],
    ['footer-linkedin-joseph', cfg.linkedinJoseph || cfg.linkedinCompany],
    ['footer-linkedin-mikael', cfg.linkedinMikael || cfg.linkedinCompany],
  ];
  map.forEach(([id, url]) => {
    const el = document.getElementById(id);
    if (!el || !url) return;
    el.href = url;
    if (url === '#') el.setAttribute('aria-disabled', 'true');
  });
})();
