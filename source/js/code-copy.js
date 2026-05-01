async function copyText(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  document.execCommand('copy');
  document.body.removeChild(ta);
}

document.addEventListener('click', async (e) => {
  const btn = e.target.closest('[data-code-copy]');
  if (!btn) return;
  const block = btn.closest('.code-block');
  if (!block) return;
  const pre = block.querySelector('pre');
  if (!pre) return;
  try {
    await copyText(pre.innerText);
    const old = btn.textContent;
    btn.textContent = 'COPIED ✓';
    setTimeout(() => { btn.textContent = old; }, 2000);
  } catch (err) {
    btn.textContent = 'FAILED';
    setTimeout(() => { btn.textContent = 'COPY'; }, 2000);
  }
});
