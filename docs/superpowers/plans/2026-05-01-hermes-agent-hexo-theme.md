# Hermes Agent Hexo Theme Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Hexo blog theme (`hexo-theme-hermes-agent`) that reproduces the Nous Research Hermes Agent site's visual language (deep-teal + warm-cream phosphor-decay aesthetic, grid-framed panels, terminal meta chrome) adapted for a personal blog with tech/AI/essay content.

**Architecture:** Classic Hexo theme — EJS templates, SCSS via `hexo-renderer-sass-next`, vanilla ES-module JS. Zero build chain at install time; `hexo generate` produces final static output. The theme ships a `test/` fixture blog so `npm run dev` boots a local server for eyeballing changes. Dark mode is authored; light mode is `html.light { filter: invert(1); }` with `.no-invert` escape hatches.

**Tech Stack:** Hexo 7, EJS, SCSS (hexo-renderer-sass-next), vanilla JS (ES modules), Prism.js for code highlighting (shipped with Hexo), hexo-generator-search for search index, Playwright for visual regression (deferred — see out-of-scope).

**Spec:** `docs/superpowers/specs/2026-05-01-hermes-agent-hexo-theme-design.md`

**Out of scope (deferred to v0.2):**
- Playwright visual regression suite and Lighthouse CI — infrastructure belongs in a separate plan
- `theme_mode: classic` (conventional paper-cream light mode)
- Giscus comments wiring beyond config scaffold

---

## File Structure

The theme follows Hexo's standard theme layout. Files are kept small and single-purpose.

**Templates (EJS):**
- `layout/layout.ejs` — HTML skeleton: doctype, head include, body, nav, {{ body }}, footer, scripts
- `layout/_partial/head.ejs` — `<head>` content: meta, OG, fonts, stylesheet, inline theme-flash script
- `layout/_partial/nav.ejs` — top nav with site title, links, search button, theme toggle
- `layout/_partial/footer.ejs` — 3-column footer
- `layout/_partial/post-meta.ejs` — terminal-style `$ cat posts/slug.md` + date/min/words/tags
- `layout/_partial/toc.ejs` — sticky desktop TOC (falls back to dropdown on mobile)
- `layout/_partial/pagination.ejs` — prev/next for list pages
- `layout/_partial/search-modal.ejs` — static markup for `/`-triggered search modal
- `layout/_partial/theme-toggle.ejs` — ☾ button
- `layout/index.ejs` — homepage (mini hero + featured + recent grid)
- `layout/post.ejs` — single post (two-column body + TOC)
- `layout/page.ejs` — custom pages (dispatches to about layout if front-matter `layout: about`)
- `layout/archive.ejs` — year-grouped archive list
- `layout/category.ejs` — single category or index of all categories
- `layout/tag.ejs` — single tag or index of all tags
- `layout/404.ejs` — 404 terminal

**Styles (SCSS, compiled by hexo-renderer-sass-next):**
- `source/css/main.scss` — entry, `@use` all partials
- `source/css/_variables.scss` — color, font, spacing tokens (reads `theme.palette` from Hexo config via EJS — or defines defaults)
- `source/css/_reset.scss` — minimal reset + `box-sizing`
- `source/css/_typography.scss` — `@font-face`, base type scale, h1–h6, p, blockquote, inline code
- `source/css/_grid.scss` — `.g`, `.gc` grid primitives
- `source/css/_effects.scss` — `.dither`, `.blink`, `.arc-border`, `.bevel`, `.no-invert`
- `source/css/_nav.scss`
- `source/css/_post.scss` — post page + TOC + meta
- `source/css/_code.scss` — pre/code + COPY button, Prism token overrides
- `source/css/_search.scss` — modal + results
- `source/css/_archive.scss` — archive, category, tag list styles
- `source/css/_theme-light.scss` — `html.light { filter: invert(1); }` + `.no-invert` cancellation
- `source/css/_responsive.scss` — breakpoints

**Scripts (vanilla ES modules):**
- `source/js/theme-toggle.js`
- `source/js/search.js`
- `source/js/code-copy.js`
- `source/js/toc-highlight.js`
- `source/js/keyboard.js` — `/` and navigation chord bindings

**Hexo hooks:**
- `scripts/hermes-helpers.js` — registers helpers: `hermes_reading_minutes()`, `hermes_word_count()`, `format_date_ymd()`, `post_meta_line()`. Also registers `after_render:html` filter to wrap `<pre>` with COPY button markup.

**Fonts (source/fonts/):**
- `CourierPrime-Regular.woff2`, `CourierPrime-Bold.woff2` (OFL)
- `ArchivoNarrow-Regular.woff2`, `Archivo-Regular.woff2`, `Archivo-Bold.woff2` (OFL)
- `YoungSerif-Regular.woff2` (OFL)

**Static assets:**
- `source/images/filler-bg.jpg` (tileable low-frequency noise texture, ~30KB)
- `source/images/og-default.png`

**Fixture blog:**
- `test/_config.yml`, `test/package.json`, `test/source/_posts/*.md` (8–10 fixture posts covering all markdown features), `test/source/about/index.md`

**Root:**
- `_config.yml` — theme's default config (site author's `_config.yml` can override)
- `languages/default.yml`, `languages/zh-CN.yml`
- `package.json`, `README.md`, `LICENSE`, `.gitignore`

---

## Task Index

1. Repo scaffolding + package.json + LICENSE + .gitignore
2. Fixture blog bootstrap (`test/` directory)
3. `_config.yml` + `languages/*.yml`
4. Font downloads + license attribution
5. SCSS foundation: `_variables` + `_reset` + `main.scss` entry
6. Typography: `@font-face` + base type scale
7. Grid primitives (`.g` / `.gc`)
8. Signature effects (`dither`, `blink`, `arc-border`, `bevel`, `no-invert`)
9. Layout skeleton (`layout.ejs` + `head.ejs`)
10. Navigation (`nav.ejs` + `_nav.scss`)
11. Theme toggle (button markup + inline flash-guard script + `theme-toggle.js` + light mode SCSS)
12. Footer (`footer.ejs`)
13. Post meta helper + `post-meta.ejs`
14. Post page (`post.ejs` + `_post.scss`)
15. Code block filter (Hexo `after_render:html` hook) + `code-copy.js` + `_code.scss`
16. TOC partial + `toc-highlight.js`
17. Homepage (`index.ejs`)
18. Archive page (`archive.ejs` + `_archive.scss`)
19. Category and Tag pages (`category.ejs`, `tag.ejs`)
20. About page layout (dispatch in `page.ejs`)
21. 404 page (`404.ejs`)
22. Search: config `hexo-generator-search` + `search-modal.ejs` + `search.js` + `_search.scss`
23. Keyboard map (`keyboard.js`)
24. Responsive breakpoints (`_responsive.scss`)
25. KaTeX opt-in integration
26. README + docs polish
27. Full checklist walkthrough + final commit

---

## Testing Philosophy

This theme ships no traditional unit tests — all verification is **visual smoke testing** against the `test/` fixture blog. Each task ends with:

1. `cd test && hexo clean && hexo g` must succeed with no errors
2. `cd test && hexo s` must serve without runtime errors
3. Manual browser check of the affected page(s)
4. DOM / console check for obvious breakage (no 404s in network, no JS errors)

An engineer executing this plan **must** keep a browser tab open on `http://localhost:4000` during implementation and eyeball the fixture blog after each task. Do not mark a task complete without verifying the visual output.

A future plan will add Playwright visual regression; for v0.1, human eyeballs are the gate.

---

## Task 1: Repo scaffolding

**Files:**
- Create: `package.json`
- Create: `LICENSE`
- Create: `.gitignore`
- Create: `README.md` (stub — final README written in Task 26)

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "hexo-theme-hermes-agent",
  "version": "0.1.0",
  "description": "A Hexo theme inspired by the Nous Research Hermes Agent visual language: deep-teal phosphor-decay aesthetic, grid-framed panels, terminal-style chrome.",
  "license": "MIT",
  "author": "adrianfeng",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/adrianfeng/hexo-theme-hermes-agent.git"
  },
  "keywords": ["hexo", "theme", "blog", "terminal", "minimal"],
  "peerDependencies": {
    "hexo": "^7.0.0"
  },
  "dependencies": {
    "hexo-renderer-ejs": "^2.0.0",
    "hexo-renderer-sass-next": "^0.1.3",
    "hexo-generator-search": "^2.4.0"
  },
  "scripts": {
    "dev": "cd test && hexo clean && hexo server --debug",
    "build": "cd test && hexo clean && hexo generate"
  },
  "files": [
    "_config.yml",
    "languages/",
    "layout/",
    "source/",
    "scripts/"
  ]
}
```

- [ ] **Step 2: Create `LICENSE` (MIT)**

Use the standard MIT license text. Copyright holder: `adrianfeng`. Year: `2026`.

- [ ] **Step 3: Create `.gitignore`**

```
node_modules/
test/node_modules/
test/public/
test/db.json
test/.deploy_git/
.superpowers/
.DS_Store
*.log
.claude/settings.local.json
```

- [ ] **Step 4: Create `README.md` stub**

```markdown
# hexo-theme-hermes-agent

A Hexo theme inspired by the Nous Research Hermes Agent visual language.

Work in progress. Full README coming in v0.1 release.
```

- [ ] **Step 5: Initialize git and commit**

```bash
cd /Users/adrianfeng/coding_workspace/hexo-theme-hermes-agent
git init -b main
git add package.json LICENSE .gitignore README.md docs/
git commit -m "chore: initial scaffolding"
```

---

## Task 2: Fixture blog bootstrap

**Files:**
- Create: `test/package.json`
- Create: `test/_config.yml`
- Create: `test/source/_posts/hello-world.md`
- Create: `test/source/_posts/sample-tech.md`
- Create: `test/source/_posts/sample-ai.md`
- Create: `test/source/_posts/sample-notes.md`
- Create: `test/source/about/index.md`

- [ ] **Step 1: Create `test/package.json`**

```json
{
  "name": "hermes-theme-fixture",
  "version": "0.0.0",
  "private": true,
  "hexo": { "version": "7.0.0" },
  "dependencies": {
    "hexo": "^7.0.0",
    "hexo-generator-archive": "^2.0.0",
    "hexo-generator-category": "^2.0.0",
    "hexo-generator-index": "^3.0.0",
    "hexo-generator-tag": "^2.0.0",
    "hexo-renderer-ejs": "^2.0.0",
    "hexo-renderer-marked": "^6.0.0",
    "hexo-renderer-sass-next": "^0.1.3",
    "hexo-generator-search": "^2.4.0",
    "hexo-server": "^3.0.0"
  }
}
```

- [ ] **Step 2: Create `test/_config.yml`**

```yaml
title: Hermes Theme Fixture
subtitle: "Tech · AI · Life"
description: "Fixture blog for hexo-theme-hermes-agent development."
author: "Test Author"
language: en
timezone: ""

