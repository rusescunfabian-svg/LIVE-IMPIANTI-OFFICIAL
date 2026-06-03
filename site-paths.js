/**
 * Percorsi asset corretti in deploy (root o sottocartella GitHub Pages).
 */
(() => {
  function siteBase() {
    const path = window.location.pathname || '/';
    const file = path.split('/').pop() || '';
    if (!file || !/\.\w{2,5}$/i.test(file)) {
      return path.endsWith('/') ? path : `${path}/`;
    }
    const dir = path.slice(0, path.lastIndexOf('/') + 1);
    return dir || '/';
  }

  const BASE = siteBase();

  window.resolveAsset = function resolveAsset(url) {
    if (!url) return '';
    const s = String(url).trim();
    if (/^(https?:|data:)/i.test(s)) return s;
    const rel = s.startsWith('/') ? s.slice(1) : s.replace(/^\.\//, '');
    return `${BASE}${rel}`;
  };
})();
