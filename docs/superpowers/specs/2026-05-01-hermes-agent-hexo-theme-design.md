# Hexo Theme · Hermes Agent — Design Spec

**Status**: draft · 2026-05-01
**Owner**: adrianfeng
**Reference**: https://hermes-agent.nousresearch.com/

## 1. Goal

Build a Hexo blog theme whose visual language replicates the Nous Research Hermes Agent marketing site — the deep-teal + warm-cream CRT aesthetic, the grid-framed panels, the terminal-style meta chrome — adapted for a personal blog that hosts tech/engineering notes, AI/LLM research notes, and short-form essays.

The theme is for personal use and will be published to GitHub as open source (not officially distributed to hexo-themes.org, so licensing for fonts only needs to be clean enough to redistribute).

## 2. Non-goals

- No marketing-site sections (install steps, product feature grid, embedded demo video) on the homepage
- No support for legacy browsers (IE, pre-2023 mobile Safari)
- No theme builder / color picker UI — palette overrides via `_config.yml`
- No payment / subscription / membership features
- No i18n beyond English + zh-CN scaffolding
- No SSR or dynamic data beyond what Hexo's static generation produces

## 3. Palette (sampled from live screenshot)

The CSS tokens in the reference site's stylesheet (`--midground: #ffac02` etc.) are runtime-overridden by JavaScript. The authoritative palette was sampled from a headless Chrome screenshot of https://hermes-agent.nousresearch.com/ and quantized with Pillow.

### Dark mode (default)

| Token | Value | Role |
|---|---|---|
| `--background` | `#041c1b` | Body, nav, footer — the single dominant color |
| `--surface` | `#11332f` | Slightly raised panel — code blocks, modals, callouts |
| `--background-deep` | `#000203` | Modal backdrop only |
| `--line` | `#1a3834` | All grid dividers and borders (one step lighter than background) |
| `--foreground` | `#f0e0c0` | Primary text — warm cream, not pure white |
| `--foreground-dim` | `#b0a090` | Secondary text, meta, non-active TOC items |
| `--midground` | `#384038` | Tertiary / disabled / far-future TOC items — desaturated olive |
| `--accent` | `#fb2c36` | Red — used exclusively for 404 ERROR marker and true error states |

### Light mode

Implemented as `html.light { filter: invert(1); }`. No redefined palette; this is a deliberate design decision for 1:1 fidelity with Hermes's own theme-toggle behavior. Images, code highlighting, and KaTeX receive `.no-invert` class which applies a nested `filter: invert(1)` to cancel the outer inversion. Effective light-mode colors (computed, not authored):

- body: `#fbe3e4` (inverted `#041c1b` — a very pale pink-cream)
- text: `#0f1f3f` (inverted `#f0e0c0` — deep navy)
- code: `#eeccd0` / `#0f1f3f` inverted pair

The light mode is deliberately unconventional. A future `theme_mode: classic` option in `_config.yml` may define a traditional paper-cream light palette; not in scope for v0.1.

### Design philosophy

Low-saturation, low-contrast "phosphor decay" aesthetic. The palette lives in a narrow color gamut (deep teal → desaturated olive → warm cream). Hierarchy is conveyed through **luminance differences**, not saturated accent colors. No amber. No bright neon green. Visual references: old CRT green-phosphor monitors, faded letterpress, low-light night-vision.

## 4. Typography

### Stack (OFL defaults, overridable)

- **Display / body base**: `"Young Serif", Georgia, serif` — OFL stand-in for Hermes's Mondwest. Users who own a PangramPangram Mondwest license can drop the woff2 into `source/fonts/` and set `fonts.display: mondwest`. (PP Editorial New considered but rejected — commercial, cannot ship.)
- **Compressed headings**: `"Archivo Narrow", system-ui, sans-serif` — replaces Rules Compressed
- **Expanded headings**: `"Archivo", system-ui, sans-serif` — replaces Rules Expanded
- **Mono**: `"Courier Prime", ui-monospace, Menlo, monospace` — OFL, bundled directly

### Case rules

- Default `text-transform: uppercase` applied to **UI chrome only**: nav, card titles, meta bars, TOC labels, footer
- Prose markdown content preserves original case, uses the serif display face, no uppercase transform
- Justification: long-form reading with uppercase destroys rhythm

