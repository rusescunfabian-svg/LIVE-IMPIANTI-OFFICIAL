/* Render Privacy / Cookie Policy da content/legale.json */

(function () {
  const PAGE = document.body.dataset.legalePage;

  function escapeHtml(str) {
    return String(str ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function textToHtml(text) {
    return escapeHtml(text).replace(/\n/g, '<br />');
  }

  async function loadLegale() {
    if (window.SITO_DATA?.legale) return window.SITO_DATA.legale;
    try {
      const res = await fetch('content/legale.json');
      if (res.ok) return await res.json();
    } catch (_) {}
    return null;
  }

  function render(doc) {
    const root = document.getElementById('legaleContent');
    if (!root || !doc) return;

    document.title = `${doc.titolo} – Live Impianti S.r.l.`;

    const sections = (doc.sezioni || [])
      .map(
        (s) => `
      <section class="legal-section">
        <h2>${escapeHtml(s.titolo)}</h2>
        <p>${textToHtml(s.testo)}</p>
      </section>`
      )
      .join('');

    root.innerHTML = `
      <p class="legal-updated">Ultimo aggiornamento: ${escapeHtml(doc.ultimoAggiornamento)}</p>
      <p class="legal-intro">${textToHtml(doc.intro)}</p>
      ${sections}
      <p class="legal-back"><a href="index.html">← Torna al sito</a> · <a href="cookie-policy.html">Cookie Policy</a> · <a href="privacy-policy.html">Privacy Policy</a></p>`;
  }

  document.addEventListener('DOMContentLoaded', async () => {
    const data = await loadLegale();
    if (!data) return;

    if (PAGE === 'privacy') render(data.privacy);
    if (PAGE === 'cookie') render(data.cookie);

    document.querySelectorAll('[data-legale-link-privacy]').forEach((a) => {
      if (data.linkPrivacy) a.href = data.linkPrivacy;
    });
    document.querySelectorAll('[data-legale-link-cookie]').forEach((a) => {
      if (data.linkCookie) a.href = data.linkCookie;
    });
  });
})();
