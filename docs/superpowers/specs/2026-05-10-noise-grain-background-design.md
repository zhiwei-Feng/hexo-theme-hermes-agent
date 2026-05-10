# CSS Noise Grain Background

**Date:** 2026-05-10  
**Status:** Approved

## Problem

The theme background is a flat solid color (`--background: #041c1b`). The source site (hermes-agent.nousresearch.com) uses a fixed background image that subtly decorates the visual layer beneath all content, giving the page depth and texture.

## Solution

Add a CSS-only SVG `feTurbulence` noise layer to the `body` background. No image files required, no new dependencies.

## Implementation

**File:** `source/css/_reset.scss`

Replace the single `background` shorthand on `body` with a multi-layer background:

```scss
body {
  background-color: var(--background);
  background-image: url("data:image/svg+xml,...feTurbulence...");
  background-size: 200px 200px;
  background-attachment: fixed;
  // all other existing properties unchanged
}
```

**SVG noise parameters:**
- `type="fractalNoise"` — organic grain (vs `turbulence` which is more cloud-like)
- `baseFrequency="0.68"` — fine grain scale
- `numOctaves="4"` — multi-scale detail
- `stitchTiles="stitch"` — seamless tiling at 200×200 tile boundary
- `feColorMatrix type="saturate" values="0"` — desaturate to pure gray noise
- `rect opacity="0.09"` — 9% opacity, barely perceptible on dark background

## Behavior

- **Scrolling:** `background-attachment: fixed` keeps noise fixed to viewport, does not scroll with content (matches source site behavior)
- **Light mode:** `html.light { filter: invert(1) }` inverts the entire page including body background; noise becomes dark grain on light background — remains visually coherent, no extra handling needed
- **iOS Safari:** `background-attachment: fixed` degrades to `scroll` on iOS; noise tiles correctly but scrolls with page content — acceptable limitation

## Scope

Single file change: `source/css/_reset.scss`. No new SCSS partials, no config knobs, no JS.