url: http://localhost:4000
permalink: :year/:month/:day/:title/

source_dir: source
public_dir: public
tag_dir: tags
archive_dir: archives
category_dir: categories
code_dir: downloads/code
i18n_dir: :lang

default_layout: post
titlecase: false
external_link:
  enable: true
  field: site
  exclude: ''

date_format: YYYY-MM-DD
time_format: HH:mm:ss

per_page: 10
pagination_dir: page

theme: hermes-agent

# Point theme loader at the parent directory
# (test/themes/ is a symlink created by bootstrap)
```

- [ ] **Step 3: Install fixture deps and create theme symlink**

```bash
cd /Users/adrianfeng/coding_workspace/hexo-theme-hermes-agent/test
npm install
mkdir -p themes
ln -s ../.. themes/hermes-agent
```

- [ ] **Step 4: Create `test/source/_posts/hello-world.md`**

```markdown
---
title: Welcome to the Hermes Theme
date: 2026-04-28 10:00:00
tags: [meta]
categories: [notes]
description: Short subtitle line rendered in mono beneath the title.
---

A minimal post that verifies the layout renders. Contains only one paragraph and no code, so the page should render with no TOC.
```

- [ ] **Step 5: Create `test/source/_posts/sample-tech.md`** — long post covering code, blockquote, list, table, H2, H3, images.

```markdown
---
title: Hermes Agent Teardown · How Nous Builds a CLI Agent
date: 2026-04-27 14:30:00
tags: [tech, ai]
categories: [tech]
description: A walkthrough of the agentic loop, prompt compression strategies, and tool-use closures inside the Hermes CLI.
featured: true
---

## 01 · Architecture Overview

The agent loop is an incrementally-compressed prompt. Each tool call folds the observation back into context while preserving the key reasoning path.

### Core Loop

Three stages repeat until completion:

1. **Plan** — the model emits a plan in structured tokens
2. **Act** — one tool invocation per step
3. **Compress** — observation folded into a rolling summary

```bash
$ hermes run --task "refactor the auth middleware"
→ [1/3] reading src/middleware/auth.ts
→ [2/3] identifying refactor targets
→ [3/3] applying changes...
```

> An agent is not a chatbot with tools — it is a system that refines its own plan.

## 02 · Prompt Folding

| Stage | Context size | Retention |
|-------|--------------|-----------|
| Plan  | 8k           | full      |
| Act   | 16k          | last 3    |
| Recap | 4k           | summary   |

## 03 · Tool-Use Closure

Details on how tool calls bind back to the plan object go here.
```

- [ ] **Step 6: Create `test/source/_posts/sample-ai.md`** — AI/research post with `math: true`.

```markdown
---
title: LLM Inference · From Chain-of-Thought to Planner
date: 2026-04-21 09:00:00
tags: [ai, llm]
categories: [ai]
math: true
description: Why planning-based inference dominates CoT at long horizons.
---

## Motivation

CoT degrades on problems requiring backtracking. Given a task horizon $h$, the failure rate grows as

$$
P(\text{fail}) = 1 - (1 - p)^h
$$

where $p$ is the per-step error rate.

## Planner Formulation

A planner maintains a tree of candidate continuations and expands the most promising branch by UCB1 score.
```

- [ ] **Step 7: Create `test/source/_posts/sample-notes.md`** — short-form essay.

```markdown
---
title: Walking and Thinking · Week 3 of April
date: 2026-04-15 18:00:00
tags: [essays]
categories: [notes]
description: Loose notes from the week.
---

Short essay content. No code. Ordinary prose for testing typography.

Some more prose to ensure the layout handles multi-paragraph markdown without any structural markup.
```

- [ ] **Step 8: Create `test/source/about/index.md`**

```markdown
---
title: About
layout: about
---

## $ whoami

Sample author bio for the fixture blog.

## $ ls ~/projects

- Project alpha
- Project beta

## $ cat /etc/contact

- email@example.com
- github.com/you
```

- [ ] **Step 9: Commit**

```bash
cd /Users/adrianfeng/coding_workspace/hexo-theme-hermes-agent
git add test/
git commit -m "chore: bootstrap fixture blog"
```

---

## Task 3: Theme `_config.yml` and language files

**Files:**
- Create: `_config.yml`
- Create: `languages/default.yml`
- Create: `languages/zh-CN.yml`

- [ ] **Step 1: Create theme `_config.yml`**

```yaml
site_title: ""
tagline: ""

nav:
  - { name: ARCHIVE, path: /archives/ }
  - { name: TAGS, path: /tags/ }
  - { name: ABOUT, path: /about/ }

theme_mode: invert

featured_post: front_matter

fonts:
  display: young_serif
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
  giscus:
    repo: ""
    repo_id: ""
    category_id: ""

katex:
  enable: false
  per_post: true

social:
  github: ""
  rss: true

palette:
  background: "#041c1b"
  surface: "#11332f"
  background_deep: "#000203"
  line: "#1a3834"
  foreground: "#f0e0c0"
  foreground_dim: "#b0a090"
  midground: "#384038"
  accent: "#fb2c36"
```

- [ ] **Step 2: Create `languages/default.yml`**

```yaml
nav:
  archive: ARCHIVE
  tags: TAGS
  categories: CATEGORIES
  about: ABOUT
  search: SEARCH
  theme_toggle: TOGGLE THEME
post:
  read_time: "{n} MIN"
  word_count: "{n} WORDS"
  prev: PREV
  next: NEXT
  end_of_file: end of file
  contents: CONTENTS
archive:
  total: "TOTAL · {posts} POSTS · {years} YEARS"
  year_posts: "{n} POSTS"
search:
  placeholder: "search posts..."
  no_results: "no matches"
error:
  not_found_title: "ERROR 404: file not found"
  not_found_hint: "try /archives/ or /"
```

- [ ] **Step 3: Create `languages/zh-CN.yml`**

```yaml
nav:
  archive: 归档
  tags: 标签
  categories: 分类
  about: 关于
  search: 搜索
  theme_toggle: 切换主题
post:
  read_time: "{n} 分钟"
  word_count: "{n} 字"
  prev: 上一篇
  next: 下一篇
  end_of_file: 文末
  contents: 目录
archive:
  total: "共 {posts} 篇 · {years} 年"
  year_posts: "{n} 篇"
search:
  placeholder: "搜索文章..."
  no_results: "没有匹配"
error:
  not_found_title: "错误 404：文件未找到"
  not_found_hint: "试试 /archives/ 或 /"
```

- [ ] **Step 4: Commit**

```bash
git add _config.yml languages/
git commit -m "feat(config): theme config and language packs"
```

---

## Task 4: Font downloads and license attribution

**Files:**
- Create: `source/fonts/CourierPrime-Regular.woff2`
- Create: `source/fonts/CourierPrime-Bold.woff2`
- Create: `source/fonts/ArchivoNarrow-Regular.woff2`
- Create: `source/fonts/Archivo-Regular.woff2`
- Create: `source/fonts/Archivo-Bold.woff2`
- Create: `source/fonts/YoungSerif-Regular.woff2`
- Create: `source/fonts/OFL.txt`

- [ ] **Step 1: Download fonts**

All fonts are OFL-licensed and can be bundled. Download each as woff2:

```bash
cd /Users/adrianfeng/coding_workspace/hexo-theme-hermes-agent/source/fonts

# Courier Prime — https://fonts.google.com/specimen/Courier+Prime
curl -L -o CourierPrime-Regular.woff2 "https://fonts.googleapis.com/css2?family=Courier+Prime&display=swap"

# Prefer fetching from the official Google Fonts CSS, then following
# the woff2 URL in the response. If the API-driven fetch is brittle,
# use fontsource:
#   npm pack @fontsource/courier-prime
# and extract the woff2 files from the tarball.
```

Pragmatic approach: use `@fontsource` npm packages to retrieve canonical woff2 files:

```bash
mkdir /tmp/fonts-stage && cd /tmp/fonts-stage
npm pack @fontsource/courier-prime @fontsource/archivo @fontsource/archivo-narrow @fontsource/young-serif
for tgz in *.tgz; do tar xzf "$tgz"; done
# Copy latin woff2 files (weight 400 / 700) into source/fonts/
cp package/files/courier-prime-latin-400-normal.woff2 \
  /Users/adrianfeng/coding_workspace/hexo-theme-hermes-agent/source/fonts/CourierPrime-Regular.woff2
# Repeat for Bold, Archivo, ArchivoNarrow, YoungSerif
```

- [ ] **Step 2: Verify all six files exist and are non-empty**

```bash
ls -lh /Users/adrianfeng/coding_workspace/hexo-theme-hermes-agent/source/fonts/
```

Expected: six woff2 files, each 10–60KB. If any file is missing, re-download from Google Fonts or fontsource.

- [ ] **Step 3: Create `source/fonts/OFL.txt`**

Paste the SIL Open Font License 1.1 text (fetchable from `https://openfontlicense.org/open-font-license-official-text/`). Prepend a header:

```
Fonts bundled with hexo-theme-hermes-agent are licensed under the SIL Open
Font License, Version 1.1. Individual font attributions:

- Courier Prime — Copyright (c) 2013, Quote-Unquote Apps
- Archivo, Archivo Narrow — Copyright (c) Omnibus-Type
- Young Serif — Copyright (c) Hanken Design Co.

Full OFL 1.1 text follows:
```

- [ ] **Step 4: Commit**

```bash
git add source/fonts/
git commit -m "feat(fonts): bundle OFL font files"
```

---

## Task 5: SCSS foundation — variables, reset, main entry

**Files:**
- Create: `source/css/main.scss`
- Create: `source/css/_variables.scss`
- Create: `source/css/_reset.scss`

- [ ] **Step 1: Create `source/css/_variables.scss`**

