/* Banner cookie – Live Impianti */
(function () {
  const KEY = 'liveimpianti_cookie_consent';
  const OPEN = 'cookie-banner--open';

  function readConsent() {
    try {
      const v = localStorage.getItem(KEY);
      return v === 'all' || v === 'necessary' ? v : null;
    } catch (_) {
      return null;
    }
  }

  function init() {
    const banner = document.getElementById('cookieBanner');
    if (!banner) return;

    const acceptBtn = document.getElementById('cookieAccept');
    const rejectBtn = document.getElementById('cookieReject');

    function show() {
      banner.removeAttribute('hidden');
      banner.classList.add(OPEN);
      banner.setAttribute('aria-hidden', 'false');
    }

    function hide() {
      banner.classList.remove(OPEN);
      banner.setAttribute('hidden', '');
      banner.setAttribute('aria-hidden', 'true');
    }

    function save(value) {
      try {
        localStorage.setItem(KEY, value);
      } catch (_) {}
      hide();
    }

    if (!readConsent()) {
      show();
    } else {
      hide();
    }

    acceptBtn?.addEventListener('click', () => save('all'));
    rejectBtn?.addEventListener('click', () => save('necessary'));

    document.querySelectorAll('[data-cookie-manage]').forEach((el) => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        try {
          localStorage.removeItem(KEY);
        } catch (_) {}
        show();
      });
    });

    window.LiveImpiantiCookie = {
      show,
      hide,
      reset() {
        try {
          localStorage.removeItem(KEY);
        } catch (_) {}
        show();
      },
      get: readConsent,
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
