/* ═══════════════════════════════════════════════
   LIVE IMPIANTI S.r.l. – Main Script
   ═══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ─── Navbar scroll behavior ───
  const navbar = document.getElementById('navbar');
  function handleScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // ─── Hero stat count-up ───
  const countEls = document.querySelectorAll('[data-countup]');
  if (countEls.length) {
    const runCountUp = (el) => {
      const target = Number(el.dataset.target || 0);
      const suffix = el.dataset.suffix || '';
      const duration = 1200;
      const start = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = Math.round(target * eased);
        el.textContent = `${value}${suffix}`;
        if (progress < 1) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
    };

    const countObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          runCountUp(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });

    countEls.forEach((el) => countObserver.observe(el));
  }

  // ─── Mobile burger menu (drawer dreapta, în afara navbar) ───
  const burgerBtn = document.getElementById('burgerBtn');
  const navDrawer = document.getElementById('navDrawer');
  const navBackdrop = document.getElementById('navBackdrop');

  function setNavOpen(open) {
    if (!navDrawer || !burgerBtn) return;
    navDrawer.classList.toggle('open', open);
    burgerBtn.classList.toggle('is-open', open);
    burgerBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    burgerBtn.setAttribute('aria-label', open ? 'Chiudi menu' : 'Apri menu');
    navDrawer.setAttribute(
      'aria-hidden',
      open || !mobileNavMq.matches ? 'false' : 'true'
    );
    document.documentElement.classList.toggle('nav-open', open);
    document.body.classList.toggle('nav-open', open);
    if (navBackdrop) {
      navBackdrop.classList.toggle('open', open);
      navBackdrop.setAttribute('aria-hidden', open ? 'false' : 'true');
    }
  }

  const mobileNavMq = window.matchMedia('(max-width: 768px)');

  function mountMobileNav() {
    const header = document.getElementById('navbar');
    const inner = header?.querySelector('.navbar__inner');
    if (!navDrawer || !navBackdrop || !header || !inner) return;

    if (mobileNavMq.matches) {
      if (navBackdrop.parentElement !== document.body) document.body.appendChild(navBackdrop);
      if (navDrawer.parentElement !== document.body) document.body.appendChild(navDrawer);
    } else {
      setNavOpen(false);
      navDrawer.setAttribute('aria-hidden', 'false');
      const cta = inner.querySelector('.navbar__cta');
      if (cta) inner.insertBefore(navDrawer, cta);
      else inner.appendChild(navDrawer);
      if (header.nextElementSibling !== navBackdrop) {
        header.insertAdjacentElement('afterend', navBackdrop);
      }
    }
  }

  mountMobileNav();
  if (typeof mobileNavMq.addEventListener === 'function') {
    mobileNavMq.addEventListener('change', mountMobileNav);
  } else if (typeof mobileNavMq.addListener === 'function') {
    mobileNavMq.addListener(mountMobileNav);
  }

  if (burgerBtn && navDrawer) {
    burgerBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      setNavOpen(!navDrawer.classList.contains('open'));
    });

    if (navBackdrop) {
      navBackdrop.addEventListener('click', () => setNavOpen(false));
    }

    navDrawer.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => setNavOpen(false));
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navDrawer.classList.contains('open')) setNavOpen(false);
    });
  }

  // ─── Accordion / Projects (mobile: tap apre, swipe scorre pagina) ───
  function setupAccordion() {
    const accItems = document.querySelectorAll('.acc-item');

    accItems.forEach((item) => {
      const header = item.querySelector('.acc-header');
      if (!header || header.dataset.accReady) return;
      header.dataset.accReady = '1';

      let touchStartY = 0;
      let touchMoved = false;
      let lastTouchToggle = 0;

      const toggle = () => {
        const isActive = item.classList.contains('active');

        accItems.forEach((i) => {
          i.classList.remove('active');
          i.querySelector('.acc-header')?.setAttribute('aria-expanded', 'false');
        });

        if (!isActive) {
          item.classList.add('active');
          header.setAttribute('aria-expanded', 'true');
        }
      };

      header.addEventListener('mousedown', (e) => {
        if (e.button === 0) e.preventDefault();
      });

      header.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
        touchMoved = false;
      }, { passive: true });

      header.addEventListener('touchmove', (e) => {
        if (Math.abs(e.touches[0].clientY - touchStartY) > 10) {
          touchMoved = true;
        }
      }, { passive: true });

      header.addEventListener('touchend', () => {
        if (!touchMoved) {
          lastTouchToggle = Date.now();
          toggle();
        }
      });

      header.addEventListener('click', () => {
        if (Date.now() - lastTouchToggle < 500) return;
        toggle();
      });

      header.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggle();
        }
      });
    });
  }

  setupAccordion();
  document.addEventListener('progetti:home-rendered', setupAccordion);

  // ─── Contact form ───
  const form = document.getElementById('contactForm');
  const successMsg = document.getElementById('formSuccess');

  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();

      const nome = form.nome.value.trim();
      const email = form.email.value.trim();
      const messaggio = form.messaggio.value.trim();
      const privacy = form.privacy.checked;

      // Basic validation
      let valid = true;
      [form.nome, form.email, form.messaggio].forEach(field => {
        field.style.borderColor = '';
      });

      if (!nome) { form.nome.style.borderColor = '#e74c3c'; valid = false; }
      if (!email || !email.includes('@')) { form.email.style.borderColor = '#e74c3c'; valid = false; }
      if (!messaggio) { form.messaggio.style.borderColor = '#e74c3c'; valid = false; }
      if (!privacy) {
        form.privacy.parentElement.style.outline = '2px solid #e74c3c';
        form.privacy.parentElement.style.borderRadius = '4px';
        valid = false;
      } else {
        form.privacy.parentElement.style.outline = '';
      }

      if (!valid) return;

      const submitBtn = form.querySelector('[type="submit"]');
      const defaultBtnHtml = submitBtn.innerHTML;
      submitBtn.textContent = 'Invio in corso…';
      submitBtn.disabled = true;

      const payload = new URLSearchParams(new FormData(form)).toString();

      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: payload,
      })
        .then((res) => {
          if (!res.ok) throw new Error('Invio fallito');
          form.reset();
          successMsg.classList.add('visible');
          setTimeout(() => successMsg.classList.remove('visible'), 5000);
        })
        .catch(() => {
          alert('Invio non riuscito. Riprova o contattaci al telefono.');
        })
        .finally(() => {
          submitBtn.innerHTML = defaultBtnHtml;
          submitBtn.disabled = false;
        });
    });
  }

  // ─── Fade-in on scroll (Intersection Observer) ───
  const fadeSelector =
    '.service-card, .acc-item, .contact-item, .why-us__content, .stat, .proj-card';
  let fadeObserver;

  function setupFadeIn() {
    const fadeEls = document.querySelectorAll(fadeSelector);
    fadeEls.forEach((el) => {
      if (el.dataset.fadeReady) return;
      el.dataset.fadeReady = '1';
      el.classList.add('fade-in');
      const siblings = el.parentElement?.querySelectorAll('.proj-card') || [];
      const i = siblings.length ? Array.from(siblings).indexOf(el) : 0;
      const delay = i % 3;
      if (delay === 1) el.classList.add('fade-in-delay-1');
      if (delay === 2) el.classList.add('fade-in-delay-2');
      fadeObserver.observe(el);
    });
  }

  fadeObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          fadeObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  setupFadeIn();
  document.addEventListener('progetti:home-rendered', setupFadeIn);

  // ─── Smooth scroll for anchor links ───
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const href = anchor.getAttribute('href');
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const lb = document.getElementById('projLightbox');
      if (lb?.classList.contains('open') && typeof ProgettiLoader !== 'undefined') {
        ProgettiLoader.closeProgettoDetail();
      }
      const navH = navbar.offsetHeight + 8;
      const top = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // ─── Active nav link highlight ───
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.navbar__drawer a, .navbar__links a');

  const sectionObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navAnchors.forEach(a => {
            a.style.fontWeight = a.getAttribute('href') === `#${id}` ? '700' : '500';
          });
        }
      });
    },
    { rootMargin: '-50% 0px -50% 0px' }
  );

  sections.forEach(s => sectionObserver.observe(s));

});
