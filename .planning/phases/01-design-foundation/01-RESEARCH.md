# Phase 1: Design Foundation - Research

**Researched:** 2026-04-07
**Domain:** Tailwind CSS design token system + Next.js Google Font self-hosting
**Confidence:** HIGH

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| CLR-01 | Full palette replacement — dark header/footer (#1C1917), warm light body (#FAFAF8), gold accents (#C5A47E) | Complete token map defined in Standard Stack; all hex values verified |
| CLR-02 | Two-layer token system — primitive color values + semantic token names in Tailwind config | Architecture Pattern 1 documents this pattern with full code |
| CLR-03 | Dual-role gold tokens — decorative gold for borders/dividers, darker gold for text on light backgrounds | WCAG math computed: gold (#C5A47E) = 2.24:1 on light — DECORATIVE ONLY; gold-deep (#A8865C) = 3.23:1 — also fails 4.5:1 body threshold; gold is text-safe only on dark sections (7.48:1) |
| CLR-04 | Section contrast zones — dark bookend sections (nav/footer) with warm light content areas | Architecture Pattern 3 documents the section alternation model |
| CLR-05 | All text passes WCAG AA contrast ratios (4.5:1 minimum) on their respective backgrounds | Contrast table computed; critical gap found: eden.text-muted on eden.card = 4.33:1 FAILS — must be darkened to #716A65 minimum |
| TYP-01 | Replace Playfair Display + DM Sans with Outfit via next/font/google (self-hosted, zero FOUT) | next/font/google pattern verified; Outfit import code documented |
| TYP-02 | Consistent typographic scale — headings feel family-related, body 16-18px, labels ultra-tracked | Type scale documented in Standard Stack; weight-based hierarchy replaces two-font system |
| TYP-03 | All font weights loaded: 300 (light), 400 (regular), 500 (medium), 600 (semibold) | Outfit weight array documented: ['300', '400', '500', '600'] |
</phase_requirements>

---

## Summary

Phase 1 replaces the two foundational files that control the entire visual output of the site: `tailwind.config.ts` (all design tokens) and `app/layout.tsx` (font loading). A third file, `app/globals.css`, requires coordinated updates for CSS custom properties, base layer defaults, and the hardcoded focus ring color. No component files are modified in this phase — the token changes propagate automatically once the config is correct.

The critical constraint is WCAG compliance. Computed contrast ratios expose one issue with the proposed palette: `eden.text-muted (#78716C)` passes 4.5:1 on `eden.surface (#FAFAF8)` at 4.59:1 but falls to 4.33:1 on `eden.card (#F5F3EF)`, which fails. The fix is to darken the muted token to `#716A65` (4.80:1 on card, safe on surface too). Gold (`#C5A47E`) is confirmed decorative-only on light surfaces at 2.24:1 — it must never carry readable text in light-section contexts.

The font replacement is straightforward using the project's existing `next/font/google` pattern. Outfit is a variable-weight Google Font; the single import covers all required weights (300–600). The current two-font approach (`--font-playfair` for headings + `--font-dm-sans` for body) must be completely removed from both `layout.tsx` and `tailwind.config.ts`, and all `@layer base` serif heading rules must be purged from `globals.css`.

**Primary recommendation:** Write the complete new `tailwind.config.ts` first, verify token classes resolve in the dev server, then update `layout.tsx` and `globals.css`. Do NOT touch any component file during Phase 1 — visual regressions in components are expected and deferred to Phase 2.

---

## Standard Stack

### Core (No New Installs — Design Layer Only)

| Library | Version (current) | Purpose | Notes |
|---------|-------------------|---------|-------|
| Tailwind CSS | 3.4.1 (project) | Token definitions, utility class generation | No upgrade needed |
| next/font/google | built into Next.js 14.2.35 | Self-hosted Google Font loading, FOUT prevention | No install needed |
| PostCSS | 8.x (project) | Processes Tailwind config and globals.css | No change needed |

### New Dependency

| Library | Version | Purpose | Installation |
|---------|---------|---------|--------------|
| tailwindcss-motion | 1.1.1 (latest as of 2026-04-07) | CSS-only entrance animations used in Phase 4 — install now to avoid config changes mid-project | `npm install -D tailwindcss-motion` |

**Why install tailwindcss-motion in Phase 1:** The animation plugin must be registered in `tailwind.config.ts`. Installing it during the Phase 1 config rewrite is more efficient than a second config pass in Phase 4. The plugin generates no visible output until animation classes are used in components.

### Token Inventory: What Exists Now vs. Target

| Current Token | Current Value | New Token | New Value | Usage Count in Codebase |
|---------------|---------------|-----------|-----------|------------------------|
| `eden.bg` | `#0F0D0D` | `eden.ink` | `#1C1917` | 53 uses |
| `eden.surface` | `#1A1210` | `eden.surface` | `#FAFAF8` | 20 uses |
| `eden.cream` | `#F5F0E8` | `eden.white` | `#FFFFFF` | 50 uses |
| `eden.gold` | `#C9A84C` | `eden.gold` | `#C5A47E` | 114 uses (most-used token) |
| `eden.gold-light` | `#D4B86A` | `eden.gold-light` | `#E8D5B7` | 7 uses |
| `eden.muted` | `#9E9289` | `eden.text-muted` | `#716A65` | 66 uses |
| `eden.border` | `#2E2723` | `eden.border` | `#E7E0D8` | 42 uses |
| `eden.border-light` | `#3D332C` | `eden.card` | `#F5F3EF` | 4 uses |
| `eden.burgundy` | `#7B1D1D` | *(removed)* | — | 2 uses |
| *(new)* | — | `eden.gold-deep` | `#A8865C` | 0 (new) |
| *(new)* | — | `eden.text` | `#1C1917` | 0 (new) |

**CRITICAL: Token names are changing** (not just values). `eden.bg` becomes `eden.ink`, `eden.cream` becomes `eden.white`, `eden.muted` becomes `eden.text-muted`. Any component using the old token names will generate invalid CSS after the config change. Component token name migration is Phase 2 work — Phase 1 only establishes the new token vocabulary.

**Temporary resolution:** Keep old token names as aliases pointing to new values during Phase 1, OR accept that components will render with broken colors until Phase 2. The architecture doc recommends changing values first and doing a visual audit — choose whichever approach the planner designates.

### Installation

```bash
npm install -D tailwindcss-motion
```

No other installs. Outfit font is loaded at build time by Next.js from Google Fonts — no npm package.

---

## Architecture Patterns

### Recommended Project Structure

No new folders. All Phase 1 changes are confined to three files:

```
eden-immobilier/
├── tailwind.config.ts      ← REPLACE (all tokens + new font vars + tailwindcss-motion plugin)
├── app/
│   ├── layout.tsx          ← REPLACE (font imports: Playfair+DM Sans → Outfit)
│   └── globals.css         ← UPDATE (body defaults, h1-h5 rule, focus ring, CSS vars)
```

### Pattern 1: Two-Layer Token System in Tailwind Config

**What:** Color tokens are defined once in `tailwind.config.ts`. The `eden.*` namespace contains semantic tokens (purpose-driven names), not primitive descriptors. All components reference semantic names only — no hex values in JSX.

**When to use:** Every color reference in any component must use `text-eden-*`, `bg-eden-*`, `border-eden-*` classes. Never `text-[#C5A47E]` or `style={{ color: ... }}`.

**Target config (complete):**

```typescript
// tailwind.config.ts
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
          // Dark surfaces (header, footer, hero overlay, CTA sections)
          ink:          '#1C1917',
          // Light surfaces (page body, content sections)
          surface:      '#FAFAF8',
          card:         '#F5F3EF',
          // Gold accent family — decorative + interactive
          gold:         '#C5A47E',   // decorative: borders, dividers, icons (2.24:1 on light — NOT for text)
          'gold-deep':  '#A8865C',   // hover states on gold UI elements
          'gold-light': '#E8D5B7',   // subtle tints, hairlines on dark sections
          // Text hierarchy for light sections
          text:         '#1C1917',   // primary text on light (16.73:1 on surface)
          'text-muted': '#716A65',   // secondary text on light (4.80:1 on card — WCAG AA)
          // Text for dark sections
          white:        '#FFFFFF',   // primary text on dark (17.49:1 on ink)
          // Borders
          border:       '#E7E0D8',   // default border on light surfaces
        },
      },
      fontFamily: {
        sans: ['var(--font-outfit)', 'system-ui', 'sans-serif'],
        // No serif family — single font system
      },
      letterSpacing: {
        label:   '0.35em',   // ALL-CAPS category labels (preserved from current config)
        luxury:  '0.25em',   // Display headings at large sizes
        wide:    '0.08em',   // Nav links, button text
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

### Pattern 2: Font Loading via next/font/google

**What:** Outfit is imported from `next/font/google` in `app/layout.tsx`. Next.js downloads and self-hosts the font at build time — no runtime request to Google Fonts, no FOUT, no GDPR concerns.

**Target layout.tsx font section:**

```typescript
// app/layout.tsx
import { Outfit } from 'next/font/google'

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
  weight: ['300', '400', '500', '600'],
})

