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

// Post content filter: wrap <pre> with COPY button
hexo.extend.filter.register('after_render:html', function (html, data) {
  if (!data || !data.path || !data.path.endsWith('.html')) return html;
  return html.replace(
    /<pre([^>]*)>([\s\S]*?)<\/pre>/g,
    (match, attrs, inner) => {
      // Detect language from class="language-xxx" on child <code>
      const langMatch = inner.match(/class="[^"]*language-(\w+)/);
      const lang = langMatch ? langMatch[1].toUpperCase() : '';
      return `<div class="code-block"><div class="code-block__bar"><span class="code-block__lang">${lang}</span><button class="code-block__copy" data-code-copy>COPY</button></div><pre${attrs}>${inner}</pre></div>`;
    }
  );
});
