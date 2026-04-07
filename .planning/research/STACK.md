# Technology Stack

**Project:** Eden Immobilier — Design Overhaul
**Researched:** 2026-04-07
**Confidence:** HIGH (core decisions), MEDIUM (color values)

---

## Context: What Stays, What Changes

The existing stack (Next.js 14.2, React 18, Tailwind CSS 3.4, TypeScript 5, App Router) is frozen by constraint. This document covers only the design-layer additions and replacements: fonts, color tokens, animation approach, and Tailwind plugins.

**Current state to replace:**
- Fonts: Playfair Display + DM Sans → replaced
- Color tokens: `eden.*` palette (too dark, near-black backgrounds) → full replacement
- Plugins: none → add animation plugin
- Letter-spacing: keep `label` token, it is already correct

---

## Recommended Stack (Design Layer)

### Typography

**Primary (body + UI):** Outfit  
**Accent (hero labels, section eyebrows):** Cormorant Garamond  

| Role | Font | Weight Range | Google Fonts | Why |
|------|------|-------------|--------------|-----|
| Body, UI, navigation | Outfit | 300–700 | Yes — variable | Geometric sans-serif. Feels modern-luxury rather than generic-corporate. More refined than DM Sans. Variable font = single network request. Pairs with serif accents without fighting them. |
| Display accent (optional) | Cormorant Garamond | 300–600 | Yes — variable | Ultra-high contrast, fine serifs. Use only for pull-quotes, hero eyebrows, or property category labels at large sizes. NOT for body text — its counters are too small. Signals "curated editorial" without being cluttered. |

**What NOT to use:**
- Montserrat: overused, feels mid-market real estate (Remax, Century21). Lacks the quiet luxury of Outfit.
- Playfair Display (current): editorial, not chic. The user correctly identified this mismatch.
- DM Sans (current): technically fine but has no personality for luxury positioning.
- Raleway: popular but thin at body sizes, poor accessibility.

**Next.js loading pattern (App Router):**
```tsx
// app/layout.tsx — replace existing font imports
import { Outfit, Cormorant_Garamond } from 'next/font/google'

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant',
  display: 'swap',
  weight: ['300', '400', '500', '600'],
})
```

`next/font/google` self-hosts fonts at build time — zero runtime network request to Google, no GDPR issues, zero layout shift (CONFIDENCE: HIGH — verified via Next.js official docs).

**Tailwind config mapping:**
```ts
fontFamily: {
  sans: ['var(--font-outfit)', 'system-ui', 'sans-serif'],
  display: ['var(--font-cormorant)', 'Georgia', 'serif'],
},
```

**Letter-spacing:**  
Add `widest-luxury: '0.25em'` alongside the existing `label: '0.35em'`. Outfit benefits from tracking at display sizes; Cormorant is already naturally wide and needs less.

---

### Color System

**Philosophy:** Warm luxury with contrast. Dark header/footer creates architectural depth. Light body sections give breathing room. Gold reads as warm accent, not gaudy.

| Token Name | Hex | Role | Rationale |
|------------|-----|------|-----------|
| `eden.ink` | `#1C1917` | Header, footer background | Warm charcoal (not cold black). Comparable to "Obsidian Elegance" charcoal from luxury palette research. Avoids the blue-grey coldness of pure #000. |
| `eden.surface` | `#FAFAF8` | Page body background | Near-white with a warm cast. Prevents harshness of pure white against gold. |
| `eden.card` | `#F5F3EF` | Card backgrounds, elevated surfaces | Slightly warmer than surface. Creates soft depth without heavy shadows. |
| `eden.gold` | `#C5A47E` | Primary accent — borders, icons, highlights | The user specified `#C5A47E` range. This is muted gold (not yellow-gold), reads as bronze-champagne. Classic luxury signifier. |
| `eden.gold-deep` | `#A8865C` | Hover states on gold elements | Darker variant for interaction states. Keeps gold family coherent. |
| `eden.gold-light` | `#E8D5B7` | Subtle gold tints, decorative rules | For section dividers, hairlines, backgrounds on CTA blocks. |
| `eden.text` | `#1C1917` | Body copy on light backgrounds | Same as ink — ensures 7:1 contrast ratio against surface. WCAG AAA. |
| `eden.text-muted` | `#78716C` | Secondary text, metadata, labels | Warm stone-grey. Passes WCAG AA (4.5:1) against surface. |
| `eden.border` | `#E7E0D8` | Default borders, dividers | Warm neutral border, visible but not harsh. |
| `eden.white` | `#FFFFFF` | Text on dark sections (header/footer) | Full white for legibility on `eden.ink` backgrounds. |