```scss
// Color tokens — authored in dark-mode values.
// Light mode is achieved by html.light { filter: invert(1); }.
:root {
  --background: #041c1b;
  --surface: #11332f;
  --background-deep: #000203;
  --line: #1a3834;
  --foreground: #f0e0c0;
  --foreground-dim: #b0a090;
  --midground: #384038;
  --accent: #fb2c36;

  // Typography
  --font-display: "Young Serif", Georgia, serif;
  --font-sans-narrow: "Archivo Narrow", system-ui, sans-serif;
  --font-sans: "Archivo", system-ui, sans-serif;
  --font-mono: "Courier Prime", ui-monospace, Menlo, monospace;

  --text-hero: 2.625rem;
  --text-title: 1.5rem;
  --text-h2: 1rem;
  --text-h3: 0.9375rem;
  --text-body: 1rem;
  --text-ui: 0.9375rem;
  --text-meta: 0.75rem;

  --track-ui: 0.1875rem;
  --track-meta: 0.125rem;

  // Spacing
  --s-1: 0.25rem;
  --s-2: 0.5rem;
  --s-3: 0.75rem;
  --s-4: 1rem;
  --s-5: 1.25rem;
  --s-6: 1.5rem;
  --s-8: 2rem;
  --s-10: 2.5rem;
  --s-12: 3rem;

  // Layout
  --content-max: 1200px;
  --toc-width: 220px;
}
```

- [ ] **Step 2: Create `source/css/_reset.scss`**

```scss
*, *::before, *::after { box-sizing: border-box; }

html, body {
  margin: 0;
  padding: 0;
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: var(--font-display);
  font-size: var(--text-body);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  min-height: 100vh;
}

a {
  color: inherit;
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 2px;
}

a:hover { text-decoration-thickness: 2px; }

img, svg, video, canvas { max-width: 100%; display: block; }

button {
  font: inherit;
  color: inherit;
  background: transparent;
  border: 1px solid var(--line);
  cursor: pointer;
}

input, textarea {
  font: inherit;
  color: inherit;
  background: transparent;
  border: 1px solid var(--line);
}
```

- [ ] **Step 3: Create `source/css/main.scss`**

```scss
@use "variables";
@use "reset";
@use "typography";
@use "grid";
@use "effects";
@use "nav";
@use "post";
@use "code";
@use "search";
@use "archive";
@use "theme-light";
@use "responsive";
```

- [ ] **Step 4: Create stub files for not-yet-written partials**

```bash
cd /Users/adrianfeng/coding_workspace/hexo-theme-hermes-agent/source/css
for p in typography grid effects nav post code search archive theme-light responsive; do
  touch "_${p}.scss"
done
```

- [ ] **Step 5: Commit**

```bash
git add source/css/
git commit -m "feat(css): SCSS foundation — variables, reset, entry"
```

---

## Task 6: Typography

**Files:**
- Modify: `source/css/_typography.scss`

- [ ] **Step 1: Write `source/css/_typography.scss`**

```scss
// Font-face declarations
@font-face {
  font-family: "Courier Prime";
  src: url("/fonts/CourierPrime-Regular.woff2") format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: "Courier Prime";
  src: url("/fonts/CourierPrime-Bold.woff2") format("woff2");
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: "Young Serif";
  src: url("/fonts/YoungSerif-Regular.woff2") format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: "Archivo";
  src: url("/fonts/Archivo-Regular.woff2") format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: "Archivo";
  src: url("/fonts/Archivo-Bold.woff2") format("woff2");
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: "Archivo Narrow";
  src: url("/fonts/ArchivoNarrow-Regular.woff2") format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

// Prose content typography (article body)
.post-content {
  font-family: var(--font-display);
  font-size: var(--text-body);
  line-height: 1.75;
  color: var(--foreground);

  h1 {
    font-size: var(--text-title);
    line-height: 1.1;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin: var(--s-6) 0 var(--s-3);
  }

  h2 {
    font-family: var(--font-mono);
    font-size: var(--text-h2);
    text-transform: uppercase;
    letter-spacing: var(--track-ui);
    color: var(--foreground);
    border-left: 2px solid var(--foreground-dim);
    padding-left: var(--s-3);
    margin: var(--s-8) 0 var(--s-4);
  }
  h2::before { content: "## "; opacity: 0.7; }

  h3 {
    font-family: var(--font-mono);
    font-size: var(--text-h3);
    text-transform: uppercase;
    letter-spacing: var(--track-meta);
    color: var(--foreground-dim);
    margin: var(--s-6) 0 var(--s-3);
  }
  h3::before { content: "### "; opacity: 0.7; }

  p { margin: 0 0 var(--s-4); }

  a {
    color: var(--foreground);
    text-decoration: underline;
    text-decoration-color: var(--foreground-dim);
    &:hover { text-decoration-color: var(--foreground); }
  }

  blockquote {
    border-left: 3px solid var(--foreground-dim);
    padding: var(--s-1) var(--s-4);
    margin: var(--s-4) 0;
    color: var(--foreground-dim);
    font-style: italic;
  }

  ul, ol { padding-left: var(--s-6); margin: 0 0 var(--s-4); }
  li { margin-bottom: var(--s-2); }

  code {
    font-family: var(--font-mono);
    font-size: 0.875em;
    background: var(--surface);
    padding: 2px 6px;
    border: 1px solid var(--line);
  }
  pre code { padding: 0; background: transparent; border: none; }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: var(--s-4) 0;
    font-family: var(--font-mono);
    font-size: 0.875rem;
  }
  th, td {
    border: 1px solid var(--line);
    padding: var(--s-2) var(--s-3);
    text-align: left;
  }
  th {
    background: var(--surface);
    text-transform: uppercase;
    letter-spacing: var(--track-meta);
  }

  hr {
    border: none;
    border-top: 1px dashed var(--line);
    margin: var(--s-8) 0;
  }

  figure {
    margin: var(--s-6) 0;
    img { width: 100%; }
    figcaption {
      font-family: var(--font-mono);
      font-size: var(--text-meta);
      text-transform: uppercase;
      letter-spacing: var(--track-meta);
      color: var(--foreground-dim);
      margin-top: var(--s-2);
    }
  }
}
```

- [ ] **Step 2: Visual smoke test** — can't see it render yet until layout skeleton exists. Skip now; re-verify after Task 14.

- [ ] **Step 3: Commit**

```bash
git add source/css/_typography.scss
git commit -m "feat(css): typography — @font-face and prose styles"
```

---

## Task 7: Grid primitives

**Files:**
- Modify: `source/css/_grid.scss`

- [ ] **Step 1: Write `source/css/_grid.scss`**

```scss
// Grid frame: borders separate cells like a newspaper layout.
.g {
  display: grid;
  gap: 0;
  border: 1px solid var(--line);
}

.gc {
  padding: var(--s-4) var(--s-5);
  border-right: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
  &:last-child { border-right: none; }
}

// Remove outer doubled borders using negative margins on children
.g > .gc:nth-last-child(-n+2):nth-child(even) ~ .gc,
.g > .gc:nth-last-child(1) {
  border-bottom: none;
}

// Horizontal strip (single-row grids — nav, meta bars)
.g-row {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(0, 1fr);
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
}
.g-row > * {
  padding: var(--s-3) var(--s-4);
  border-right: 1px solid var(--line);
  &:last-child { border-right: none; }
}

// Content container
.container {
  max-width: var(--content-max);
  margin: 0 auto;
  padding: 0 var(--s-4);
}
```

- [ ] **Step 2: Commit**

```bash
git add source/css/_grid.scss
git commit -m "feat(css): grid primitives (.g, .gc, .g-row, .container)"
```

---

## Task 8: Signature effects

**Files:**
- Modify: `source/css/_effects.scss`

- [ ] **Step 1: Write `source/css/_effects.scss`**

```scss
// Blink — terminal cursor animation
@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
.blink {
  animation: blink 1s step-end infinite;
}

// Cursor — inline |_| that blinks
.cursor {
  display: inline-block;
  width: 0.6ch;
  height: 1em;
  background: currentColor;
  margin-left: 2px;
  vertical-align: baseline;
  animation: blink 1s step-end infinite;
}

// Dither — 2px checker noise
.dither {
  background-image: repeating-conic-gradient(
    currentColor 0% 25%,
    transparent 0% 50%
  );
  background-size: 2px 2px;
}

// Arc-border — animated gradient stroke along edge
@keyframes arc-stroke {
  0%   { background-position: 0% 0%; }
  100% { background-position: 300% 300%; }
}
.arc-border {
  position: relative;
  isolation: isolate;
}
.arc-border::before {
  content: "";
  position: absolute;
  inset: -2px;
  padding: 1.25px;
  border-radius: inherit;
  background: linear-gradient(
    160deg,
    transparent 0%,
    var(--foreground) 15%,
    var(--foreground-dim) 20%,
    var(--background) 25%,
    transparent 35%,
    transparent 65%,
    var(--foreground-dim) 80%,
    var(--foreground) 100%
  );
  background-size: 300% 300%;
  animation: arc-stroke 2.23s linear infinite;
  -webkit-mask:
    linear-gradient(#000 0 0) content-box,
    linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
          mask-composite: exclude;
  pointer-events: none;
  z-index: -1;
  opacity: 0;
  transition: opacity 200ms ease;
}
.arc-border:hover::before { opacity: 1; }

// Bevel — inset double shadow for raised panels
.bevel {
  box-shadow:
    inset -1px -1px 0 0 rgba(0, 0, 0, 0.5),
    inset  1px  1px 0 0 rgba(255, 255, 255, 0.16);
}

// No-invert — cancels outer html.light filter on images, code, KaTeX
.no-invert { filter: invert(1); }

// Honor reduced motion
@media (prefers-reduced-motion: reduce) {
  .blink, .cursor { animation: none; }
  .arc-border::before { animation: none; }
}
```

- [ ] **Step 2: Commit**

```bash
git add source/css/_effects.scss
git commit -m "feat(css): signature effects — blink, dither, arc-border, bevel"
```

---

## Task 9: Layout skeleton

**Files:**
- Create: `layout/layout.ejs`
- Create: `layout/_partial/head.ejs`

- [ ] **Step 1: Write `layout/_partial/head.ejs`**

