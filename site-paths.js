/**
 * Percorsi asset corretti su qualsiasi URL (root, sottocartella, /progetti, file locale).
 */
(() => {
  function pageDirUrl() {
    const href = window.location.href.split('#')[0].split('?')[0];
    return href.replace(/[^/]*$/, '');
  }

  window.resolveAsset = function resolveAsset(url) {
    if (!url) return '';
    const s = String(url).trim();
    if (/^(https?:|data:)/i.test(s)) return s;
    const rel = s.replace(/^\.\//, '').replace(/^\//, '');
    try {
      return new URL(rel, pageDirUrl()).href;
    } catch (_) {
      return rel;
    }
  };
})();