**What NOT to use:**
- The current `eden.bg: #0F0D0D` and `eden.surface: #1A1210` everywhere — makes the site feel like a nightclub. Reserve dark only for header/footer.
- `eden.burgundy: #7B1D1D` — wine red reads as aggressive. Remove entirely; gold does the accent work.
- Pure `#C9A84C` (current gold) — this is yellow-gold, feels cheap on digital. The proposed `#C5A47E` is warmer and more champagne.

**Usage rules:**
- Dark sections (header, footer, hero overlay): `eden.ink` background, `eden.white` text, `eden.gold` accents
- Light sections (listings, about, contact): `eden.surface` or `eden.card` background, `eden.text` copy
- CTAs: `eden.gold` background with `eden.ink` text (the inversion creates the "button" without needing a border)

---

### Animation Strategy

**Recommended approach: CSS-first with `tailwindcss-motion`**

Do NOT reach for Motion (Framer Motion) or GSAP for this project. The redesign needs subtle micro-interactions — fade-ins, hover lifts, card reveals — not cinematic page transitions or scroll-timeline animations. Adding a JS animation library adds 15–25kb gzipped and requires `"use client"` directives, which breaks Next.js server component benefits.

| Library | Bundle | Approach | Verdict for Eden |
|---------|--------|----------|-----------------|
| `tailwindcss-motion` | <5kb (pure CSS) | Utility classes, no JS | **USE THIS** |
| Motion (formerly Framer Motion) | 15–25kb gzipped | React component-based | Skip — overkill |
| GSAP | 23kb core + plugins | Imperative JS API | Skip — overkill for this scope |
| CSS transitions only (Tailwind built-ins) | 0kb | `transition`, `duration-`, `ease-` | Sufficient for hovers; not for entrance animations |

