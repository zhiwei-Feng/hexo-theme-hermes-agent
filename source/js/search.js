const modal = document.querySelector('[data-search-modal]');
const input = document.querySelector('[data-search-input]');
const results = document.querySelector('[data-search-results]');
const form = document.querySelector('[data-search-form]');
const noResultsText = (window.__hermesI18n && window.__hermesI18n.noResults) || 'no matches';

let index = null;
let activeIdx = -1;

async function loadIndex() {
  if (index) return index;
  const res = await fetch('/search.json');
  if (!res.ok) throw new Error('failed to load search index');
  const data = await res.json();
  // hexo-generator-search returns an array of {title, url, content, tags, categories, date}
  index = Array.isArray(data) ? data : (data.entries || []);
  return index;
}

function openModal() {
  if (!modal) return;
  if (typeof modal.showModal === 'function') modal.showModal();
  else modal.setAttribute('open', '');
  loadIndex().catch(() => {});
  setTimeout(() => input && input.focus(), 30);
}

function closeModal() {
  if (!modal) return;
  if (typeof modal.close === 'function') modal.close();
  else modal.removeAttribute('open');
  if (input) input.value = '';
  if (results) results.innerHTML = '';
  activeIdx = -1;
}

function highlight(text, query) {
  if (!query) return text;
  const escQ = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return text.replace(new RegExp(`(${escQ})`, 'gi'), '<mark>$1</mark>');
}

function render(items, query) {
  if (!results) return;
  if (items.length === 0) {
    results.innerHTML = `<div class="search-modal__empty">${noResultsText}</div>`;
    return;
  }
  results.innerHTML = items
    .slice(0, 10)
    .map((it, i) => {
      const snippet = (it.content || '').slice(0, 200);
      return `<a class="search-modal__item${i === 0 ? ' is-active' : ''}" href="${it.url || it.permalink}" data-idx="${i}">
        <div class="search-modal__title">${highlight(it.title || '', query)}</div>
        <div class="search-modal__snippet">${highlight(snippet, query)}</div>
      </a>`;
    })
    .join('');
  activeIdx = 0;
}

async function doSearch() {
  const q = (input && input.value || '').trim();
  if (!q) { if (results) results.innerHTML = ''; return; }
  const data = await loadIndex();
  const ql = q.toLowerCase();
  const hits = data.filter((it) => {
    return (it.title || '').toLowerCase().includes(ql)
      || (it.content || '').toLowerCase().includes(ql)
      || (it.tags || '').toLowerCase().includes(ql)
      || (it.categories || '').toLowerCase().includes(ql);
  });
  render(hits, q);
}

function setActive(newIdx) {
  const items = results ? results.querySelectorAll('.search-modal__item') : [];
  if (items.length === 0) return;
  activeIdx = ((newIdx % items.length) + items.length) % items.length;
  items.forEach((el, i) => el.classList.toggle('is-active', i === activeIdx));
  items[activeIdx].scrollIntoView({ block: 'nearest' });
}

// Wire events
document.addEventListener('click', (e) => {
  if (e.target.closest('[data-search-open]')) { e.preventDefault(); openModal(); }
  if (e.target.closest('[data-search-close]')) { e.preventDefault(); closeModal(); }
});

if (input) input.addEventListener('input', () => doSearch());

if (modal) modal.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') { e.preventDefault(); closeModal(); }
  else if (e.key === 'ArrowDown') { e.preventDefault(); setActive(activeIdx + 1); }
  else if (e.key === 'ArrowUp')   { e.preventDefault(); setActive(activeIdx - 1); }
  else if (e.key === 'Enter' && activeIdx >= 0) {
    e.preventDefault();
    const items = results.querySelectorAll('.search-modal__item');
    if (items[activeIdx]) window.location.href = items[activeIdx].getAttribute('href');
  }
});

// Expose open for keyboard.js
window.__hermesOpenSearch = openModal;