```ejs
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">

<title><%= page.title ? page.title + ' · ' + config.title : config.title %></title>

<% if (page.description || config.description) { %>
  <meta name="description" content="<%= page.description || config.description %>">
<% } %>

<% if (config.author) { %>
  <meta name="author" content="<%= config.author %>">
<% } %>

<!-- Open Graph -->
<meta property="og:type" content="<%= page.layout === 'post' ? 'article' : 'website' %>">
<meta property="og:title" content="<%= page.title || config.title %>">
<meta property="og:description" content="<%= page.description || config.description || '' %>">
<meta property="og:url" content="<%= config.url %><%- url_for(page.path) %>">
<meta property="og:image" content="<%= config.url %>/images/og-default.png">

<!-- Theme flash guard: set class synchronously before CSS loads -->
<script>
(function(){
  try {
    var pref = localStorage.getItem('hermesTheme');
    var wantLight = pref === 'light' || (!pref && matchMedia('(prefers-color-scheme: light)').matches);
    if (wantLight) document.documentElement.classList.add('light');
  } catch(e) {}
})();
</script>

<link rel="stylesheet" href="<%- url_for('/css/main.css') %>">

<% if (theme.search && theme.search.enable) { %>
  <link rel="preload" href="<%- url_for('/search.json') %>" as="fetch" crossorigin>
<% } %>

<% if (theme.katex && theme.katex.enable && (!theme.katex.per_post || page.math)) { %>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
  <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"></script>
  <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js"
    onload="renderMathInElement(document.body);"></script>
<% } %>

<link rel="alternate" type="application/atom+xml" title="<%= config.title %>" href="<%- url_for('/atom.xml') %>">
```

- [ ] **Step 2: Write `layout/layout.ejs`**

```ejs
<!doctype html>
<html lang="<%= config.language || 'en' %>">
<head>
  <%- partial('_partial/head') %>
</head>
<body>
  <%- partial('_partial/nav') %>

  <main class="container">
    <%- body %>
  </main>

  <%- partial('_partial/footer') %>

  <% if (theme.search && theme.search.enable) { %>
    <%- partial('_partial/search-modal') %>
  <% } %>

  <script type="module" src="<%- url_for('/js/theme-toggle.js') %>"></script>
  <script type="module" src="<%- url_for('/js/code-copy.js') %>"></script>
  <script type="module" src="<%- url_for('/js/toc-highlight.js') %>"></script>
  <script type="module" src="<%- url_for('/js/keyboard.js') %>"></script>
  <% if (theme.search && theme.search.enable) { %>
    <script type="module" src="<%- url_for('/js/search.js') %>"></script>
  <% } %>
</body>
</html>
```

- [ ] **Step 3: Create empty partial stubs (referenced by layout.ejs)**

```bash
cd /Users/adrianfeng/coding_workspace/hexo-theme-hermes-agent/layout/_partial
for p in nav footer search-modal; do
  echo "<!-- ${p}.ejs stub -->" > "${p}.ejs"
done
```

- [ ] **Step 4: Run `hexo g` in fixture**

```bash
cd /Users/adrianfeng/coding_workspace/hexo-theme-hermes-agent/test
hexo clean && hexo g 2>&1 | tail -20
```

Expected: generation succeeds, `public/index.html` contains `<body>...<main class="container">`. If renderer-sass errors on empty partials, comment out their `@use` lines in `main.scss` temporarily.

- [ ] **Step 5: Commit**

```bash
cd /Users/adrianfeng/coding_workspace/hexo-theme-hermes-agent
git add layout/
git commit -m "feat(layout): HTML skeleton with head partial and flash-guard"
```

---

## Task 10: Navigation

**Files:**
- Modify: `layout/_partial/nav.ejs`
- Modify: `source/css/_nav.scss`
- Create: `layout/_partial/theme-toggle.ejs`

- [ ] **Step 1: Write `layout/_partial/theme-toggle.ejs`**

```ejs
<button class="theme-toggle" aria-label="Toggle theme" data-theme-toggle>☾</button>
```

- [ ] **Step 2: Write `layout/_partial/nav.ejs`**

```ejs
<header class="site-nav">
  <a class="site-nav__title" href="<%- url_for('/') %>">
    <% if (theme.site_title) { %>
      <%= theme.site_title.replace(/\n/g, '<br>') %>
    <% } else { %>
      <%= config.title %>
    <% } %>
  </a>

  <nav class="site-nav__links">
    <% (theme.nav || []).forEach(function(item) { %>
      <a href="<%- item.url ? item.url : url_for(item.path) %>"<% if (item.url) { %> target="_blank" rel="noopener"<% } %>>
        <%= item.name %>
      </a>
    <% }); %>
  </nav>

  <div class="site-nav__tools">
    <% if (theme.search && theme.search.enable) { %>
      <button class="site-nav__search" data-search-open aria-label="Search">SEARCH /</button>
    <% } %>
    <%- partial('theme-toggle') %>
  </div>
</header>
```

- [ ] **Step 3: Write `source/css/_nav.scss`**

```scss
.site-nav {
  display: grid;
  grid-template-columns: 200px 1fr auto;
  align-items: stretch;
  border-bottom: 1px solid var(--line);
  font-family: var(--font-mono);
  font-size: var(--text-ui);
  text-transform: uppercase;
  letter-spacing: var(--track-ui);
}

.site-nav__title {
  padding: var(--s-4) var(--s-4);
  border-right: 1px solid var(--line);
  font-family: var(--font-display);
  font-size: 1rem;
  line-height: 1.15;
  text-decoration: none;
  color: var(--foreground);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.site-nav__links {
  display: flex;
}
.site-nav__links a {
  padding: var(--s-4) var(--s-5);
  border-right: 1px solid var(--line);
  text-decoration: none;
  color: var(--foreground);
  display: flex;
  align-items: center;
  transition: background 200ms ease;
}
.site-nav__links a:hover {
  background: var(--surface);
}

.site-nav__tools {
  display: flex;
  align-items: center;
}
.site-nav__tools > * {
  padding: var(--s-4) var(--s-4);
  border-left: 1px solid var(--line);
  border-right: none;
  background: transparent;
  border-top: none;
  border-bottom: none;
  color: var(--foreground);
}
.site-nav__search {
  font-family: var(--font-mono);
  font-size: var(--text-ui);
  letter-spacing: var(--track-ui);
  text-transform: uppercase;
  color: var(--foreground-dim);
}
.site-nav__search:hover { color: var(--foreground); }

.theme-toggle {
  font-size: 1.125rem;
  padding-left: var(--s-5);
  padding-right: var(--s-5);
}
```

- [ ] **Step 4: Run `hexo g` + manual browser check**

```bash
cd /Users/adrianfeng/coding_workspace/hexo-theme-hermes-agent/test
hexo clean && hexo s
```

Visit `http://localhost:4000`. Expected: top navigation bar with site title, links, SEARCH button, and ☾ button. Console should show no errors.

- [ ] **Step 5: Commit**

```bash
cd /Users/adrianfeng/coding_workspace/hexo-theme-hermes-agent
git add layout/_partial/nav.ejs layout/_partial/theme-toggle.ejs source/css/_nav.scss
git commit -m "feat(nav): top navigation + theme toggle button"
```

---

## Task 11: Theme toggle behavior + light mode CSS

**Files:**
- Create: `source/js/theme-toggle.js`
- Modify: `source/css/_theme-light.scss`

- [ ] **Step 1: Write `source/js/theme-toggle.js`**

```js
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
```

- [ ] **Step 2: Write `source/css/_theme-light.scss`**

```scss
html.light {
  filter: invert(1);
}

// .no-invert cancels the outer inversion for elements we want to
// preserve (images, code tokens, KaTeX, inline SVG).
html.light .no-invert,
html.light img:not(.do-invert),
html.light figure:not(.do-invert) img,
html.light .hljs,
html.light .katex,
html.light svg:not(.do-invert) {
  filter: invert(1);
}
```

- [ ] **Step 3: Manual browser check**

Click the ☾ button. Expected: page flips to inverted colors. Reload — preference persists. Images should still look normal (not negative).

- [ ] **Step 4: Commit**

```bash
git add source/js/theme-toggle.js source/css/_theme-light.scss
git commit -m "feat(theme): invert-based light mode with no-invert escape"
```

---

## Task 12: Footer

**Files:**
- Modify: `layout/_partial/footer.ejs`

- [ ] **Step 1: Write `layout/_partial/footer.ejs`**

```ejs
<footer class="site-footer g-row">
  <div class="site-footer__meta">
    <%= config.title %> · v<%= (theme.version || '0.1.0') %>
  </div>
  <div class="site-footer__center">
    © <%= new Date().getFullYear() %> <%= config.author || '' %> · MIT
  </div>
  <div class="site-footer__links">
    <% if (theme.social && theme.social.rss) { %>
      <a href="<%- url_for('/atom.xml') %>">RSS</a>
    <% } %>
    <% if (theme.social && theme.social.github) { %>
      <a href="https://github.com/<%= theme.social.github %>" target="_blank" rel="noopener">GITHUB</a>
    <% } %>
  </div>
</footer>
```

- [ ] **Step 2: Append footer styles to `source/css/_nav.scss`** (same file since both are chrome)

```scss
.site-footer {
  margin-top: var(--s-12);
  font-family: var(--font-mono);
  font-size: var(--text-meta);
  letter-spacing: var(--track-meta);
  text-transform: uppercase;
  color: var(--foreground-dim);
}
.site-footer__center { text-align: center; }
.site-footer__links {
  text-align: right;
  a {
    margin-left: var(--s-4);
    text-decoration: none;
    color: var(--foreground-dim);
    &:hover { color: var(--foreground); }
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add layout/_partial/footer.ejs source/css/_nav.scss
git commit -m "feat(footer): 3-column footer"
```

---

## Task 13: Post meta helper + partial

**Files:**
- Create: `scripts/hermes-helpers.js`
- Create: `layout/_partial/post-meta.ejs`

- [ ] **Step 1: Write `scripts/hermes-helpers.js`**

```js
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
```

- [ ] **Step 2: Write `layout/_partial/post-meta.ejs`**

```ejs
<div class="post-meta">
  <div class="post-meta__cmd"><span class="post-meta__prompt">$</span> <%= post_meta_line(page) %></div>
  <div class="post-meta__stats">
    <%= format_date_ymd(page.date) %>
    <% const w = hermes_word_count(page); %>
    <% const m = hermes_reading_minutes(page); %>
    · <%= __('post.read_time').replace('{n}', m) %>
    · <%= __('post.word_count').replace('{n}', w) %>
    <% if (page.categories && page.categories.length) { %>
      · <% page.categories.each(function(c) { %>[<%= c.name.toUpperCase() %>] <% }); %>
    <% } %>
    <% if (page.tags && page.tags.length) { %>
      <% page.tags.each(function(t) { %>[<%= t.name.toUpperCase() %>] <% }); %>
    <% } %>
  </div>
</div>
```

- [ ] **Step 3: Register `scripts/` with Hexo** — no action needed; Hexo auto-loads anything in `scripts/` of the theme directory.

- [ ] **Step 4: Smoke test** — `hexo g` in fixture. Expected: no errors. Direct verification in browser after Task 14.

- [ ] **Step 5: Commit**

```bash
git add scripts/ layout/_partial/post-meta.ejs
git commit -m "feat(post): meta helper + terminal-style meta partial"
```