**`tailwindcss-motion`** (by romboHQ):
- Pure CSS, 60fps, zero Lighthouse impact
- Ships TypeScript definitions
- Provides `motion-preset-fade`, `motion-preset-slide-up`, etc. — exactly what property cards need on page load
- Works with Tailwind 3.4 (the project's current version)

```bash
npm install -D tailwindcss-motion
```

```ts
// tailwind.config.ts
import tailwindcssMotion from 'tailwindcss-motion'

plugins: [tailwindcssMotion],
```

**For hover states: Tailwind built-in transitions are sufficient.**  
The pattern `transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg` is everything a property card hover needs. No library required.

**What NOT to use:**
- GSAP: appropriate for agencies building branded marketing sites with scroll-timeline storytelling. Eden is a listings site — GSAP would be engineering overkill and adds licensing complexity (GSAP is owned by Webflow, with restrictions on competing tools).
- Animate.css / `tailwindcss-animatecss`: dated keyframe dumps, not utility-native.

---

### Tailwind Plugins

| Plugin | npm package | Purpose | Required? |
|--------|-------------|---------|-----------|
| tailwindcss-motion | `tailwindcss-motion` | Entrance animations (fade-in, slide-up on cards) | YES |
| @tailwindcss/typography | `@tailwindcss/typography` | Skip — no long-form prose content | NO |
| @tailwindcss/forms | `@tailwindcss/forms` | Skip — contact form is simple, custom styling is enough | NO |
| @tailwindcss/aspect-ratio | built into Tailwind 3.2+ | Not needed — aspect-ratio is now a core utility | NO |

Only add `tailwindcss-motion`. Adding multiple plugins without clear need creates configuration drift.

---

### Custom Tailwind Utilities to Add

Beyond plugins, two custom utilities pay dividends throughout the redesign:

```ts
// tailwind.config.ts — extend section
extend: {
  boxShadow: {
    'luxury': '0 4px 24px -2px rgba(28, 25, 23, 0.08)',
    'luxury-hover': '0 8px 40px -4px rgba(28, 25, 23, 0.14)',
  },
  transitionTimingFunction: {
    'luxury': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  },
}
```

- `shadow-luxury` / `shadow-luxury-hover`: warm-tinted soft shadow. Property cards lift elegantly without looking like a material design app.
- `ease-luxury`: slightly decelerated ease. Standard `ease-out` is fine; this is a fine-tuning option if the transition feel needs to be more deliberate.

---

## Full Tailwind Config (Target State)

```ts
import type { Config } from 'tailwindcss'
import tailwindcssMotion from 'tailwindcss-motion'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './contexts/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        eden: {
          ink:         '#1C1917',
          surface:     '#FAFAF8',
          card:        '#F5F3EF',
          gold:        '#C5A47E',
          'gold-deep': '#A8865C',
          'gold-light':'#E8D5B7',
          text:        '#1C1917',
          'text-muted':'#78716C',
          border:      '#E7E0D8',
          white:       '#FFFFFF',
        },
      },
      fontFamily: {
        sans:    ['var(--font-outfit)', 'system-ui', 'sans-serif'],
        display: ['var(--font-cormorant)', 'Georgia', 'serif'],
      },
      letterSpacing: {
        label:          '0.35em',
        'luxury':       '0.25em',
      },
      boxShadow: {
        luxury:       '0 4px 24px -2px rgba(28, 25, 23, 0.08)',
        'luxury-hover':'0 8px 40px -4px rgba(28, 25, 23, 0.14)',
      },
    },
  },
  plugins: [tailwindcssMotion],
}
export default config
```

---

## Alternatives Considered

| Category | Recommended | Alternative Rejected | Why Rejected |
|----------|-------------|---------------------|--------------|
| Body font | Outfit | Montserrat | Overused in mid-market real estate; generic |
| Body font | Outfit | DM Sans (current) | Technically fine but no luxury character |
| Display accent | Cormorant Garamond | Playfair Display (current) | Too editorial, old-guard feel; user confirmed |
| Display accent | Cormorant Garamond | Libre Baskerville | More readable but less expressive — wrong trade-off for display-only use |
| Animation | tailwindcss-motion | Motion/Framer Motion | JS overhead, requires client components; overkill for this scope |
| Animation | tailwindcss-motion | GSAP | 23kb core + plugins, Webflow ownership restriction, timeline overkill |
| Color | New warm palette | Extending current dark palette | Current palette is the problem; a patch won't fix it |

---

## Installation

```bash
# Fonts: no install needed — handled by next/font/google at build time

# Animation plugin
npm install -D tailwindcss-motion
```

No other new dependencies. The redesign is intentionally addition-minimal — replacing tokens and the font loader, adding one plugin.

---

## Confidence Assessment

| Decision | Confidence | Basis |
|----------|------------|-------|
| Outfit as body font | HIGH | Multiple luxury design sources; Google Fonts; production-verified variable font |
| Cormorant Garamond as display accent | HIGH | Typewolf, Luxury Presence, direct font analysis |
| next/font/google for self-hosting | HIGH | Official Next.js documentation |
| New color palette | MEDIUM | Derived from researched luxury palettes + user spec (#C5A47E); specific hex values for non-gold tokens are educated choices, not validated against a specific brand guide |
| tailwindcss-motion for animation | HIGH | npm, GitHub, official docs; Tailwind 3.4 compatible; bundle size verified |
| No JS animation library | HIGH | Scope analysis — interactions are hover + entrance, not timeline-driven |

---

## Sources

- Next.js Font Optimization: https://nextjs.org/docs/app/getting-started/fonts
- Luxury Presence — Brand Fonts for Real Estate: https://www.luxurypresence.com/blogs/brand-fonts-real-estate-website/
- Cormorant Garamond — Google Fonts: https://fonts.google.com/specimen/Cormorant+Garamond
- Outfit — Google Fonts: https://fonts.google.com/specimen/Outfit
- Typewolf — Cormorant pairings: https://www.typewolf.com/cormorant
- 9 Luxury Color Palettes 2025 — Brandlic: https://brandlic.studio/9-luxury-color-palettes-that-define-high-end-design-in-2025/
- tailwindcss-motion (romboHQ) GitHub: https://github.com/romboHQ/tailwindcss-motion
- Motion vs GSAP: https://motion.dev/docs/gsap-vs-motion
- Luxury Real Estate Design Trends 2026: https://www.dmrmedia.org/blog/Real-Estate-Website-Design-Trends
- GSAP vs Motion (Satish Kumar 2026): https://satishkumar.xyz/blogs/gsap-vs-motion-guide-2026