### Scale (rem, root 16px)

| Token | Size | Usage |
|---|---|---|
| `--text-hero` | 2.625rem | Homepage hero title |
| `--text-title` | 1.5rem | Post H1 |
| `--text-h2` | 1rem, mono, uppercase, `--foreground-dim` left-bar | Post section headings, styled as `## 01 · SECTION TITLE` |
| `--text-h3` | 0.9375rem, mono, uppercase | Post sub-section |
| `--text-body` | 1rem | Prose body |
| `--text-ui` | 0.9375rem, tracking 0.1875rem | Nav, card titles |
| `--text-meta` | 0.75rem, mono, tracking 0.125rem | Dates, reading time, counts |

## 5. Signature effects

All pure-CSS, no JS. Each toggleable via `effects.*` in `_config.yml`.

1. **`.dither`** — 2px repeating-conic-gradient checker overlay. Used on hover states and button backgrounds for noise texture.
2. **`.blink`** — `animation: blink 1s step-end infinite`. Used on terminal cursors, search input, end-of-file marker, hover card indicators.
3. **`.arc-border`** — animated gradient stroke along the edge of a card (2.23s loop). Used on hover for featured cards and nav items.
4. **`.grid-frame`** (`.g .gc`) — the foundational grid system. Each grid cell separated by `border: 1px solid var(--line)`. Used on homepage post grid, archive lists, about page cells, footer columns.
5. **`.bevel`** — inset double shadow `inset -1px -1px 0 #00000080, inset 1px 1px 0 #ffffff29`. Used on code blocks and prev/next buttons for subtle raised effect.

All effects are disabled when the user's browser reports `prefers-reduced-motion: reduce`.

## 6. Page layouts

### 6.1 Homepage (`index.ejs`) — Layout C

Resolved during brainstorming. Sections from top:

1. **Nav** — `[SITE_TITLE]` on left (two-line stacked serif), then `ARCHIVE · TAGS · ABOUT · GITHUB · SEARCH(/) · ☾` — all on `--background`, divided by `--line` columns
2. **Mini hero** — site title repeated large (or different, configurable) + tagline in mono uppercase
3. **Featured post card** — full-width, `grid-column: span 2`, category label + title + excerpt + date/reading-time
4. **Recent post grid** — `auto-fit minmax(280px, 1fr)` layout, each cell shows `NUMBER`, `TITLE`, `DATE` — up to 6 visible, with "MORE →" link to `/archives/` in the last cell
5. **Footer** — three columns: site version / copyright / social

### 6.2 Post page (`post.ejs`)

1. **Nav** — same as homepage
2. **Terminal meta** — two-line:
   - Line 1: `$ cat posts/<slug>.md`
   - Line 2: `YYYY.MM.DD · N MIN READ · N WORDS · [TAG1] [TAG2]`
3. **Title** — large serif, uppercase, 1.1 line-height
4. **Subtitle** (optional, from front-matter `description`) — mono lowercase with em-dash prefix
5. **Two-column body** (desktop ≥1200):
   - Left: prose content
   - Right: sticky TOC (220px), only renders if post has ≥2 H2
6. **Content block styles**:
   - H2: `## NN · TITLE` mono uppercase, `border-left: 2px solid var(--foreground-dim)`
   - Code block: bevel + `--surface` background, language label top-right, `COPY` button appearing on hover
   - Blockquote: `--foreground-dim` left border + italic text
   - NOTE callout: gesso-inverted panel with uppercase `NOTE ──` label
   - Images: wrapped in `<figure>`, get `.no-invert` automatically
7. **Footer** (of article): prev/next beveled cards + `$ end of file_` blink line

### 6.3 Archive (`archive.ejs`)

- Grouped by year, descending. Year heading: `## 2026 · N POSTS` in mono
- Each post: `YYYY.MM.DD · TITLE · · · · · · [TAG]` — the dot filler between title and tag is CSS (`flex: 1` + `border-bottom: 1px dashed`)
- Footer totals: `TOTAL · N POSTS · N YEARS`

### 6.4 Categories / Tags