---

## Task 14: Post page

**Files:**
- Create: `layout/post.ejs`
- Modify: `source/css/_post.scss`

- [ ] **Step 1: Write `layout/post.ejs`**

```ejs
<article class="post">

  <%- partial('_partial/post-meta', { page: page }) %>

  <h1 class="post__title"><%= page.title %></h1>

  <% if (page.description) { %>
    <p class="post__subtitle">— <%= page.description %></p>
  <% } %>

  <div class="post__layout">
    <div class="post-content">
      <%- page.content %>
    </div>

    <% if (page.toc !== false) { %>
      <aside class="post__toc">
        <%- partial('_partial/toc', { toc: toc(page.content, { list_number: false }) }) %>
      </aside>
    <% } %>
  </div>

  <footer class="post__footer">
    <% if (page.prev) { %>
      <a class="post__nav post__nav--prev bevel" href="<%- url_for(page.prev.path) %>">
        <div class="post__nav-label"><%= __('post.prev') %> ←</div>
        <div class="post__nav-title"><%= page.prev.title %></div>
      </a>
    <% } else { %>
      <div></div>
    <% } %>

    <% if (page.next) { %>
      <a class="post__nav post__nav--next bevel" href="<%- url_for(page.next.path) %>">
        <div class="post__nav-label">→ <%= __('post.next') %></div>
        <div class="post__nav-title"><%= page.next.title %></div>
      </a>
    <% } %>
  </footer>

  <div class="post__eof">
    <span class="post__prompt">$</span> <%= __('post.end_of_file') %><span class="cursor"></span>
  </div>
</article>
```

- [ ] **Step 2: Write `source/css/_post.scss`**

```scss
.post {
  padding: var(--s-8) 0;
}

.post-meta {
  font-family: var(--font-mono);
  font-size: var(--text-meta);
  margin-bottom: var(--s-8);
}
.post-meta__cmd {
  color: var(--foreground);
  margin-bottom: var(--s-2);
}
.post-meta__prompt { color: var(--foreground-dim); margin-right: 4px; }
.post-meta__stats {
  color: var(--foreground-dim);
  letter-spacing: var(--track-meta);
  text-transform: uppercase;
}

.post__title {
  font-family: var(--font-display);
  font-size: var(--text-hero);
  line-height: 1.05;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: 0 0 var(--s-2);
  font-weight: 400;
}

.post__subtitle {
  font-family: var(--font-mono);
  font-size: var(--text-meta);
  letter-spacing: var(--track-meta);
  color: var(--foreground-dim);
  margin: 0 0 var(--s-8);
  text-transform: none;
}

.post__layout {
  display: grid;
  grid-template-columns: 1fr var(--toc-width);
  gap: var(--s-8);
  border-top: 1px solid var(--line);
  padding-top: var(--s-6);
}

.post__toc {
  position: sticky;
  top: var(--s-4);
  align-self: start;
  font-family: var(--font-mono);
  font-size: var(--text-meta);
  letter-spacing: var(--track-meta);
}

.post__footer {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--s-4);
  margin-top: var(--s-10);
  border-top: 1px dashed var(--line);
  padding-top: var(--s-6);
}

.post__nav {
  background: var(--surface);
  padding: var(--s-4) var(--s-5);
  border: 1px solid var(--line);
  text-decoration: none;
  font-family: var(--font-mono);
  font-size: var(--text-meta);
  letter-spacing: var(--track-meta);
  text-transform: uppercase;
  color: var(--foreground);
}
.post__nav--next { text-align: right; }
.post__nav-label {
  color: var(--foreground-dim);
  margin-bottom: var(--s-1);
}
.post__nav-title { font-family: var(--font-display); font-size: var(--text-body); text-transform: uppercase; }

.post__eof {
  margin-top: var(--s-8);
  font-family: var(--font-mono);
  font-size: var(--text-meta);
  color: var(--foreground-dim);
  letter-spacing: var(--track-meta);
}
.post__prompt { color: var(--foreground); }
```

- [ ] **Step 3: Smoke test — fixture post renders**

```bash
cd /Users/adrianfeng/coding_workspace/hexo-theme-hermes-agent/test
hexo clean && hexo s
```

Visit `http://localhost:4000/2026/04/27/sample-tech/`. Expected: title, meta line, two-column layout with content on left and TOC placeholder on right, prev/next links, end-of-file marker with blinking cursor.

- [ ] **Step 4: Commit**

```bash
cd /Users/adrianfeng/coding_workspace/hexo-theme-hermes-agent
git add layout/post.ejs source/css/_post.scss
git commit -m "feat(post): post page layout with meta, TOC, prev/next, EOF marker"
```

---

## Task 15: Code block COPY button

**Files:**
- Modify: `source/js/code-copy.js`
- Modify: `source/css/_code.scss`

The `after_render:html` filter from Task 13 already wraps `<pre>` with markup. Now wire the button and style it.

- [ ] **Step 1: Write `source/js/code-copy.js`**

```js
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
```

- [ ] **Step 2: Write `source/css/_code.scss`**

```scss
.code-block {
  position: relative;
  margin: var(--s-4) 0;
  background: var(--surface);
  border: 1px solid var(--line);
  box-shadow:
    inset -1px -1px 0 0 rgba(0, 0, 0, 0.5),
    inset  1px  1px 0 0 rgba(255, 255, 255, 0.07);
}

.code-block__bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--s-2) var(--s-3);
  border-bottom: 1px dashed var(--line);
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  letter-spacing: var(--track-meta);
  color: var(--foreground-dim);
  text-transform: uppercase;
}

.code-block__copy {
  background: transparent;
  border: none;
  color: var(--foreground-dim);
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  letter-spacing: var(--track-meta);
  cursor: pointer;
  padding: 0;
}
.code-block__copy:hover { color: var(--foreground); }

.code-block pre {
  margin: 0;
  padding: var(--s-3) var(--s-4);
  overflow-x: auto;
  font-family: var(--font-mono);
  font-size: 0.875rem;
  line-height: 1.6;
  color: var(--foreground);
  background: transparent;
  border: none;
}
.code-block pre code { color: inherit; background: transparent; padding: 0; }

// Prism token overrides — low-saturation palette
.token.comment { color: var(--foreground-dim); font-style: italic; }
.token.keyword, .token.selector, .token.important { color: var(--foreground); font-weight: 700; }
.token.string, .token.attr-value { color: var(--foreground-dim); }
.token.function, .token.class-name { color: var(--foreground); }
.token.number, .token.boolean { color: var(--foreground-dim); }
.token.punctuation { color: var(--midground); }
.token.operator { color: var(--foreground); }
```

- [ ] **Step 3: Smoke test — open sample-tech post**

Expected: code blocks have a top bar showing `BASH · COPY`. Click COPY — text copies to clipboard, button reads `COPIED ✓` for 2 seconds.

- [ ] **Step 4: Commit**

```bash
git add source/js/code-copy.js source/css/_code.scss
git commit -m "feat(code): COPY button + Prism token overrides"
```

---

## Task 16: TOC partial + highlight script

**Files:**
- Create: `layout/_partial/toc.ejs`
- Modify: `source/js/toc-highlight.js`

- [ ] **Step 1: Write `layout/_partial/toc.ejs`**

```ejs
<div class="toc" data-toc>
  <div class="toc__label">── <%= __('post.contents') %> ──</div>
  <% if (toc) { %>
    <%- toc %>
  <% } %>
</div>
```

- [ ] **Step 2: Add TOC styling to `source/css/_post.scss`** (append at the end)

```scss
.toc { line-height: 1.9; }
.toc__label {
  color: var(--foreground);
  border-bottom: 1px dashed var(--line);
  padding-bottom: var(--s-2);
  margin-bottom: var(--s-3);
}
.toc ol, .toc ul {
  list-style: none;
  padding-left: 0;
  margin: 0;
}
.toc li { padding-left: var(--s-3); }
.toc li li { padding-left: var(--s-5); }
.toc a {
  display: block;
  text-decoration: none;
  color: var(--midground);
  padding: 2px 0 2px var(--s-2);
  border-left: 2px solid transparent;
  transition: color 200ms, border-color 200ms;
}
.toc a:hover { color: var(--foreground); }
.toc a.is-read { color: var(--foreground-dim); }
.toc a.is-active {
  color: var(--foreground);
  border-left-color: var(--foreground);
}
```

- [ ] **Step 3: Write `source/js/toc-highlight.js`**

```js
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
```

- [ ] **Step 4: Smoke test**

Open `sample-tech` post, scroll. Expected: TOC item highlights as you reach each H2. Above-current items fade to `--foreground-dim`; below-current stay `--midground`.

- [ ] **Step 5: Commit**

```bash
git add layout/_partial/toc.ejs source/js/toc-highlight.js source/css/_post.scss
git commit -m "feat(toc): sticky TOC with scroll-based highlighting"
```

---

## Task 17: Homepage

**Files:**
- Create: `layout/index.ejs`
- Create: `source/css/_home.scss`
- Modify: `source/css/main.scss` (add `@use "home";`)

- [ ] **Step 1: Add `@use "home";` to `source/css/main.scss`** after `@use "post";`

- [ ] **Step 2: Create `source/css/_home.scss`**