// In the component:
<html lang="fr" className={outfit.variable}>
  <body className="bg-eden-surface text-eden-text font-sans antialiased">
```

Note: `variable` mode (CSS custom property injection) is used so Tailwind's `fontFamily.sans` reference works. The variable name must match exactly between the `Outfit()` config and `tailwind.config.ts fontFamily.sans`.

**What to remove from layout.tsx:**
- `import { Playfair_Display, DM_Sans } from 'next/font/google'`
- The `playfair` and `dmSans` const declarations
- Both `.variable` class names from the `html` element

### Pattern 3: globals.css Base Layer Updates

**What:** The `@layer base` block in `globals.css` sets document-level defaults. After Phase 1, it must reflect the new palette and single-font system.

**Changes required:**

```css
/* app/globals.css — @layer base */
@layer base {
  html {
    scroll-behavior: smooth;
  }
  body {
    /* CHANGE: eden-bg→eden-surface, eden-cream→eden-text */
    @apply bg-eden-surface text-eden-text font-sans antialiased;
  }
  h1, h2, h3, h4, h5 {
    /* REMOVE: the font-serif rule entirely — no more two-font system */
    /* headings inherit font-sans from body */
  }
  ::selection {
    /* KEEP: eden-gold bg, but update text from eden-bg to eden-ink */
    @apply bg-eden-gold text-eden-ink;
  }
}
```

**Focus ring update (hardcoded hex to remove):**

```css
/* Current — hardcoded hex, references old gold value */
*:focus-visible {
  outline: 2px solid #C9A84C;
  outline-offset: 2px;
}

