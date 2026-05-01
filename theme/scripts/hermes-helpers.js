'use strict';

// Word count — Chinese chars count as 1, latin words split by whitespace
function countWords(text) {
  if (!text) return 0;
  const stripped = String(text).replace(/<[^>]+>/g, ' ');
  const cjk = (stripped.match(/[一-龥]/g) || []).length;
  const latin = (stripped.replace(/[一-龥]/g, ' ').match(/[A-Za-z0-9_-]+/g) || []).length;
  return cjk + latin;
}

function readingMinutes(words) {
  const wpm = 300; // average mixed-content speed
  return Math.max(1, Math.round(words / wpm));
}

// Prefixed to avoid collision with any built-in or third-party helpers
hexo.extend.helper.register('hermes_word_count', function (post) {
  return countWords(post.content || '');
});

hexo.extend.helper.register('hermes_reading_minutes', function (post) {
  return readingMinutes(countWords(post.content || ''));
});

hexo.extend.helper.register('format_date_ymd', function (d) {
  const date = new Date(d);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${y}.${m}.${dd}`;
});

hexo.extend.helper.register('post_meta_line', function (post) {
  const url = this.url_for(post.path);
  const slug = post.slug || post.path.replace(/\/$/, '').split('/').pop();
  return `$ cat posts/${slug}.md`;
});

// Post content filter: replace code blocks with our styled .code-block wrapper.
// Handles two input shapes:
//   1. Hexo default: <figure class="highlight LANG">...<td class="code"><pre>...</pre></td>...</figure>
//      (including a .gutter <td> with line numbers, which is discarded — nobody wants to copy line numbers)
//   2. Plain <pre>...</pre> (highlight.wrap: false, external highlighter, or fenced blocks through marked)
function wrapBlock(inner, lang) {
  const label = (lang || '').trim().split(/\s+/)[0].replace(/^language-/, '').toUpperCase();
  return `<div class="code-block"><div class="code-block__bar"><span class="code-block__lang">${label}</span><button class="code-block__copy" data-code-copy>COPY</button></div><pre data-wrapped>${inner}</pre></div>`;
}

hexo.extend.filter.register('after_render:html', function (html, data) {
  if (!data || !data.path || !data.path.endsWith('.html')) return html;

  // Case 1 — figure-wrapped Hexo highlight output. Grabs the <pre> from the code column
  // and drops the entire figure+table (so the gutter column goes with it).
  html = html.replace(
    /<figure class="highlight(?:\s+([^"]*))?"[^>]*>[\s\S]*?<td class="code"><pre[^>]*>([\s\S]*?)<\/pre><\/td>[\s\S]*?<\/figure>/g,
    (_m, lang, inner) => wrapBlock(inner, lang)
  );

  // Case 2 — any remaining plain <pre> (not already wrapped by case 1).
  html = html.replace(
    /<pre((?:(?!data-wrapped)[^>])*)>([\s\S]*?)<\/pre>/g,
    (_m, attrs, inner) => {
      const langMatch = inner.match(/class="[^"]*language-(\w+)/);
      return wrapBlock(inner, langMatch ? langMatch[1] : '');
    }
  );

  return html;
});