- `/categories/` and `/tags/` index pages show a cloud: each category/tag as a bordered chip `TECH(32)` with count suffix
- Chip size/opacity varies with count (log scale)
- Clicking a chip filters; single-category/tag pages reuse archive list format

### 6.5 About (`page.ejs` with special layout when `layout: about`)

- 3×2 grid of `.gc` cells
- Cell headers read like shell commands: `$ whoami`, `$ ls ~/projects`, `$ cat /etc/contact`, `$ uname -a`
- Content under each header is freeform markdown

### 6.6 404

- Full-viewport centered terminal
- Lines appear as if typed (`%PATH%` = the broken URL the visitor requested, rendered literally):
  - `$ cat posts%PATH%`
  - `ERROR 404: file not found` (red `--accent`)
  - `→ try /archives/ or /`
- Giant blink cursor below
- The only page where `--accent` red is used

## 7. Interactions

### 7.1 Theme toggle
- `☾` button in nav toggles `html.classList.toggle('light')`; preference persisted to `localStorage.hermesTheme`
- Flash prevention: inline `<script>` block in `<head>` (before CSS loads) reads localStorage and sets class synchronously
- First visit: `matchMedia('(prefers-color-scheme: light)').matches` seeds the class
- Light mode: `html.light { filter: invert(1); }` — one rule
- Images, `.katex`, `.hljs` token colors, and inline `<svg>` elements get a utility class `.no-invert { filter: invert(1); }` to cancel the outer inversion

### 7.2 Search
- Build: `hexo-generator-search` produces `/search.json` with entries `{title, url, content (truncated to 300 chars), tags, categories, date}`
- `/` key → open modal (centered, `--surface` panel, bevel, 60vw wide)
- Input has blinking cursor, mono, placeholder `search posts...`
- Matching: case-insensitive substring against title + tags + content (client-side)
- Results: up to 10, each shows title + date + matched snippet with match highlighted in `--foreground` (non-match text in `--foreground-dim`)
- Keyboard: `↑/↓` select, `Enter` navigate, `Esc` close
- Mobile: search icon in nav opens same modal

### 7.3 Code copy
- Rendered server-side via a Hexo filter that wraps each `<pre>` with a `COPY` button in the top-right corner
- Client-side JS attaches click handler using `navigator.clipboard.writeText()`; on success, button text becomes `COPIED ✓` for 2s
- Fallback: `document.execCommand('copy')` for browsers without Clipboard API

### 7.4 TOC highlighting
- `IntersectionObserver` watches all `h2[id]` and `h3[id]` in article
- Active entry: `--foreground` text with 2px solid left bar
- Entries already scrolled past: `--foreground-dim`
- Entries not yet reached: `--midground`
- Mobile: collapsed `[CONTENTS ▾]` dropdown, opens to the same list

### 7.5 Keyboard map
- `/` — open search
- `Esc` — close any modal
- `g then a` — go to archives
- `g then h` — go home
- `t` — toggle theme
- All bindings ignore when focus is in an input/textarea

## 8. Responsive behavior

| Breakpoint | Width | Homepage grid | Post page | Nav |
|---|---|---|---|---|
| Desktop | ≥1200 | 3-col auto-fit, featured spans 2 | Body + 220px TOC | Horizontal |
| Tablet | 768–1199 | 2-col | Body only, TOC as top dropdown | Horizontal, compact |
| Mobile | <768 | 1-col | 1-col, TOC as top dropdown | Hamburger drawer |

Layout uses CSS Grid `auto-fit` / `minmax()` for the card grid — no JS resize handlers needed. At narrow widths, uppercase `letter-spacing` tightens from `0.1875rem` to `0.075rem` to prevent wrap on short labels.

## 9. Directory structure

```
hexo-theme-hermes-agent/
├── _config.yml
├── languages/{default,zh-CN}.yml
├── layout/
│   ├── _partial/{head,nav,footer,toc,post-meta,pagination,search-modal,theme-toggle}.ejs
│   ├── layout.ejs
│   ├── {index,post,page,archive,category,tag,404}.ejs
├── source/
│   ├── css/
│   │   ├── main.scss
│   │   ├── _{variables,reset,typography,grid,effects,nav,post,code,search,theme-light,responsive}.scss
│   ├── js/{theme-toggle,search,code-copy,toc-highlight,keyboard}.js
│   ├── fonts/*.woff2
│   └── images/{filler-bg.jpg,og-default.png}
├── scripts/hermes-helpers.js      # Hexo generation hooks
├── package.json
├── README.md
└── LICENSE
```