```scss
.home {
  padding: var(--s-8) 0;
}

.home__hero {
  text-align: left;
  padding: var(--s-6) 0 var(--s-8);
  border-bottom: 1px solid var(--line);
}
.home__hero-label {
  font-family: var(--font-mono);
  font-size: var(--text-meta);
  letter-spacing: var(--track-ui);
  color: var(--foreground-dim);
  text-transform: uppercase;
  margin-bottom: var(--s-2);
}
.home__hero-title {
  font-family: var(--font-display);
  font-size: var(--text-hero);
  line-height: 1.05;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: 0 0 var(--s-3);
  font-weight: 400;
}
.home__hero-tagline {
  font-family: var(--font-mono);
  font-size: var(--text-meta);
  letter-spacing: var(--track-ui);
  color: var(--foreground-dim);
  text-transform: uppercase;
  margin: 0;
}

.home__featured {
  display: block;
  margin-top: var(--s-6);
  padding: var(--s-6);
  background: var(--surface);
  border: 1px solid var(--line);
  text-decoration: none;
  color: var(--foreground);
}
.home__featured-label {
  font-family: var(--font-mono);
  font-size: var(--text-meta);
  letter-spacing: var(--track-ui);
  color: var(--foreground-dim);
  text-transform: uppercase;
  margin-bottom: var(--s-3);
}
.home__featured-title {
  font-family: var(--font-display);
  font-size: var(--text-title);
  line-height: 1.15;
  margin: 0 0 var(--s-3);
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 400;
}
.home__featured-excerpt {
  font-family: var(--font-display);
  font-size: 0.9375rem;
  color: var(--foreground-dim);
  margin: 0 0 var(--s-3);
  line-height: 1.6;
  text-transform: none;
}
.home__featured-date {
  font-family: var(--font-mono);
  font-size: var(--text-meta);
  letter-spacing: var(--track-meta);
  color: var(--foreground-dim);
  text-transform: uppercase;
}

.home__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  margin-top: var(--s-8);
  border: 1px solid var(--line);
}
.home__grid-item {
  padding: var(--s-5);
  border-right: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
  text-decoration: none;
  color: var(--foreground);
  display: block;
  transition: background 200ms ease;
}
.home__grid-item:hover { background: var(--surface); }
.home__grid-number {
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  letter-spacing: var(--track-meta);
  color: var(--foreground-dim);
  text-transform: uppercase;
}
.home__grid-title {
  font-family: var(--font-display);
  font-size: var(--text-body);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: var(--s-2) 0 var(--s-3);
  line-height: 1.25;
}
.home__grid-date {
  font-family: var(--font-mono);
  font-size: var(--text-meta);
  letter-spacing: var(--track-meta);
  color: var(--foreground-dim);
  text-transform: uppercase;
}
.home__grid-more {
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-mono);
  font-size: var(--text-meta);
  letter-spacing: var(--track-ui);
  color: var(--foreground-dim);
  text-transform: uppercase;
  padding: var(--s-5);
  border-right: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
  text-decoration: none;
}
.home__grid-more:hover { color: var(--foreground); }
```

- [ ] **Step 3: Write `layout/index.ejs`**

```ejs
<section class="home">

  <div class="home__hero">
    <div class="home__hero-label"><%= config.description || '' %></div>
    <h1 class="home__hero-title">
      <% if (theme.site_title) { %><%= theme.site_title %><% } else { %><%= config.title %><% } %>
    </h1>
    <p class="home__hero-tagline"><%= theme.tagline || '' %></p>
  </div>

  <% 
    // Pick featured post
    const mode = theme.featured_post || 'latest';
    let featured = null;
    const posts = site.posts.sort('-date').toArray();
    if (mode === 'front_matter') {
      featured = posts.find(function(p) { return p.featured === true; });
    }
    if (!featured) featured = posts[0];
    const rest = posts.filter(function(p) { return p !== featured; }).slice(0, 5);
  %>

  <% if (featured) { %>
    <a class="home__featured" href="<%- url_for(featured.path) %>">
      <div class="home__featured-label">
        FEATURED
        <% if (featured.categories && featured.categories.length) { %>
          · <% featured.categories.each(function(c){ %>[<%= c.name.toUpperCase() %>] <% }) %>
        <% } %>
      </div>
      <h2 class="home__featured-title"><%= featured.title %></h2>
      <p class="home__featured-excerpt">
        <%- (featured.description || featured.excerpt || '').toString().slice(0, 200) %>
      </p>
      <div class="home__featured-date">
        <%= format_date_ymd(featured.date) %>
        · <%= __('post.read_time').replace('{n}', hermes_reading_minutes(featured)) %>
      </div>
    </a>
  <% } %>

  <div class="home__grid">
    <% rest.forEach(function(p, i) { %>
      <a class="home__grid-item" href="<%- url_for(p.path) %>">
        <div class="home__grid-number"><%= String(i + 2).padStart(3, '0') %></div>
        <div class="home__grid-title"><%= p.title %></div>
        <div class="home__grid-date"><%= format_date_ymd(p.date) %></div>
      </a>
    <% }); %>
    <a class="home__grid-more" href="<%- url_for('/archives/') %>">MORE →</a>
  </div>

</section>
```

- [ ] **Step 4: Smoke test**

Visit `http://localhost:4000/`. Expected: site title hero, featured post card (sample-tech has `featured: true`), 3 post tiles + MORE→ tile.

- [ ] **Step 5: Commit**

```bash
git add layout/index.ejs source/css/_home.scss source/css/main.scss
git commit -m "feat(home): layout C — mini hero + featured + grid"
```

---

## Task 18: Archive page

**Files:**
- Create: `layout/archive.ejs`
- Modify: `source/css/_archive.scss`

- [ ] **Step 1: Write `source/css/_archive.scss`**

```scss
.archive {
  padding: var(--s-8) 0;
}

.archive__year {
  font-family: var(--font-mono);
  font-size: var(--text-h2);
  letter-spacing: var(--track-ui);
  text-transform: uppercase;
  color: var(--foreground);
  border-left: 2px solid var(--foreground-dim);
  padding-left: var(--s-3);
  margin: var(--s-8) 0 var(--s-4);
}
.archive__year::before { content: "## "; opacity: 0.7; }

.archive__list {
  list-style: none;
  padding: 0;
  margin: 0;
  border-top: 1px solid var(--line);
}

.archive__item {
  display: flex;
  align-items: baseline;
  gap: var(--s-3);
  padding: var(--s-3) 0;
  border-bottom: 1px dashed var(--line);
  font-family: var(--font-mono);
  font-size: var(--text-meta);
  letter-spacing: var(--track-meta);
  text-transform: uppercase;
}
.archive__date { color: var(--foreground-dim); flex-shrink: 0; }
.archive__title {
  color: var(--foreground);
  text-decoration: none;
  font-family: var(--font-display);
  font-size: 1rem;
  letter-spacing: 1px;
  flex: 1;
  text-transform: uppercase;
}
.archive__title:hover { color: var(--foreground-dim); }
.archive__tag { color: var(--foreground-dim); }

.archive__total {
  margin-top: var(--s-8);
  padding-top: var(--s-4);
  border-top: 1px solid var(--line);
  font-family: var(--font-mono);
  font-size: var(--text-meta);
  letter-spacing: var(--track-ui);
  color: var(--foreground-dim);
  text-transform: uppercase;
  text-align: center;
}
```

- [ ] **Step 2: Write `layout/archive.ejs`**

```ejs
<section class="archive">

  <%
    const byYear = {};
    const allPosts = site.posts.sort('-date').toArray();
    allPosts.forEach(function(p) {
      const y = new Date(p.date).getFullYear();
      (byYear[y] = byYear[y] || []).push(p);
    });
    const years = Object.keys(byYear).sort(function(a, b) { return b - a; });
  %>

  <% years.forEach(function(y) { %>
    <h2 class="archive__year"><%= y %> · <%= __('archive.year_posts').replace('{n}', byYear[y].length) %></h2>
    <ul class="archive__list">
      <% byYear[y].forEach(function(p) { %>
        <li class="archive__item">
          <span class="archive__date"><%= format_date_ymd(p.date) %></span>
          <a class="archive__title" href="<%- url_for(p.path) %>"><%= p.title %></a>
          <span class="archive__tag">
            <% if (p.tags && p.tags.length) { %>
              <% p.tags.each(function(t) { %>[<%= t.name.toUpperCase() %>] <% }); %>
            <% } %>
          </span>
        </li>
      <% }); %>
    </ul>
  <% }); %>

  <div class="archive__total">
    <%= __('archive.total').replace('{posts}', allPosts.length).replace('{years}', years.length) %>
  </div>
</section>
```

- [ ] **Step 3: Smoke test**

Visit `http://localhost:4000/archives/`. Expected: year grouping with `## 2026 · N POSTS` headings, each post listed with date + title + tag chips.

- [ ] **Step 4: Commit**

```bash
git add layout/archive.ejs source/css/_archive.scss
git commit -m "feat(archive): year-grouped archive listing"
```

---

## Task 19: Category and Tag pages

**Files:**
- Create: `layout/category.ejs`
- Create: `layout/tag.ejs`

- [ ] **Step 1: Write `layout/category.ejs`**

```ejs
<section class="archive">
  <%
    // If rendering a specific category page, page.category is set.
    // If rendering the "/categories/" index, iterate site.categories.
    const isIndex = !page.category;
  %>

  <% if (isIndex) { %>
    <h2 class="archive__year"><%= __('nav.categories') %></h2>
    <div class="tag-cloud">
      <% site.categories.sort('-length').each(function(cat) { %>
        <a class="tag-chip" href="<%- url_for(cat.path) %>">
          <%= cat.name.toUpperCase() %>(<%= cat.length %>)
        </a>
      <% }); %>
    </div>
  <% } else { %>
    <h2 class="archive__year"><%= page.category.toUpperCase() %> · <%= __('archive.year_posts').replace('{n}', page.posts.length) %></h2>
    <ul class="archive__list">
      <% page.posts.each(function(p) { %>
        <li class="archive__item">
          <span class="archive__date"><%= format_date_ymd(p.date) %></span>
          <a class="archive__title" href="<%- url_for(p.path) %>"><%= p.title %></a>
          <span class="archive__tag">
            <% if (p.tags && p.tags.length) { %>
              <% p.tags.each(function(t) { %>[<%= t.name.toUpperCase() %>] <% }); %>
            <% } %>
          </span>
        </li>
      <% }); %>
    </ul>
  <% } %>
</section>
```

- [ ] **Step 2: Write `layout/tag.ejs`** (identical shape, tag-scoped)

```ejs
<section class="archive">
  <% const isIndex = !page.tag; %>

  <% if (isIndex) { %>
    <h2 class="archive__year"><%= __('nav.tags') %></h2>
    <div class="tag-cloud">
      <% site.tags.sort('-length').each(function(t) { %>
        <a class="tag-chip" href="<%- url_for(t.path) %>">
          <%= t.name.toUpperCase() %>(<%= t.length %>)
        </a>
      <% }); %>
    </div>
  <% } else { %>
    <h2 class="archive__year"><%= page.tag.toUpperCase() %> · <%= __('archive.year_posts').replace('{n}', page.posts.length) %></h2>
    <ul class="archive__list">
      <% page.posts.each(function(p) { %>
        <li class="archive__item">
          <span class="archive__date"><%= format_date_ymd(p.date) %></span>
          <a class="archive__title" href="<%- url_for(p.path) %>"><%= p.title %></a>
        </li>
      <% }); %>
    </ul>
  <% } %>
</section>
```

- [ ] **Step 3: Append tag-cloud styles to `source/css/_archive.scss`**

