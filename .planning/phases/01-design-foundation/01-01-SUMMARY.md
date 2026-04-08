---
phase: 01-design-foundation
plan: 01
subsystem: design-tokens
tags: [tailwind, fonts, design-system, wcag, animation]
dependency_graph:
  requires: []
  provides:
    - eden.* 10-token color palette in tailwind.config.ts
    - Outfit font loading via next/font/google (--font-outfit CSS variable)
    - tailwindcss-motion plugin registration
    - Updated globals.css base layer (new tokens, focus ring, select arrow)
  affects:
    - All components (token name changes cause intentional visual breakage until Phase 2)
tech_stack:
  added:
    - tailwindcss-motion@1.1.1 (devDependency)
    - Outfit font via next/font/google (self-hosted at build time)
  patterns:
    - Two-layer semantic token system (eden.* namespace)
    - CSS variable injection via next/font variable mode (--font-outfit)
    - require() for Tailwind plugins to ensure CJS resolution with Tailwind v3
key_files:
  created: []
  modified:
    - tailwind.config.ts
    - app/layout.tsx
    - app/globals.css
    - package.json
    - package-lock.json
decisions:
  - "Used require() instead of ESM import for tailwindcss-motion to fix Tailwind v3 + webpack compatibility"
  - "Accepted temporary visual breakage in components (old token names) — Phase 2 migrates component references"
  - "Used #716A65 for eden.text-muted (not #78716C from initial stack research) — WCAG-corrected value passes 4.80:1 on eden.card"
metrics:
  duration: "211 minutes"
  completed_date: "2026-04-09"
  tasks_completed: 3
  tasks_total: 3
  files_changed: 5
---

# Phase 01 Plan 01: Design Token Foundation Summary

**One-liner:** New 10-token eden.* color palette with WCAG-verified hex values, Outfit font via next/font/google CSS variable injection, and tailwindcss-motion plugin — all in tailwind.config.ts, app/layout.tsx, and app/globals.css.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Install tailwindcss-motion and write new tailwind.config.ts | fd5851f | tailwind.config.ts, package.json, package-lock.json |
| 2 | Replace font loading in layout.tsx with Outfit | e073ce5 | app/layout.tsx |
| 3 | Update globals.css base layer and focus ring | d977f52 | app/globals.css, tailwind.config.ts |

## What Was Built

### New Design Token System (tailwind.config.ts)

10 semantic tokens in the `eden.*` namespace:

| Token | Value | Role |
|-------|-------|------|
| eden.ink | #1C1917 | Dark surfaces — header, footer, hero overlays |
| eden.surface | #FAFAF8 | Page body background |
| eden.card | #F5F3EF | Card backgrounds |
| eden.gold | #C5A47E | Decorative accent — borders, dividers, icons (NOT text on light) |
| eden.gold-deep | #A8865C | Hover states on gold UI elements |
| eden.gold-light | #E8D5B7 | Subtle tints on dark sections |
| eden.text | #1C1917 | Primary text on light (16.73:1 on surface) |
| eden.text-muted | #716A65 | Secondary text on light (4.80:1 on card — WCAG AA) |
| eden.white | #FFFFFF | Primary text on dark (17.49:1 on ink) |
| eden.border | #E7E0D8 | Default borders on light surfaces |

Additional tokens: letterSpacing (label, luxury, wide), boxShadow (luxury, luxury-hover).

### Font System (app/layout.tsx)

- Outfit loaded via `next/font/google` with weights 300/400/500/600
- CSS variable `--font-outfit` injected on `<html>` element
- Tailwind fontFamily.sans references `var(--font-outfit)` — identical variable name in both files
- Playfair Display and DM Sans completely removed

### globals.css Updates

- Body class: `bg-eden-surface text-eden-text` (was `bg-eden-bg text-eden-cream`)
- h1–h5 `font-serif` rule deleted (prevents Georgia fallback)
- Selection rule: `text-eden-ink` (was `text-eden-bg`)
- Focus ring: `theme('colors.eden.gold')` replaces hardcoded `#C9A84C`
- Select arrow SVG: `%23716A65` replaces `%239E9289`
- All keyframe animations, utilities, and reduced-motion rules preserved

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] tailwindcss-motion ESM incompatibility with Tailwind v3 + webpack**

- **Found during:** Task 3 verification (npm run build)
- **Issue:** `tailwindcss-motion@1.1.1` ships as ESM (index.js). When Next.js 14's webpack resolves the plugin through `import tailwindcssMotion from 'tailwindcss-motion'`, it loads the ESM build which imports `flattenColorPalette` from `tailwindcss/lib/util/flattenColorPalette.js`. Tailwind v3's CJS-based resolver returns this as `undefined` in webpack's module processing context, causing `TypeError: flattenColorPalette is not a function`.
- **Fix:** Changed `import tailwindcssMotion from 'tailwindcss-motion'` to `const tailwindcssMotion = require('tailwindcss-motion')` with an ESLint suppression comment. The `require()` call resolves to `dist/index.cjs` (the CJS build) which loads correctly in webpack's module system.
- **Files modified:** tailwind.config.ts
- **Commit:** d977f52

**All acceptance criteria remain satisfied.** The `tailwindcssMotion` constant appears in both the require line and the plugins array. `grep "tailwindcss-motion" package.json` still returns 1 match.

## Verification Results

| Check | Result |
|-------|--------|
| `npm run build` | PASS — zero errors, 18 static pages generated |
| `npm run lint` | PASS — no ESLint warnings or errors |
| Token presence (all 10 eden.* tokens) | PASS — 13 token-related matches in tailwind.config.ts |
| Font variable chain (`--font-outfit` in both files) | PASS — identical variable name confirmed |
| No legacy tokens in Phase 1 files | PASS — 0 matches for eden-bg, eden-cream, eden-burgundy, eden-border-light, font-serif |
| Outfit font files in .next/static/media/ | PASS — generated during build |

## Known Stubs

None. This plan establishes foundational config — no data flows or UI rendering are involved.

## Expected Side Effects (Intentional)

Components referencing old token names (`eden-bg`, `eden-cream`, `eden-muted`, `eden-border-light`, `font-serif`) now produce no CSS output — they render with default browser styles. This is the documented temporary visual breakage accepted per the research recommendation (option b). Phase 2 (Navigation and Footer) begins component token migration.

## Self-Check

- [x] tailwind.config.ts exists with new 10-token palette
- [x] app/layout.tsx exists with Outfit import only (no Playfair/DM Sans)
- [x] app/globals.css updated with new token names
- [x] Commits fd5851f, e073ce5, d977f52 all exist in git log
- [x] npm run build passes
- [x] npm run lint passes
