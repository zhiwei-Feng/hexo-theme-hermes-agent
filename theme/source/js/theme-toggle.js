const KEY = 'hermesTheme';

function current() {
  return document.documentElement.classList.contains('light') ? 'light' : 'dark';
}

function apply(mode) {
  document.documentElement.classList.toggle('light', mode === 'light');
  try { localStorage.setItem(KEY, mode); } catch (_) {}
}

document.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-theme-toggle]');
  if (!btn) return;
  apply(current() === 'light' ? 'dark' : 'light');
});

document.addEventListener('click', (e) => {
  const ham = e.target.closest('[data-nav-toggle]');
  if (!ham) return;
  const links = document.querySelector('.site-nav__links');
  if (links) links.classList.toggle('is-open');
});