```scss
.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: var(--s-2);
  padding: var(--s-4) 0;
}
.tag-chip {
  font-family: var(--font-mono);
  font-size: var(--text-meta);
  letter-spacing: var(--track-meta);
  text-transform: uppercase;
  color: var(--foreground);
  text-decoration: none;
  padding: var(--s-2) var(--s-3);
  border: 1px solid var(--line);
  background: var(--surface);
  transition: background 200ms, color 200ms;
}
.tag-chip:hover {
  background: var(--foreground-dim);
  color: var(--background);
}
```

- [ ] **Step 4: Smoke test**

Visit `/categories/`, `/tags/`, then click into a single tag like `/tags/tech/`. Expected: cloud view + filtered list view both work.

- [ ] **Step 5: Commit**

```bash
git add layout/category.ejs layout/tag.ejs source/css/_archive.scss
git commit -m "feat(archive): category and tag pages + tag cloud"
```

---

## Task 20: About page + generic page layout

**Files:**
- Create: `layout/page.ejs`
- Create: `layout/about.ejs`

Hexo resolves `layout: <name>` in front-matter by loading `layout/<name>.ejs`. When the fixture's `about/index.md` has `layout: about`, Hexo will render it through `layout/about.ejs`. `layout/page.ejs` handles everything else (`layout: page` or default pages).

- [ ] **Step 1: Write `layout/page.ejs`** (generic custom page)

```ejs
<article class="page post">
  <h1 class="post__title"><%= page.title %></h1>
  <div class="post-content"><%- page.content %></div>
</article>
```

- [ ] **Step 2: Write `layout/about.ejs`**

```ejs
<section class="about">
  <div class="g about__grid">
    <%
      // Split rendered HTML on H2 headings, put each section in a grid cell
      const html = page.content || '';
      const sections = html.split(/(<h2[^>]*>[\s\S]*?<\/h2>)/);
      const cells = [];
      let current = null;
      sections.forEach(function(chunk) {
        if (/^<h2/.test(chunk)) {
          if (current) cells.push(current);
          current = { heading: chunk, body: '' };
        } else if (current) {
          current.body += chunk;
        }
      });
      if (current) cells.push(current);
    %>

    <% cells.forEach(function(cell) { %>
      <div class="gc about__cell">
        <div class="about__heading post-content"><%- cell.heading %></div>
        <div class="about__body post-content"><%- cell.body %></div>
      </div>
    <% }); %>
  </div>
</section>
```

- [ ] **Step 2: Append about styles to `source/css/_post.scss`**

```scss
.about {
  padding: var(--s-8) 0;
}
.about__grid {
  grid-template-columns: repeat(2, 1fr);
}
.about__cell {
  padding: var(--s-5);
  min-height: 180px;
}
.about__heading h2 {
  font-family: var(--font-mono);
  font-size: var(--text-h3);
  border-left: none;
  padding-left: 0;
  margin: 0 0 var(--s-3);
}
.about__heading h2::before { content: ""; }
.about__body { font-size: 0.9375rem; }
```

- [ ] **Step 3: Smoke test**

Visit `/about/`. Expected: 2-column grid with each `$ whoami`, `$ ls ~/projects`, `$ cat /etc/contact` section in its own cell.

- [ ] **Step 4: Commit**

```bash
git add layout/page.ejs layout/about.ejs source/css/_post.scss
git commit -m "feat(page): about page with grid-cell per H2 section"
```

---

## Task 21: 404 page

**Files:**
- Create: `layout/404.ejs`
- Create: `source/404.md` (stub that Hexo will render with the 404 layout)
- Append CSS to `source/css/_post.scss`

- [ ] **Step 1: Create `source/404.md`**

Hexo will render this through the layout system. Set the front-matter to use the `404` layout.

```markdown
---
title: "404"
layout: "404"
---
```

- [ ] **Step 2: Write `layout/404.ejs`**

```ejs
<section class="fourohfour">
  <div class="fourohfour__screen">
    <div class="fourohfour__line">
      <span class="fourohfour__prompt">$</span>
      cat posts<span data-404-path>%PATH%</span>
    </div>
    <div class="fourohfour__line fourohfour__error">
      <%= __('error.not_found_title') %>
    </div>
    <div class="fourohfour__line fourohfour__hint">
      → <%= __('error.not_found_hint') %>
    </div>
    <div class="fourohfour__cursor"><span class="cursor"></span></div>
  </div>
</section>

<script>
  var p = document.querySelector('[data-404-path]');
  if (p) p.textContent = location.pathname;
</script>
```

- [ ] **Step 3: Append 404 styles to `source/css/_post.scss`**

```scss
.fourohfour {
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--s-8);
}
.fourohfour__screen {
  font-family: var(--font-mono);
  font-size: 1rem;
  line-height: 1.9;
  letter-spacing: var(--track-meta);
  text-transform: uppercase;
  color: var(--foreground);
  max-width: 560px;
  width: 100%;
}
.fourohfour__prompt { color: var(--foreground-dim); margin-right: 4px; }
.fourohfour__error { color: var(--accent); margin-top: var(--s-4); }
.fourohfour__hint { color: var(--foreground-dim); }
.fourohfour__cursor {
  margin-top: var(--s-6);
  font-size: 2.5rem;
  line-height: 1;
}
.fourohfour__cursor .cursor {
  width: 0.8ch;
  height: 1em;
}
```

- [ ] **Step 4: Smoke test**

Visit `http://localhost:4000/404.html`. Expected: centered terminal layout with red ERROR line, dim hint line, and a large blinking cursor.

- [ ] **Step 5: Commit**

```bash
git add layout/404.ejs source/404.md source/css/_post.scss
git commit -m "feat(404): terminal-style 404 page"
```

---

## Task 22: Search — modal + client-side filter

**Files:**
- Modify: `layout/_partial/search-modal.ejs`
- Modify: `source/js/search.js`
- Modify: `source/css/_search.scss`

The fixture blog already has `hexo-generator-search` installed (Task 2). Add config to the theme's `_config.yml` documentation noting site authors must include the generator in their own Hexo site deps (document in README).

- [ ] **Step 1: Write `layout/_partial/search-modal.ejs`**

```ejs
<dialog class="search-modal" data-search-modal>
  <form class="search-modal__form" data-search-form>
    <span class="search-modal__prompt">$</span>
    <input
      type="search"
      class="search-modal__input"
      data-search-input
      placeholder="<%= __('search.placeholder') %>"
      autocomplete="off"
      spellcheck="false"
    />
    <span class="cursor search-modal__cursor"></span>
    <button type="button" class="search-modal__close" data-search-close aria-label="Close">ESC</button>
  </form>
  <div class="search-modal__results" data-search-results></div>
</dialog>
```

- [ ] **Step 2: Write `source/js/search.js`**

```js
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
```

- [ ] **Step 3: Write `source/css/_search.scss`**

```scss
.search-modal {
  width: min(60vw, 720px);
  max-width: 92vw;
  padding: 0;
  background: var(--surface);
  color: var(--foreground);
  border: 1px solid var(--line);
  box-shadow:
    inset -1px -1px 0 0 rgba(0,0,0,0.5),
    inset  1px  1px 0 0 rgba(255,255,255,0.16),
    0 40px 80px rgba(0,0,0,0.5);
}
.search-modal::backdrop {
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(2px);
}

.search-modal__form {
  display: flex;
  align-items: center;
  padding: var(--s-4) var(--s-5);
  border-bottom: 1px solid var(--line);
  font-family: var(--font-mono);
  gap: var(--s-2);
}
.search-modal__prompt { color: var(--foreground-dim); }
.search-modal__input {
  flex: 1;
  border: none;
  background: transparent;
  color: var(--foreground);
  font-family: var(--font-mono);
  font-size: var(--text-body);
  outline: none;
  padding: 0;
}
.search-modal__cursor { vertical-align: -2px; }
.search-modal__close {
  font-family: var(--font-mono);
  font-size: var(--text-meta);
  letter-spacing: var(--track-meta);
  color: var(--foreground-dim);
  background: transparent;
  border: 1px solid var(--line);
  padding: 2px 8px;
  text-transform: uppercase;
}

.search-modal__results {
  max-height: 60vh;
  overflow-y: auto;
}
.search-modal__item {
  display: block;
  padding: var(--s-4) var(--s-5);
  border-bottom: 1px dashed var(--line);
  text-decoration: none;
  color: var(--foreground);
}
.search-modal__item.is-active { background: rgba(240, 224, 192, 0.05); }
.search-modal__title {
  font-family: var(--font-display);
  font-size: var(--text-body);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: var(--s-1);
}
.search-modal__snippet {
  font-family: var(--font-mono);
  font-size: var(--text-meta);
  color: var(--foreground-dim);
  line-height: 1.6;
}
.search-modal mark {
  background: transparent;
  color: var(--foreground);
  font-weight: 700;
  text-decoration: underline;
  text-decoration-thickness: 1px;
}
.search-modal__empty {
  padding: var(--s-6) var(--s-5);
  font-family: var(--font-mono);
  font-size: var(--text-meta);
  color: var(--foreground-dim);
  text-align: center;
  letter-spacing: var(--track-meta);
  text-transform: uppercase;
}
```

- [ ] **Step 4: Smoke test**

Click SEARCH in the nav. Expected: modal opens centered. Type a query. Expected: matching posts appear. `Esc` closes. `↑/↓` selects. `Enter` navigates.

- [ ] **Step 5: Commit**

```bash
git add layout/_partial/search-modal.ejs source/js/search.js source/css/_search.scss
git commit -m "feat(search): client-side search modal with keyboard nav"
```

---

## Task 23: Keyboard shortcuts

**Files:**
- Modify: `source/js/keyboard.js`

- [ ] **Step 1: Write `source/js/keyboard.js`**

```js
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
```

- [ ] **Step 2: Smoke test**

- `/` opens search (already worked, re-verify)
- `t` toggles theme
- `g` then `h` navigates home
- `g` then `a` navigates to archives
- Typing into search input does NOT trigger any shortcut

- [ ] **Step 3: Commit**

```bash
git add source/js/keyboard.js
git commit -m "feat(keyboard): / t g-chord shortcuts"
```

---

## Task 24: Responsive breakpoints

**Files:**
- Modify: `source/css/_responsive.scss`

- [ ] **Step 1: Write `source/css/_responsive.scss`**

