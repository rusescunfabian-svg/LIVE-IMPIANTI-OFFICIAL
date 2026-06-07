/* ═══════════════════════════════════════════════
   Live Impianti – Caricamento progetti da JSON
   ═══════════════════════════════════════════════ */

const ProgettiLoader = (() => {
  const TAG_CLASS = {
    ville: 'tag-ville',
    radianti: 'tag-radianti',
    fotovoltaico: 'tag-foto',
    centrali: 'tag-centrali',
  };

  const CAT_LABELS = {
    ville: 'Ville e abitazioni full electric',
    radianti: 'Sistemi radianti e climatizzazione invisibile',
    fotovoltaico: 'Impianti fotovoltaici industriali e pubblici',
    centrali: 'Centrali termiche e grandi impianti',
  };

  let catalogCache = null;
  let lightboxBound = false;
  let lightboxQueue = [];
  let lightboxIndex = 0;

  function normalizeList(arr) {
    if (!Array.isArray(arr)) return [];
    return arr
      .map((item) => {
        if (typeof item === 'string') return item;
        if (item && typeof item === 'object') {
          return item.voce || item.tag || item.item || item.feature || '';
        }
        return '';
      })
      .filter(Boolean);
  }

  function normalizeCatalog(data) {
    if (!data?.progetti) return data;
    data.progetti.forEach((p) => {
      p.features = normalizeList(p.features);
      p.tags = normalizeList(p.tags);
    });
    return data;
  }

  function escapeHtml(str) {
    return String(str ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  async function load() {
    if (window.PROGETTI_DATA) return normalizeCatalog(window.PROGETTI_DATA);

    try {
      const res = await fetch('progetti.json');
      if (res.ok) return normalizeCatalog(await res.json());
    } catch (_) {
      /* fetch non disponibile (es. file://) – usa progetti-data.js */
    }

    if (window.PROGETTI_DATA) return normalizeCatalog(window.PROGETTI_DATA);
    throw new Error('Impossibile caricare i progetti');
  }

  function sortByOrdine(list) {
    return [...list].sort((a, b) => (a.ordine ?? 999) - (b.ordine ?? 999));
  }

  function sortForCarousel(list) {
    return [...list].sort((a, b) => {
      if (!!b.featured !== !!a.featured) return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      return (a.ordine ?? 999) - (b.ordine ?? 999);
    });
  }

  function truncate(str, max = 110) {
    const s = String(str || '').trim();
    if (s.length <= max) return s;
    return s.slice(0, max).trim() + '…';
  }

  function sortProgettiForPage(data) {
    const catOrder = Object.fromEntries(
      (data.categorie || []).map((c) => [c.id, c.ordine ?? 999])
    );
    return [...data.progetti].sort((a, b) => {
      const catDiff =
        (catOrder[a.categoria] ?? 999) - (catOrder[b.categoria] ?? 999);
      if (catDiff !== 0) return catDiff;
      return (a.ordine ?? 999) - (b.ordine ?? 999);
    });
  }

  function assetUrl(path) {
    if (!path) return '';
    if (typeof window.resolveAsset === 'function') return window.resolveAsset(path);
    const s = String(path).replace(/^\.\//, '');
    if (/^(https?:|data:)/i.test(s)) return s;
    return s;
  }

  function getImage(p) {
    return assetUrl(p.immagineHome || p.immagine);
  }

  function labelClassHome(p) {
    if (p.labelStile === 'kw') return 'proj-card__label proj-card__label--kw';
    if (p.labelStile === 'pub') return 'proj-card__label proj-card__label--pub';
    return 'proj-card__label';
  }

  function updateLightboxNav() {
    const prev = document.getElementById('lbPrev');
    const next = document.getElementById('lbNext');
    const counter = document.getElementById('lbCounter');
    const show = lightboxQueue.length > 1;
    if (prev) prev.hidden = !show;
    if (next) next.hidden = !show;
    if (counter) {
      counter.hidden = !show;
      counter.textContent = show
        ? `${lightboxIndex + 1} / ${lightboxQueue.length}`
        : '';
    }
  }

  function openProgettoDetail(p, queue) {
    const lb = document.getElementById('projLightbox');
    if (!lb || !p) return;

    if (queue?.length) {
      lightboxQueue = queue;
      lightboxIndex = Math.max(
        0,
        queue.findIndex((item) => item.id === p.id)
      );
    } else {
      lightboxQueue = [];
      lightboxIndex = 0;
    }

    const lbImg = document.getElementById('lbImg');
    const lbTitle = document.getElementById('lbTitle');
    const lbLocation = document.getElementById('lbLocation');
    const lbDesc = document.getElementById('lbDesc');
    const lbFeatures = document.getElementById('lbFeatures');
    const lbTag = document.getElementById('lbTag');
    const inner = document.getElementById('lightboxInner');

    const imgSrc = getImage(p);
    lbImg.onerror = () => {
      lbImg.onerror = null;
      lbImg.src = assetUrl('images/liveimpianti_logo.png');
    };
    lbImg.src = imgSrc;
    lbImg.alt = p.titoloCompleto || p.titolo || '';
    lbTitle.textContent = p.titoloCompleto || p.titolo || '';
    lbLocation.textContent = p.location || '';
    lbDesc.textContent = p.descrizioneCompleta || p.descrizione || '';
    lbTag.textContent = CAT_LABELS[p.categoria] || '';

    lbFeatures.innerHTML = '';
    (p.features || []).forEach((f) => {
      const li = document.createElement('li');
      li.className = 'proj-lightbox__feat';
      li.textContent = f;
      lbFeatures.appendChild(li);
    });

    updateLightboxNav();
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (inner) {
      inner.classList.remove('proj-lightbox__inner--animate');
      void inner.offsetWidth;
      inner.classList.add('proj-lightbox__inner--animate');
    }
    if (history.replaceState) {
      const url = new URL(location.href);
      url.searchParams.set('id', p.id);
      history.replaceState(null, '', url);
    }
  }

  function navigateLightbox(delta) {
    if (lightboxQueue.length < 2) return;
    lightboxIndex =
      (lightboxIndex + delta + lightboxQueue.length) % lightboxQueue.length;
    openProgettoDetail(lightboxQueue[lightboxIndex], lightboxQueue);
  }

  function closeProgettoDetail() {
    const lb = document.getElementById('projLightbox');
    if (!lb) return;
    lb.classList.remove('open');
    document.body.style.overflow = '';
    lightboxQueue = [];
    if (history.replaceState) {
      const url = new URL(location.href);
      url.searchParams.delete('id');
      history.replaceState(null, '', url.pathname + url.hash);
    }
  }

  function findProgettoById(id) {
    return catalogCache?.progetti?.find((p) => p.id === id);
  }

  function activateHomeCard(card) {
    const p = findProgettoById(card.dataset.progettoId);
    if (!p || !catalogCache) return;
    const cat = card.closest('[data-progetti-cat]')?.dataset.progettiCat;
    const queue = cat
      ? sortForCarousel(catalogCache.progetti.filter((x) => x.categoria === cat))
      : [p];
    openProgettoDetail(p, queue);
  }

  function bindHomeLightbox() {
    const lb = document.getElementById('projLightbox');
    if (!lb) return;

    if (!lightboxBound) {
      lightboxBound = true;
      lb.addEventListener('click', (e) => {
        if (e.target === lb) closeProgettoDetail();
      });
      document.getElementById('lbClose')?.addEventListener('click', closeProgettoDetail);
      document.getElementById('lbCloseBottom')?.addEventListener('click', closeProgettoDetail);
      document.getElementById('lbPrev')?.addEventListener('click', (e) => {
        e.stopPropagation();
        navigateLightbox(-1);
      });
      document.getElementById('lbNext')?.addEventListener('click', (e) => {
        e.stopPropagation();
        navigateLightbox(1);
      });
      lb.querySelectorAll('.proj-lightbox__cta-main').forEach((link) => {
        link.addEventListener('click', () => closeProgettoDetail());
      });
      document.addEventListener('keydown', (e) => {
        if (!lb.classList.contains('open')) return;
        if (e.key === 'Escape') closeProgettoDetail();
        if (e.key === 'ArrowLeft') navigateLightbox(-1);
        if (e.key === 'ArrowRight') navigateLightbox(1);
      });
      document.addEventListener('click', (e) => {
        const card = e.target.closest('[data-progetto-card]');
        if (!card || !catalogCache) return;
        if (e.target.closest('a')) return;
        activateHomeCard(card);
      });
      document.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        const card = e.target.closest('[data-progetto-card]');
        if (!card) return;
        e.preventDefault();
        activateHomeCard(card);
      });
    }
  }

  function openProgettoFromUrl() {
    const id = new URLSearchParams(location.search).get('id');
    if (!id) return;
    const p = findProgettoById(id);
    if (!p) return;
    const queue = sortForCarousel(
      catalogCache.progetti.filter((x) => x.categoria === p.categoria)
    );
    openProgettoDetail(p, queue);
  }

  function renderHomeCard(p) {
    const featured = p.featured ? ' proj-card--featured' : '';
    const badge = p.featured
      ? '<div class="proj-card__badge">Progetto speciale</div>'
      : '';
    const titolo = escapeHtml(p.titoloHome || p.titolo);
    const img = escapeHtml(getImage(p));
    const alt = escapeHtml(p.titoloCompleto || p.titolo);
    const label = escapeHtml(p.label);
    const location = escapeHtml(p.location || '');
    const excerpt = escapeHtml(truncate(p.descrizione, 100));

    return `
      <div class="proj-card proj-card--clickable${featured}" data-progetto-card data-progetto-id="${escapeHtml(p.id)}" role="button" tabindex="-1" aria-label="Apri dettagli: ${alt}">
        ${badge}
        <div class="proj-card__img"><img src="${img}" alt="${alt}" loading="lazy" /></div>
        <div class="proj-card__body">
          <div class="${labelClassHome(p)}">${label}</div>
          <h4 class="proj-card__title">${titolo}</h4>
          ${location ? `<p class="proj-card__meta"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>${location}</p>` : ''}
          ${excerpt ? `<p class="proj-card__excerpt">${excerpt}</p>` : ''}
          <span class="proj-card__cta">Scopri il progetto</span>
        </div>
      </div>`;
  }

  function initHomeCarousels() {
    document.querySelectorAll('.acc-carousel__track').forEach((track) => {
      track.setAttribute('role', 'region');
      track.setAttribute('aria-label', 'Scorri i progetti orizzontalmente');
    });
  }

  function applyCategorie(data) {
    if (!data?.categorie?.length) return;

    data.categorie.forEach((cat) => {
      const item = document.querySelector(`.acc-item[data-cat-id="${cat.id}"]`);
      if (!item) return;

      const headerTitle = item.querySelector('.acc-header__title');
      if (headerTitle) headerTitle.textContent = cat.nome;

      const bannerWrap = item.querySelector('.acc-category-banner');
      const img = item.querySelector('.acc-banner-img');
      const overlayTitle = item.querySelector('.acc-banner-overlay h3');
      const overlayDesc = item.querySelector('.acc-banner-overlay p');

      if (overlayTitle) overlayTitle.textContent = cat.nome;
      if (overlayDesc) overlayDesc.textContent = cat.descrizione || '';
      if (img && cat.banner) {
        img.src = assetUrl(cat.banner);
        img.alt = cat.nome;
      }
      if (img && cat.bannerPosition) img.style.objectPosition = cat.bannerPosition;
      if (bannerWrap && cat.bannerClass) {
        bannerWrap.className = `acc-category-banner ${cat.bannerClass}`.trim();
      }
    });
  }

  function renderHome(data) {
    applyCategorie(data);

    const containers = document.querySelectorAll('[data-progetti-cat]');
    if (!containers.length) return;

    containers.forEach((el) => {
      const cat = el.dataset.progettiCat;
      const list = sortForCarousel(
        data.progetti.filter((p) => p.categoria === cat)
      );
      const slides = list
        .map((p) => `<div class="acc-carousel__slide">${renderHomeCard(p)}</div>`)
        .join('');

      el.innerHTML = `
        <div class="acc-carousel" data-acc-carousel>
          <div class="acc-carousel__track">${slides || '<p class="acc-carousel__empty">Nessun progetto in questa categoria.</p>'}</div>
        </div>
        <p class="acc-carousel__footer">
          <a href="progetti.html#${cat}" class="acc-carousel__link">Vedi tutti i progetti</a>
        </p>`;
    });

    catalogCache = data;
    initHomeCarousels();
    bindHomeLightbox();
    openProgettoFromUrl();
    document.dispatchEvent(new CustomEvent('progetti:home-rendered'));
  }

  function renderProgettiTags(p) {
    if (!p.tags?.length) return '';
    return p.tags
      .map(
        (t) =>
          `<span class="text-xs bg-brand-light text-brand-dark px-2 py-0.5 rounded-full">${escapeHtml(t)}</span>`
      )
      .join('');
  }

  function renderProgettiCard(p) {
    const tagClass = TAG_CLASS[p.categoria] || 'tag-ville';
    const featuredBadge = p.featured
      ? '<div class="absolute top-3 left-3 bg-brand text-white text-xs font-700 px-3 py-1 rounded-full shadow">⭐ Progetto speciale</div>'
      : '';
    const img = escapeHtml(p.immagine);
    const features = escapeHtml(p.features.join('|'));
    const desc = escapeHtml(p.descrizioneCompleta);
    const title = escapeHtml(p.titoloCompleto);
    const location = escapeHtml(p.location);
    const excerpt = escapeHtml(p.descrizione);

    return `
      <article class="proj-card group bg-white rounded-2xl shadow-card hover:shadow-card-hover overflow-hidden transition-all duration-300 hover:-translate-y-1 cursor-pointer"
               data-id="${escapeHtml(p.id)}"
               data-cat="${p.categoria}"
               data-title="${title}"
               data-location="${location}"
               data-desc="${desc}"
               data-features="${features}"
               data-img="${img}">
        <div class="relative card-img-wrap h-56 bg-gray-100">
          <img src="${img}" alt="${title}" class="w-full h-full object-cover" loading="lazy" />
          ${featuredBadge}
        </div>
        <div class="p-5">
          <div class="flex items-start justify-between gap-2 mb-3">
            <span class="${tagClass} inline-block text-xs font-700 uppercase tracking-wider px-2.5 py-1 rounded-full">${escapeHtml(p.label)}</span>
            <span class="text-xs text-gray-400 flex items-center gap-1 shrink-0">
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
              ${location}
            </span>
          </div>
          <h3 class="font-700 text-dark text-[1.05rem] leading-snug mb-2">${escapeHtml(p.titolo)}</h3>
          <p class="text-gray-500 text-sm leading-relaxed line-clamp-3">${excerpt}</p>
          <div class="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-1.5">
            ${renderProgettiTags(p)}
          </div>
          <button type="button" class="mt-4 w-full text-sm font-600 text-brand flex items-center justify-center gap-1.5 group-hover:gap-2.5 transition-all">
            Vedi dettagli
            <svg class="w-4 h-4 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      </article>`;
  }

  function renderProgettiPage(data) {
    const grid = document.getElementById('projectGrid');
    if (!grid) return;

    grid.innerHTML = sortProgettiForPage(data).map(renderProgettiCard).join('');
    document.dispatchEvent(new CustomEvent('progetti:page-rendered', { detail: { grid } }));
  }

  return {
    load,
    renderHome,
    renderProgettiPage,
    openProgettoDetail,
    closeProgettoDetail,
    escapeHtml,
  };
})();
