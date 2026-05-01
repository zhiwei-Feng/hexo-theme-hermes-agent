const toc = document.querySelector('[data-toc]');
const fab = document.querySelector('[data-toc-fab]');
const scrim = document.querySelector('[data-toc-scrim]');

if (toc && fab && scrim) {
  if (!toc.querySelector('a[href]')) {
    fab.remove();
    scrim.remove();
  } else {
    const close = () => {
      toc.classList.remove('is-open');
      scrim.classList.remove('is-open');
      fab.setAttribute('aria-expanded', 'false');
      document.body.style.removeProperty('overflow');
    };
    const open = () => {
      toc.classList.add('is-open');
      scrim.classList.add('is-open');
      fab.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    };
    fab.addEventListener('click', () => {
      toc.classList.contains('is-open') ? close() : open();
    });
    scrim.addEventListener('click', close);
    toc.addEventListener('click', (e) => {
      if (e.target.closest('a[href]')) close();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && toc.classList.contains('is-open')) close();
    });
  }
}

if (toc) {
  const links = Array.from(toc.querySelectorAll('a[href^="#"]'));
  const targets = links
    .map((a) => {
      const id = decodeURIComponent(a.getAttribute('href').slice(1));
      const el = document.getElementById(id);
      return el ? { link: a, el } : null;
    })
    .filter(Boolean);

  if (targets.length > 0 && 'IntersectionObserver' in window) {
    let activeIndex = -1;

    function setActive(idx) {
      if (idx === activeIndex) return;
      activeIndex = idx;
      targets.forEach(({ link }, i) => {
        link.classList.remove('is-active', 'is-read');
        if (i < idx) link.classList.add('is-read');
        if (i === idx) link.classList.add('is-active');
      });
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const idx = targets.findIndex((t) => t.el === entry.target);
          if (idx >= 0) setActive(idx);
        }
      });
    }, { rootMargin: '0px 0px -70% 0px', threshold: 0 });

    targets.forEach(({ el }) => observer.observe(el));
  }
}