```scss
// Tablet: <=1199
@media (max-width: 1199px) {
  :root { --toc-width: 0px; }
  .post__layout { grid-template-columns: 1fr; }
  .post__toc {
    position: static;
    margin-bottom: var(--s-6);
    max-width: 100%;
  }

  .home__grid { grid-template-columns: repeat(2, 1fr); }

  .site-nav { grid-template-columns: 160px 1fr auto; }
}

// Mobile: <=767
@media (max-width: 767px) {
  :root {
    --content-max: 100%;
    --text-hero: 2rem;
    --text-title: 1.25rem;
  }

  .container { padding: 0 var(--s-3); }

  .site-nav {
    grid-template-columns: 1fr auto;
  }
  .site-nav__title { font-size: 0.875rem; padding: var(--s-3); }
  .site-nav__links {
    display: none; // replaced by drawer, opened via a hamburger
  }

  .home__grid { grid-template-columns: 1fr; }

  .post__footer { grid-template-columns: 1fr; }

  .post-content h1, .post__title {
    letter-spacing: 0.5px;
  }

  .search-modal {
    width: 94vw;
  }

  .about__grid { grid-template-columns: 1fr; }
}

// Narrow labels — tighten tracking
@media (max-width: 479px) {
  :root {
    --track-ui: 0.075rem;
    --track-meta: 0.05rem;
  }
}
```

- [ ] **Step 2: Add hamburger menu to `layout/_partial/nav.ejs`**

Replace the nav top with a markup that includes a hamburger button visible only on mobile. Edit the `.site-nav__links` section to add a `.is-open` toggle class, and add:

```ejs
<!-- Insert at the end of <header class="site-nav"> -->
<button class="site-nav__hamburger" data-nav-toggle aria-label="Menu">≡</button>
```

And append to `source/css/_nav.scss`:

```scss
.site-nav__hamburger {
  display: none;
  padding: var(--s-3);
  font-size: 1.25rem;
  background: transparent;
  border: none;
  border-left: 1px solid var(--line);
  color: var(--foreground);
}

@media (max-width: 767px) {
  .site-nav__hamburger { display: block; }
  .site-nav__links.is-open {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: var(--background);
    border-bottom: 1px solid var(--line);
    z-index: 10;
  }
  .site-nav__links.is-open a {
    border-right: none;
    border-bottom: 1px solid var(--line);
  }
}
```

- [ ] **Step 3: Wire hamburger toggle — add to `source/js/theme-toggle.js`** (keep in same file — both are nav-adjacent)

```js
document.addEventListener('click', (e) => {
  const ham = e.target.closest('[data-nav-toggle]');
  if (!ham) return;
  const links = document.querySelector('.site-nav__links');
  if (links) links.classList.toggle('is-open');
});
```

- [ ] **Step 4: Smoke test at 3 viewport widths**

Use browser devtools device emulation:
- 1400px: 3-col grid, TOC visible on right of post
- 900px: 2-col grid, TOC above post content
- 400px: 1-col grid, hamburger visible, tapping it opens nav drawer

- [ ] **Step 5: Commit**

```bash
git add source/css/_responsive.scss source/css/_nav.scss layout/_partial/nav.ejs source/js/theme-toggle.js
git commit -m "feat(responsive): tablet + mobile breakpoints, hamburger drawer"
```

---

## Task 25: KaTeX opt-in integration

**Files:**
- Modify: `_config.yml` (theme defaults)

The KaTeX loader was added to `head.ejs` in Task 9 with per-post gating (`theme.katex.enable && (!theme.katex.per_post || page.math)`). Enabling KaTeX for the fixture blog is a one-line config change.

- [ ] **Step 1: Flip `katex.enable` to `true` in the theme's `_config.yml`**

Edit `_config.yml` (the file at the repo root, created in Task 3):

```yaml
katex:
  enable: true
  per_post: true
```

Hexo reads theme config from the theme's own `_config.yml`; site authors can override this in their site's `_config.yml` using the standard `theme_config:` key (Hexo 5+) or by editing the theme file directly.

- [ ] **Step 2: Verify**

```bash
cd /Users/adrianfeng/coding_workspace/hexo-theme-hermes-agent/test
hexo clean && hexo s
```

Open `http://localhost:4000/2026/04/21/sample-ai/`. Expected: inline math renders (`P = ...`), display math block is centered. Open a post without `math:` front-matter (e.g. `sample-tech`) and inspect the `<head>` — expected: no KaTeX CDN link tags.

- [ ] **Step 3: Ensure light mode doesn't negate KaTeX** — `.katex` is already listed in the `.no-invert` escape from Task 11. Click theme toggle, confirm equations stay readable.

- [ ] **Step 4: Commit**

```bash
git add _config.yml
git commit -m "feat(katex): opt-in KaTeX rendering for posts with math:true"
```

---

## Task 26: README and docs polish

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Rewrite `README.md` with usage instructions**

Include the following sections (write each as real content, not outlines):

1. **Banner / one-line description**
2. **Screenshots** — two images: `docs/screenshot-dark.png`, `docs/screenshot-light.png` (take them from fixture blog after the plan is executed; placeholder references for now)
3. **Features** — bullet list: deep-teal palette, invert-based theme toggle, terminal meta chrome, grid frame, TOC with scroll highlight, `/`-triggered search, code COPY button, `g`-chord navigation, KaTeX opt-in, zh-CN + English i18n
4. **Install**:

   ```bash
   cd your-hexo-blog
   git clone https://github.com/<you>/hexo-theme-hermes-agent themes/hermes-agent
   npm install hexo-renderer-ejs hexo-renderer-sass-next hexo-generator-search
   ```

   Then set `theme: hermes-agent` in the site `_config.yml`.

5. **Configuration** — reproduce the `_config.yml` keys from Task 3, with a one-line description per key
6. **Customizing fonts** — how to drop a Mondwest woff2 into `source/fonts/` and override the `@font-face`
7. **Front-matter supported** — `description`, `featured`, `math`, `toc: false`, `layout: about`
8. **Keyboard shortcuts** — `/`, `t`, `g h`, `g a`, `g t`
9. **Browser support** — latest two versions of Chromium, Firefox, Safari
10. **License** — MIT (theme) + OFL (bundled fonts, see `source/fonts/OFL.txt`)
11. **Credits** — "Visual language inspired by the [Nous Research Hermes Agent site](https://hermes-agent.nousresearch.com/). Not affiliated with Nous Research."

- [ ] **Step 2: Take screenshots from fixture blog**

```bash
cd /Users/adrianfeng/coding_workspace/hexo-theme-hermes-agent/test
hexo clean && hexo s &
SERVER_PID=$!
sleep 3

mkdir -p ../docs

"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless --disable-gpu --no-sandbox \
  --hide-scrollbars --window-size=1400,1800 \
  --screenshot=../docs/screenshot-dark.png \
  http://localhost:4000/

# For light, inject the class via cookie or navigate with a ?theme=light hash hack
# Easiest: screenshot then manually click toggle and re-screenshot. For
# automation, use a small devtools script:
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless --disable-gpu --no-sandbox \
  --hide-scrollbars --window-size=1400,1800 \
  --virtual-time-budget=3000 \
  --screenshot=../docs/screenshot-light.png \
  "http://localhost:4000/?forceTheme=light"

kill $SERVER_PID
```

Note: if the forceTheme URL parameter is not supported, add a one-line conditional to the inline flash-guard script in `head.ejs` that checks `?forceTheme=light|dark` first, then localStorage, then system. This is acceptable behavior for power users and simplifies screenshot automation.

- [ ] **Step 3: Commit**

```bash
git add README.md docs/screenshot-*.png layout/_partial/head.ejs
git commit -m "docs(readme): user guide, screenshots, credits"
```

---

## Task 27: Full checklist walkthrough + release tag

**Files:**
- None to create

This task is the final gate. Run the full manual checklist from the spec (§12.2) against the fixture blog.

- [ ] **Step 1: Clean build from scratch**

```bash
cd /Users/adrianfeng/coding_workspace/hexo-theme-hermes-agent/test
rm -rf node_modules public db.json
npm install
hexo clean && hexo g && hexo s
```

Expected: no errors. Server up on port 4000.

- [ ] **Step 2: Walk the checklist**

In a browser (test both a Chromium and a Firefox) visit each URL and verify the expected behavior. Mark each item as done or file a bug:

- [ ] Home (`/`): featured post card renders; 5 recent posts in grid; MORE → last tile links to archives
- [ ] Post (`/2026/04/27/sample-tech/`): terminal meta line `$ cat posts/sample-tech.md`, date + minutes + words + tags; title in uppercase serif; subtitle line in mono; TOC on right; code blocks have COPY button that works; blockquote has left border + italic; prev/next buttons at bottom; end-of-file `$ end of file_` with blinking cursor
- [ ] Post TOC scrolls and highlights — above-current items dim, current item amber-bordered, below-current items further dim
- [ ] Archive (`/archives/`): year grouped, dates + titles + tag chips, TOTAL line at bottom
- [ ] Tags index (`/tags/`): cloud view
- [ ] Single tag (`/tags/tech/`): filtered list view
- [ ] Categories index (`/categories/`): cloud view
- [ ] Single category (`/categories/tech/`): filtered list view
- [ ] About (`/about/`): grid cells per shell-command heading
- [ ] 404 (`/no-such-page`): terminal layout with red ERROR, dim hint, large blink cursor
- [ ] Theme toggle: click ☾ flips colors; reload preserves preference; no flash on reload
- [ ] In light mode: images stay normal (not negative); KaTeX readable; code tokens readable
- [ ] Search (`/` key or SEARCH button): modal opens; input has blinking cursor; typing filters results; matches highlighted; `↑/↓` navigates; `Enter` jumps; `Esc` closes
- [ ] Keyboard: `t` toggles theme; `g h` goes home; `g a` goes archives; `g t` goes tags; none fire while typing in search
- [ ] Mobile (devtools iPhone emulation): hamburger button visible; tapping opens drawer; TOC collapses above article; home grid single-column
- [ ] RSS (`/atom.xml`): loads and validates as XML
- [ ] Prose readability: no uppercase in article body; Young Serif renders
- [ ] Console: no JS errors on any page
- [ ] Network: no 404s for assets

- [ ] **Step 3: Tag v0.1.0 release**

```bash
cd /Users/adrianfeng/coding_workspace/hexo-theme-hermes-agent
git tag -a v0.1.0 -m "v0.1.0: initial release"
# Don't push until user confirms — destructive to publicize
```

- [ ] **Step 4: Final commit message for any fixes found during checklist**

If any issues found, fix them in situ and commit with `fix(<area>): ...` messages before tagging.

---

## Summary

This plan builds a Hexo theme in 27 incremental tasks. Each task ends with a working, committable state verified against the `test/` fixture blog. The plan avoids traditional unit tests because the deliverable is visual — instead each task has explicit smoke-test steps that require a human (or a vision-capable agent) to eyeball the fixture blog output.

Estimated execution: 4–6 hours for a focused implementer who verifies each task before moving on.
