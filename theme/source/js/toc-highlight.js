const toc = document.querySelector('[data-toc]');
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
