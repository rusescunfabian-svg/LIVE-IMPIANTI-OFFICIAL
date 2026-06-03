/* Live Impianti – Contenuti sito da CMS (content/*.json) */

const SitoLoader = (() => {
  const SERVICE_ICONS = {
    elettrico:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>',
    fotovoltaico:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>',
    radiante:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M2 20h20M4 20V10l8-6 8 6v10"/><path d="M10 20v-6h4v6"/></svg>',
    domotica:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/><path d="M7 8h10M7 12h6"/></svg>',
    vmc:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
    centrali:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
  };

  const ICON_COLORS = ['#00a79e', '#cbd000', '#00a79e', '#cbd000', '#00a79e', '#cbd000'];

  function escapeHtml(str) {
    return String(str ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function get(obj, path) {
    return path.split('.').reduce((o, k) => (o != null ? o[k] : undefined), obj);
  }

  function setText(el, value) {
    if (!el || value == null) return;
    el.textContent = value;
  }

  async function loadData() {
    if (window.SITO_DATA) return window.SITO_DATA;
    try {
      const res = await fetch('content/home.json');
      if (!res.ok) throw new Error('fetch');
      const home = await res.json();
      const keys = ['azienda', 'servizi', 'chi-siamo'];
      const data = { home };
      for (const key of keys) {
        const r = await fetch(`content/${key}.json`);
        if (r.ok) {
          const camel = key === 'chi-siamo' ? 'chiSiamo' : key;
          data[camel] = await r.json();
        }
      }
      return data;
    } catch (_) {
      if (window.SITO_DATA) return window.SITO_DATA;
      return null;
    }
  }

  function applyDataBindings(data) {
    document.querySelectorAll('[data-sito]').forEach((el) => {
      const path = el.getAttribute('data-sito');
      const val = get(data, path);
      if (val == null) return;
      setText(el, val);
    });
    document.querySelectorAll('[data-sito-link]').forEach((el) => {
      const path = el.getAttribute('data-sito-link');
      const val = get(data, path);
      if (val) el.href = val;
    });
  }

  function applyHero(data) {
    const h = data.home?.hero;
    if (!h) return;

    setText(document.querySelector('[data-sito="home.hero.badge"]'), h.badge);
    setText(document.querySelector('[data-sito="home.hero.titoloRiga1"]'), h.titoloRiga1);
    setText(document.querySelector('[data-sito="home.hero.titoloAccent"]'), h.titoloAccent);
    setText(document.querySelector('[data-sito="home.hero.titoloRiga2"]'), h.titoloRiga2);
    setText(document.querySelector('[data-sito="home.hero.sottotitolo"]'), h.sottotitolo);

    const btnP = document.querySelector('[data-sito="home.hero.pulsantePrimario"]');
    const btnS = document.querySelector('[data-sito="home.hero.pulsanteSecondario"]');
    if (btnP) {
      setText(btnP, h.pulsantePrimario);
      if (h.pulsantePrimarioLink) btnP.href = h.pulsantePrimarioLink;
    }
    if (btnS) {
      setText(btnS, h.pulsanteSecondario);
      if (h.pulsanteSecondarioLink) btnS.href = h.pulsanteSecondarioLink;
    }

    const stats = h.statistiche || [];
    document.querySelectorAll('[data-hero-stat]').forEach((wrap, i) => {
      const s = stats[i];
      if (!s) return;
      const num = wrap.querySelector('[data-countup]');
      const lbl = wrap.querySelector('.hero__stat-label');
      if (num) {
        num.dataset.target = String(s.numero ?? 0);
        num.dataset.suffix = s.suffisso || '';
        num.textContent = `0${s.suffisso || ''}`;
      }
      setText(lbl, s.etichetta);
    });
  }

  function applyServizi(data) {
    const grid = document.getElementById('sitoServiziGrid');
    const sec = data.servizi;
    if (!grid || !sec?.voci) return;

    const sorted = [...sec.voci].sort((a, b) => (a.ordine ?? 99) - (b.ordine ?? 99));
    grid.innerHTML = sorted
      .map((v, i) => {
        const icon = SERVICE_ICONS[v.icona] || SERVICE_ICONS.elettrico;
        const color = ICON_COLORS[i % ICON_COLORS.length];
        return `
        <div class="service-card">
          <div class="service-card__icon" style="--icon-color: ${color}">${icon}</div>
          <h3>${escapeHtml(v.titolo)}</h3>
          <p>${escapeHtml(v.descrizione)}</p>
        </div>`;
      })
      .join('');
  }

  function applyChiSiamo(data) {
    const c = data.chiSiamo;
    if (!c) return;

    const perks = document.getElementById('sitoChiSiamoPerks');
    if (perks && c.puntiForza) {
      perks.innerHTML = c.puntiForza
        .map(
          (p) => `
        <div class="perk">
          <div class="perk__icon">
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.2"><polyline points="4 10 8 14 16 6"/></svg>
          </div>
          <div>
            <strong>${escapeHtml(p.titolo)}</strong>
            <span>${escapeHtml(p.testo)}</span>
          </div>
        </div>`
        )
        .join('');
    }

    const bar = document.getElementById('sitoChiSiamoBar');
    if (bar && c.barraStatistiche) {
      bar.innerHTML = c.barraStatistiche
        .map(
          (item, idx) => `
        ${idx ? '<div class="wsb-divider"></div>' : ''}
        <div class="wsb-item">
          <span class="wsb-num">${escapeHtml(item.valore)}</span>
          <span class="wsb-lbl">${escapeHtml(item.etichetta)}</span>
        </div>`
        )
        .join('');
    }

    const panel = c.pannelloVisivo;
    if (panel) {
      setText(document.querySelector('[data-sito="chiSiamo.pannelloVisivo.overline"]'), panel.overline);
      setText(document.querySelector('[data-sito="chiSiamo.pannelloVisivo.sottotitolo"]'), panel.sottotitolo);
      const vs = document.getElementById('sitoVisualStats');
      if (vs && panel.statistiche) {
        vs.innerHTML = panel.statistiche
          .map((item, idx) => {
            const accent = item.accent ? ' vs-num--accent' : '';
            return `
            ${idx ? '<div class="vs-divider"></div>' : ''}
            <div class="vs-item">
              <span class="vs-num${accent}">${escapeHtml(item.valore)}</span>
              <span class="vs-label">${escapeHtml(item.etichetta)}</span>
            </div>`;
          })
          .join('');
      }
      const pills = document.getElementById('sitoVisualPills');
      if (pills && panel.pillole) {
        const classes = ['vpill--green', 'vpill--yellow', 'vpill--teal'];
        pills.innerHTML = panel.pillole
          .map(
            (t, i) =>
              `<div class="vpill ${classes[i % classes.length]}">${escapeHtml(t)}</div>`
          )
          .join('');
      }
    }
  }

  function applyAzienda(data) {
    const a = data.azienda;
    if (!a) return;

    document.querySelectorAll('[data-sito-tel]').forEach((el) => {
      el.href = `tel:${a.telefonoLink || ''}`;
      if (el.hasAttribute('data-sito-text')) el.textContent = a.telefono || '';
    });
    document.querySelectorAll('[data-sito-email]').forEach((el) => {
      el.href = `mailto:${a.email || ''}`;
      if (el.hasAttribute('data-sito-text')) el.textContent = a.email || '';
    });
    document.querySelectorAll('[data-sito-wa]').forEach((el) => {
      el.href = `https://wa.me/${a.whatsapp || ''}`;
    });
    document.querySelectorAll('[data-sito-indirizzo]').forEach((el) => {
      if (el.tagName === 'A') return;
      if (el.closest('.contact-item') || el.closest('.footer__contact')) {
        el.innerHTML = `${escapeHtml(a.indirizzo)}<br />${escapeHtml(a.capCitta)}`;
      } else {
        el.textContent = `${a.indirizzo} – ${a.capCitta}`;
      }
    });

    const iframe = document.getElementById('sitoMappa');
    if (iframe && a.mappaEmbed) iframe.src = a.mappaEmbed;

    const mapLink = document.getElementById('sitoMapsLink');
    if (mapLink && a.linkGoogleMaps) mapLink.href = a.linkGoogleMaps;

    const review = document.getElementById('sitoReviewLink');
    if (review && a.linkRecensione) review.href = a.linkRecensione;
  }

  function init(data) {
    if (!data) return;
    applyDataBindings({
      home: data.home,
      azienda: data.azienda,
      servizi: data.servizi,
      chiSiamo: data.chiSiamo,
    });
    applyHero({ home: data.home });
    applyServizi(data);
    applyChiSiamo(data);
    applyAzienda(data);
    document.dispatchEvent(new CustomEvent('sito:loaded', { detail: data }));
  }

  async function run() {
    const data = await loadData();
    init(data);
  }

  return { run, init };
})();

document.addEventListener('DOMContentLoaded', () => {
  SitoLoader.run();
});