/* Replace with — uses Tailwind theme() to reference the token */
*:focus-visible {
  outline: 2px solid theme('colors.eden.gold');
  outline-offset: 2px;
}
```

**Section divider utility (update token reference):**

```css
/* .section-divider::before — update eden-gold reference (token name unchanged, value updates automatically) */
/* No code change needed — bg-eden-gold class already references the token */
```

### Pattern 4: Typography Weight Hierarchy (No Two-Font Complexity)

**What:** Outfit covers all typographic roles via weight variation. No more `font-serif` class for headings.

**Role mapping:**

| Role | Outfit Weight | Class | Example Usage |
|------|--------------|-------|---------------|
| Display headings (hero) | 300 Light | `font-light` | Hero title |
| Section headings (h2, h3) | 400 Regular | `font-normal` | Section title |
| UI headings, card titles | 500 Medium | `font-medium` | Property card title |
| Labels, captions | 500 Medium + tracking | `font-medium tracking-label uppercase` | Section eyebrow |
| CTA buttons, nav links | 600 Semibold | `font-semibold` | Button text |
| Body copy | 400 Regular | `font-normal` | Paragraphs |
| Secondary / metadata | 300-400 | `font-light` or default | Property specs |

### Anti-Patterns to Avoid

- **Hardcoded hex in JSX:** Never `text-[#C5A47E]` or `style={{ color: '#C5A47E' }}`. The entire point of the token system is that one config change propagates everywhere.
- **CSS @import for fonts:** Never `@import url('https://fonts.googleapis.com/...')` in globals.css alongside next/font. This bypasses Next.js size-adjust optimization and reintroduces FOUT.
- **Keeping font-serif on headings:** The `h1, h2, h3, h4, h5 { @apply font-serif; }` rule in globals.css must be deleted, not left in place. After `--font-playfair` is removed, this rule silently falls back to Georgia.
- **Using gold for text on light surfaces:** `eden.gold (#C5A47E)` is 2.24:1 on surface — catastrophic contrast failure. `eden.gold-deep (#A8865C)` is 3.23:1 — also fails 4.5:1 body text threshold. Reserve gold for decorative elements (borders, dividers, icons) on light surfaces only.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Self-hosted fonts with FOUT prevention | Manual font-face declarations with `preload` links | `next/font/google` | Next.js calculates `size-adjust` metric to prevent layout shift; builds in subsetting; generates the CSS variable automatically |
| WCAG contrast verification | Mental math or visual judgment | Computed ratios in this research doc (verified programmatically) | Gold fails silently; #78716C fails on card but not surface — only numbers reveal this |
| Opacity-modifier compatible tokens | Inline `rgba()` everywhere | CSS variable RGB channels + `<alpha-value>` syntax | Allows `text-eden-gold/50`, `bg-eden-ink/80` etc. throughout component work |
| Entrance animations (Phase 4 prep) | Custom `@keyframes` utilities | `tailwindcss-motion` plugin | Install now, zero overhead — the plugin generates CSS classes that only activate when used |

---

## Common Pitfalls

### Pitfall 1: eden.text-muted Fails on eden.card

**What goes wrong:** `#78716C` achieves 4.59:1 on `eden.surface (#FAFAF8)` — barely passes. On `eden.card (#F5F3EF)` it achieves only 4.33:1 — WCAG AA fail. `PropertyCard.tsx` uses the muted token on card surfaces for specs (bedrooms, area) which appear on a card background.

**How to avoid:** Use `#716A65` instead of `#78716C`. This achieves 4.80:1 on card and passes on surface too. This is already reflected in the target config above.

**Warning sign:** Property spec text (bedroom count, area) looks pale/washed on cards after Phase 2 component migration.

### Pitfall 2: Token Name Change Breaks All Components

**What goes wrong:** Renaming `eden.bg` → `eden.ink` and `eden.cream` → `eden.white` and `eden.muted` → `eden.text-muted` means every component using the old names will fail to resolve those classes after the config change. This produces transparent/default browser styles (not a build error — silent visual failure).

**How to avoid:** Either (a) keep old token names as aliases during Phase 1 and do a single clean migration in Phase 2, or (b) accept visual breakage during Phase 1 with the expectation that Phase 2 fixes it immediately. The planner must choose one strategy and document it. Option (a) is safer for incremental review; option (b) is fewer total config changes.

**Strategy recommendation:** Use option (b) — accept temporary visual breakage. Phase 2 immediately follows, the dev server is not a production environment, and leaving alias clutter in the config would require a cleanup pass anyway.

### Pitfall 3: Outfit Variable Not Matching Between layout.tsx and tailwind.config.ts

**What goes wrong:** If `layout.tsx` declares `variable: '--font-outfit'` but `tailwind.config.ts` references `var(--font-body)`, the browser silently falls back to `system-ui`. The text visually looks like system fonts (correct size, wrong typeface) — easy to miss during development on macOS where system-ui is San Francisco (a refined sans-serif).

**How to avoid:** The variable name `--font-outfit` must be identical in both files. The RESEARCH.md target code examples above use `--font-outfit` consistently.

**Warning sign:** Outfit's distinctive rounded `a` and `g` letterforms should be visible in the browser. If letterforms look like San Francisco or Segoe UI, the variable link is broken.

### Pitfall 4: h1–h5 Serif Rule Remains After Font Removal

**What goes wrong:** `globals.css` has `h1, h2, h3, h4, h5 { @apply font-serif; }`. After `--font-playfair` is removed from `layout.tsx` and `fontFamily.serif` is removed from `tailwind.config.ts`, this rule silently falls back to `Georgia`. Headlines render in Georgia — visually wrong, no error thrown.

**How to avoid:** Delete the `h1, h2, h3, h4, h5 { @apply font-serif; }` block from `globals.css` as part of Phase 1. Headings will inherit `font-sans` (Outfit) from the body rule.

### Pitfall 5: CSS Custom Properties Not Declared for Opacity Modifiers

**What goes wrong:** Tailwind's `/opacity` modifier syntax (e.g., `bg-eden-gold/40`) only works when the color token is defined using the `rgb(var(--color-gold) / <alpha-value>)` pattern AND the CSS variable is declared in `:root`. If tokens use raw hex strings, the modifier generates `bg-[color]/40` which is ignored.

**Current codebase uses opacity modifiers extensively:** `eden-gold/50`, `eden-gold/40`, `eden-gold/30`, `eden-gold/60`, `eden-gold/80`, `eden-bg/98`, `eden-bg/80`, `eden-surface/95`, `eden-muted/50`, `eden-muted/40`, `eden-border-light/50`.

**Decision required:** The STACK.md research recommends either (a) keeping plain hex in tailwind.config.ts (opacity modifiers stop working — must find and replace all `/opacity` usages in components), or (b) switching to RGB variable syntax for tokens that use opacity modifiers.

**Recommended approach:** Keep plain hex in `tailwind.config.ts` for Phase 1. Audit and fix opacity modifier usages in Phase 2 when touching each component file. The alternative (full RGB variable setup) adds complexity to Phase 1 and can be deferred since opacity modifiers are a component-layer concern.

---

## Code Examples

### Complete Target tailwind.config.ts

```typescript
// Source: STACK.md research + WCAG-corrected eden.text-muted value
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
          ink:          '#1C1917',
          surface:      '#FAFAF8',
          card:         '#F5F3EF',
          gold:         '#C5A47E',
          'gold-deep':  '#A8865C',
          'gold-light': '#E8D5B7',
          text:         '#1C1917',
          'text-muted': '#716A65',
          white:        '#FFFFFF',
          border:       '#E7E0D8',
        },
      },
      fontFamily: {
        sans: ['var(--font-outfit)', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        label:  '0.35em',
        luxury: '0.25em',
        wide:   '0.08em',
      },
      boxShadow: {
        luxury:        '0 4px 24px -2px rgba(28, 25, 23, 0.08)',
        'luxury-hover':'0 8px 40px -4px rgba(28, 25, 23, 0.14)',
      },
    },
  },
  plugins: [tailwindcssMotion],
}
export default config
```

### Complete Target layout.tsx

```typescript
// Source: Next.js official docs — next/font/google pattern
import type { Metadata } from 'next'
import { Outfit } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
  weight: ['300', '400', '500', '600'],
})

export const metadata: Metadata = {
  title: 'Eden Immobilier — Propriétés de Prestige',
  description:
    "Découvrez notre sélection exclusive de propriétés de luxe sur la Côte d'Azur, à Paris et dans les plus beaux domaines de France.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={outfit.variable}>
      <body className="bg-eden-surface text-eden-text font-sans antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
```

### globals.css @layer base Changes

```css
/* BEFORE */
body {
  @apply bg-eden-bg text-eden-cream font-sans antialiased;
}
h1, h2, h3, h4, h5 {
  @apply font-serif;
}
::selection {
  @apply bg-eden-gold text-eden-bg;
}

/* AFTER */
body {
  @apply bg-eden-surface text-eden-text font-sans antialiased;
}
/* h1–h5 rule DELETED — headings inherit font-sans */
::selection {
  @apply bg-eden-gold text-eden-ink;
}
```

```css
/* Focus ring — replace hardcoded hex */
/* BEFORE */
*:focus-visible {
  outline: 2px solid #C9A84C;
}

/* AFTER */
*:focus-visible {
  outline: 2px solid theme('colors.eden.gold');
}
```

---

## WCAG Contrast Verification

Computed programmatically from actual token hex values (2026-04-07):

| Token Pair | Hex Values | Contrast Ratio | WCAG AA Pass? | Use |
|------------|-----------|----------------|---------------|-----|
| eden.text on eden.surface | #1C1917 / #FAFAF8 | 16.73:1 | PASS | Body text on page background |
| eden.text on eden.card | #1C1917 / #F5F3EF | 15.78:1 | PASS | Text on card backgrounds |
| eden.text-muted on eden.surface | #716A65 / #FAFAF8 | 4.91:1 | PASS | Secondary text on page background |
| eden.text-muted on eden.card | #716A65 / #F5F3EF | 4.80:1 | PASS | Secondary text on cards |
| eden.white on eden.ink | #FFFFFF / #1C1917 | 17.49:1 | PASS | All text on dark sections |
| eden.gold on eden.ink | #C5A47E / #1C1917 | 7.48:1 | PASS | Gold text/accents on dark sections |
| eden.gold-light on eden.ink | #E8D5B7 / #1C1917 | 12.19:1 | PASS | Light gold on dark sections |
| eden.gold on eden.surface | #C5A47E / #FAFAF8 | 2.24:1 | FAIL | DECORATIVE ONLY — no text |
| eden.gold-deep on eden.surface | #A8865C / #FAFAF8 | 3.23:1 | FAIL | Hover states only — no text |

**Key constraint (CLR-03/CLR-05):** Gold is text-safe ONLY on dark (ink) backgrounds. On light surfaces, gold is strictly decorative (borders, dividers, icons). Any component rendering gold text on a light surface will violate CLR-05.

---

## Environment Availability

Step 2.6: Skipped — Phase 1 is config file changes only. No external services, databases, or CLI tools beyond npm are required. Node.js 24.13.0 and npm 10.5.2 are confirmed available.

---

## Validation Architecture

### Test Framework

No test framework is present in the project (confirmed by codebase analysis). `nyquist_validation` is `true` in config.json, but there are zero test files, no test runner configured, and the project uses no Zod/validation library.

| Property | Value |
|----------|-------|
| Framework | None installed |
| Config file | None |
| Quick run command | `npm run lint` (only available automated check) |
| Full suite command | `npm run build` (build + type check) |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | Notes |
|--------|----------|-----------|-------------------|-------|
| CLR-01 | Palette tokens present in config | Visual/manual | `npm run build` (type errors if config malformed) | No unit test possible for CSS output |
| CLR-02 | Two-layer token structure in tailwind.config.ts | Code review | `npm run lint` | Structural convention — verified by inspection |
| CLR-03 | Gold tokens correctly split (decorative vs text roles) | Visual/WCAG | `npm run build` | Contrast ratios verified manually with browser DevTools |
| CLR-04 | Light/dark section zones render correctly | Visual/manual | `npm run dev` — visual inspection | No automated UI test available |
| CLR-05 | WCAG AA pass — all text combinations | Manual/tool | Use browser accessibility checker or axe-core devtools | Pre-verified in research; confirm after component migration in Phase 2 |
| TYP-01 | Outfit loads via next/font, no FOUT | Build + visual | `npm run build` — check network tab on first load | Verified by next/font docs — zero FOUT by design |
| TYP-02 | Typographic scale consistent | Visual/manual | `npm run dev` — visual inspection across pages | No automated check |
| TYP-03 | All 4 font weights load | Build + visual | `npm run build` — check font files in `.next/static/media/` | Weight array ['300','400','500','600'] in font config |

### Sampling Rate

- **Per task:** `npm run build` — confirms TypeScript types are valid and config is syntactically correct
- **Per phase gate:** Visual inspection at `npm run dev` on homepage, listings page, and one detail page

### Wave 0 Gaps

No test infrastructure to create — this project has no testing setup and Phase 1 does not introduce it. Validation is build-time type checking + visual review.

---

## Open Questions

1. **Token name migration strategy during Phase 1**
   - What we know: Old token names (`eden.bg`, `eden.cream`, `eden.muted`, `eden.border-light`) are used in 374 total token references across 19 files
   - What's unclear: Should Phase 1 keep old names as aliases (no visual breakage) or rename immediately (visual breakage until Phase 2)?
   - Recommendation: Rename immediately — accept temporary visual breakage. This avoids alias debt and Phase 2 already covers all component files. Document in the plan that `npm run dev` will show visual regressions after Phase 1 and before Phase 2 completes.

2. **Opacity modifier compatibility**
   - What we know: The current codebase uses `/opacity` modifiers extensively (gold/50, gold/80, bg/98, etc.) with plain hex token definitions — this only works in Tailwind because plain hex tokens support opacity modifiers in Tailwind v3 via automatic `<alpha-value>` injection
   - What's unclear: Whether any token values need the explicit `rgb(var(...) / <alpha-value>)` pattern
   - Recommendation: Keep plain hex in config. Tailwind v3.4's JIT handles opacity modifiers with hex values automatically. Verify with one test class after config change.

3. **Cormorant Garamond — include or skip?**
   - What we know: STACK.md research recommends Outfit (primary) + Cormorant Garamond (optional display accent). The requirements only specify TYP-01 which names Outfit specifically.
   - What's unclear: Whether the planner should include Cormorant as an optional second font
   - Recommendation: Skip for Phase 1. TYP-01 says "Outfit via next/font/google" — follow the requirement exactly. Cormorant can be added as a polish item later if the visual review shows a need for a serif accent.

---

## Sources

### Primary (HIGH confidence)

- Next.js official docs — Font Optimization: https://nextjs.org/docs/app/getting-started/fonts
- tailwindcss-motion GitHub (romboHQ) — v1.1.1 confirmed latest: https://github.com/romboHQ/tailwindcss-motion
- WCAG 2.2 contrast requirements: https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html
- Project codebase — token usage counts, contrast values computed programmatically from actual hex values

### Secondary (MEDIUM confidence)

- .planning/research/STACK.md — typography and color stack recommendations (researched 2026-04-07)
- .planning/research/ARCHITECTURE.md — token system architecture patterns (researched 2026-04-07)
- .planning/research/PITFALLS.md — contrast pitfalls verified against actual codebase values

### Tertiary (LOW confidence)

- None — all findings verified from primary or secondary sources

---

## Metadata

**Confidence breakdown:**
- Token definitions: HIGH — hex values verified with programmatic WCAG contrast math
- Font loading pattern: HIGH — verified against Next.js official docs pattern
- Tailwind config structure: HIGH — follows official Tailwind docs for theme extension
- tailwindcss-motion compatibility: HIGH — v1.1.1 confirmed latest, Tailwind 3.4 confirmed compatible

**Research date:** 2026-04-07
**Valid until:** 2026-05-07 (stable ecosystem — Next.js and Tailwind 3.x are not in rapid-change mode)