## 10. `_config.yml` surface

```yaml
site_title: "Your Name"
tagline: "Tech · AI · Life"

nav:
  - { name: ARCHIVE, path: /archives/ }
  - { name: TAGS, path: /tags/ }
  - { name: ABOUT, path: /about/ }
  - { name: GITHUB, url: "https://github.com/you" }

theme_mode: invert              # invert | classic (classic deferred to v0.2)

featured_post: latest           # latest | front_matter

fonts:
  display: archivo              # archivo | mondwest (requires self-hosted woff2)
  mono: courier_prime

effects:
  dither: true
  blink: true
  arc_border: true
  bevel: true

search:
  enable: true
  shortcut: "/"

comments:
  enable: false
  giscus: { repo: "", repo_id: "", category_id: "" }

katex:
  enable: true
  per_post: true                # only inject if post has `math: true` in front-matter

social:
  github: you
  rss: true

palette:                        # optional full override
  background: "#041c1b"
  surface: "#11332f"
  foreground: "#f0e0c0"
  foreground_dim: "#b0a090"
  midground: "#384038"
  line: "#1a3834"
  accent: "#fb2c36"
```

## 11. Dependencies

Declared in `package.json` with permissive ranges:

- `hexo` `^7.0.0` (peer)
- `hexo-renderer-ejs` `^2.0.0`
- `hexo-renderer-sass` `^0.4.0` (or `hexo-renderer-sass-next` if still maintained)
- `hexo-generator-search` `^2.4.0`
- KaTeX integration: `hexo-filter-katex` or equivalent (exact package and version picked during implementation; must be an optional peer dep, loaded only when `katex.enable: true`)

No runtime build step. `hexo generate` produces final HTML/CSS/JS directly.

## 12. Verification strategy

### 12.1 Fixture blog
`test/` ships a minimal Hexo site with:
- Posts exercising all markdown features (code, math, tables, images, long quotes, multi-level headings, very long title, Chinese content)
- 2+ categories, 5+ tags
- Featured post front-matter
- About page

Command: `npm run dev` → `cd test && hexo clean && hexo server`

### 12.2 Manual checklist (README)

- [ ] Home renders featured + 5 recent
- [ ] Post TOC highlights on scroll
- [ ] Code copy works (both modern and fallback paths)
- [ ] `/` opens search, results highlight matches, keyboard navigation works
- [ ] Theme toggle: no flash on page load, preference persists after reload
- [ ] In light mode: images, KaTeX, code tokens do not invert to negative colors
- [ ] 404 renders terminal layout
- [ ] Mobile: hamburger opens drawer, TOC collapses to dropdown
- [ ] KaTeX renders when post has `math: true`
- [ ] Prose reading: no uppercase, no cramped line-height
- [ ] RSS at `/atom.xml` validates

### 12.3 Automated checks
- Playwright snapshot tests for `/`, `/archives/`, a fixture post, `/about/`, `/404.html` in both themes — tolerance 2% pixel diff
- Lighthouse CI on fixture home + post: performance ≥90, accessibility ≥90

### 12.4 Browser support
Latest two versions of Chromium, Firefox, Safari (desktop + iOS/Android mobile). No IE support.

## 13. Out of scope for v0.1 (future)

- `theme_mode: classic` (conventional paper-cream light mode)
- Giscus comments wiring (partial exists, config-only)
- Multi-author support
- Custom SVG logo upload
- Series / multi-part posts
- Related posts by tag similarity

## 14. Open questions

None blocking. All design decisions resolved during brainstorming.

## 15. Glossary

- **midground** — in Hermes's original CSS, a secondary color between background and foreground. In this theme, the dark desaturated olive used for tertiary UI.
- **dither** — the 2px checker texture overlay
- **gesso** — in Hermes's CSS, the light grey surface color. Not used in this theme's primary palette but mentioned for reference.
- **bevel** — the inset double-shadow effect that simulates a slightly raised panel
