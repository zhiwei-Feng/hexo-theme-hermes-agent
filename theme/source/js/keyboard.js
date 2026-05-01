// Ignore bindings when user is typing in an input/textarea/contenteditable
function inInput() {
  const el = document.activeElement;
  if (!el) return false;
  const tag = el.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || el.isContentEditable;
}

let chord = null;
let chordTimer = null;

function resetChord() {
  chord = null;
  clearTimeout(chordTimer);
}

function setChord(prefix) {
  chord = prefix;
  clearTimeout(chordTimer);
  chordTimer = setTimeout(resetChord, 1200);
}

document.addEventListener('keydown', (e) => {
  if (inInput()) return;
  if (e.metaKey || e.ctrlKey || e.altKey) return;

  // Single-key bindings
  if (e.key === '/') {
    e.preventDefault();
    if (typeof window.__hermesOpenSearch === 'function') window.__hermesOpenSearch();
    return;
  }
  if (e.key === 't') {
    e.preventDefault();
    const btn = document.querySelector('[data-theme-toggle]');
    if (btn) btn.click();
    return;
  }

  // Chord bindings: `g` then another key
  if (e.key === 'g' && !chord) {
    setChord('g');
    return;
  }
  if (chord === 'g') {
    if (e.key === 'h') { e.preventDefault(); window.location.href = '/'; }
    else if (e.key === 'a') { e.preventDefault(); window.location.href = '/archives/'; }
    else if (e.key === 't') { e.preventDefault(); window.location.href = '/tags/'; }
    resetChord();
  }
});
