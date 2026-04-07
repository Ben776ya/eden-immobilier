# Architecture Research

**Domain:** Premium luxury real estate website — design system within Next.js 14 + Tailwind CSS 3.4
**Researched:** 2026-04-07
**Confidence:** HIGH (stack is fully known, patterns drawn from official docs and current community practice)

---

## Standard Architecture

### System Overview

The design system sits as a horizontal layer across the existing application. It does not change routing, data, or component composition — it replaces all visual decisions.

```
┌─────────────────────────────────────────────────────────────┐
│                    DESIGN TOKEN LAYER                        │
│  tailwind.config.ts (token definitions)                      │
│  app/globals.css (@layer base — CSS variables, base styles)  │
├─────────────────────────────────────────────────────────────┤
│                    COMPONENT LAYER                           │
│  ┌──────────┐  ┌───────────┐  ┌────────────┐  ┌──────────┐  │
│  │  Navbar  │  │   Footer  │  │PropertyCard│  │FilterBar │  │
│  └──────────┘  └───────────┘  └────────────┘  └──────────┘  │
│  ┌──────────┐  ┌───────────┐  ┌────────────┐                 │
│  │ImageGallery│ │SpecsGrid │  │ Form inputs│                 │
│  └──────────┘  └───────────┘  └────────────┘                 │
├─────────────────────────────────────────────────────────────┤
│                    PAGE LAYER                                │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │  Home    │  │ Listings │  │  Detail  │  │  About   │     │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘     │
│  ┌──────────┐                                                 │
│  │ Contact  │                                                 │
│  └──────────┘                                                 │
└─────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Design Responsibility | Current Pain Point |
|-----------|----------------------|-------------------|
| `Navbar` | Dark sticky header, gold logo, uppercase nav links | Correct dark treatment, keep as anchor |
| `Footer` | Dark footer with warm surface, gold section labels | Correct dark treatment, keep as anchor |
| `PropertyCard` | Core content unit — image, price, metadata | Must adapt to light body background in new palette |
| `FilterBar` | Sticky filter strip below navbar | Input/select styling must match new token set |
| `ImageGallery` | Full-width property photo viewer | Overlay and control styling |
| `SpecsGrid` | Property spec table/grid | Typography and spacing tokens |
| Form inputs | Contact, admin form fields | Consistent border/focus/placeholder tokens |
| Page sections | Hero, featured grid, about, CTA sections | Section alternation: light/dark/light pattern |

---

## Recommended Project Structure

No new folders are needed. The design system lives entirely within the existing file structure:

```
eden-immobilier/
├── tailwind.config.ts        ← ALL color and font tokens live here
├── app/
│   └── globals.css           ← CSS variables, @layer base resets, animations
│   └── layout.tsx            ← Font loading (swap Playfair + DM Sans for Montserrat)
├── components/
│   ├── Navbar.tsx            ← Token consumers (no hardcoded colors)
│   ├── Footer.tsx            ← Token consumers
│   ├── PropertyCard.tsx      ← Token consumers
│   ├── FilterBar.tsx         ← Token consumers
│   ├── ImageGallery.tsx      ← Token consumers
│   └── SpecsGrid.tsx         ← Token consumers
└── app/
    ├── page.tsx              ← Section palette: light body, dark CTA
    ├── listings/page.tsx     ← Light background body
    ├── listings/[id]/page.tsx
    ├── about/page.tsx
    └── contact/page.tsx
```

### Structure Rationale

- **tailwind.config.ts is the single source of truth** for all token values. No color hex code appears in any component JSX — only token class names like `bg-eden-bg`, `text-eden-gold`.
- **globals.css handles the base layer**: body defaults, typography element defaults, animation keyframes, focus ring, custom utilities. This keeps component files clean.
- **No `styles/` folder needed**: Tailwind utilities + `@layer base` in globals.css is sufficient.
- **No CSS Modules**: The site is small enough that utility classes + token naming provide all the scoping needed.

---

## Architectural Patterns

### Pattern 1: Two-Layer Token System

**What:** All design values are defined at two levels — *primitive* (raw named values) and *semantic* (purpose-driven aliases). Only semantic tokens are used in components.

**When to use:** Always. This is the correct pattern for any Tailwind project with a coherent design system.

**Trade-offs:** One additional level of indirection in config; pays off immediately when any color needs to change across the whole site.

**Implementation in tailwind.config.ts:**

```typescript
const config: Config = {
  theme: {
    extend: {
      colors: {
        // ── Primitive layer (raw palette, not used directly in JSX) ──
        primitive: {
          'warm-white': '#FAF8F5',
          'warm-50':    '#F5F1EA',
          'warm-100':   '#EDE6D9',
          'warm-200':   '#D9CEBC',
          'charcoal-900': '#16130F',
          'charcoal-800': '#1F1B15',
          'charcoal-700': '#2A251D',
          'charcoal-600': '#3D3629',
          'gold-400':   '#D4B896',
          'gold-500':   '#C5A47E',
          'gold-600':   '#B8925F',
          'stone-400':  '#A09080',
          'stone-500':  '#7D6E5E',
        },
        // ── Semantic layer (only these are used in components) ──
        eden: {
          // Backgrounds
          bg:          '#FAF8F5',   // Light warm white — page body
          'bg-alt':    '#F0EBE1',   // Slightly deeper — alternating sections
          surface:     '#FFFFFF',   // Card/form surface on light bg
          dark:        '#16130F',   // Navbar, footer, dark sections
          'dark-alt':  '#1F1B15',   // Secondary dark surface
          // Text
          heading:     '#16130F',   // Primary headings on light bg
          body:        '#4A3F33',   // Body text on light bg
          muted:       '#7D6E5E',   // Secondary text, captions
          'on-dark':   '#EDE6D9',   // Text on dark backgrounds
          'muted-dark':'#A09080',   // Muted text on dark backgrounds
          // Accent
          gold:        '#C5A47E',   // Primary accent, CTAs, highlights
          'gold-light':'#D4B896',   // Hover state for gold
          'gold-dark': '#B8925F',   // Pressed / deeper accent
          // Borders
          border:      '#DDD5C5',   // Subtle border on light sections
          'border-dark':'#2A251D',  // Border on dark sections
          'border-gold':'rgba(197,164,126,0.35)', // Gold-tinted border
        },
      },
      fontFamily: {
        // Swap: DM Sans out, Montserrat in. Keep variable pattern.
        sans:  ['var(--font-montserrat)', 'system-ui', 'sans-serif'],
        // No display/serif needed — Montserrat handles all weights
      },
      fontSize: {
        // Luxury type scale — deliberate, generous
        'display-xl': ['clamp(2.5rem, 6vw, 5rem)',    { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'display-lg': ['clamp(2rem, 4.5vw, 3.5rem)',  { lineHeight: '1.1',  letterSpacing: '-0.02em' }],
        'display-md': ['clamp(1.5rem, 3vw, 2.5rem)',  { lineHeight: '1.15', letterSpacing: '-0.01em' }],
        'display-sm': ['clamp(1.25rem, 2vw, 1.75rem)',{ lineHeight: '1.2',  letterSpacing: '-0.01em' }],
        'body-lg':    ['1.125rem', { lineHeight: '1.75' }],
        'body-md':    ['1rem',     { lineHeight: '1.7'  }],
        'body-sm':    ['0.875rem', { lineHeight: '1.6'  }],
        'label':      ['0.6875rem',{ lineHeight: '1',   letterSpacing: '0.18em' }],
        'caption':    ['0.75rem',  { lineHeight: '1.5', letterSpacing: '0.05em' }],
      },
      letterSpacing: {
        label: '0.18em',    // Used for ALL-CAPS category labels
        title: '-0.02em',   // Large headings — tighten tracking
        wide:  '0.08em',    // Nav links, buttons
      },
      spacing: {
        // Section spacing tokens — used for py- on page sections
        'section-sm':  '4rem',   // 64px  — tight sections
        'section-md':  '6rem',   // 96px  — standard sections
        'section-lg':  '8rem',   // 128px — hero-adjacent sections
        'section-xl':  '10rem',  // 160px — hero sections
      },
    },
  },
}
```

---

### Pattern 2: CSS Variable Reference for Runtime-Flexible Values

**What:** Values that need to work with Tailwind's opacity modifier syntax (e.g., `text-eden-gold/50`) must be defined using CSS variables referencing RGB channels, not hex strings.

**When to use:** Any token used with opacity modifiers in class names.

**Trade-offs:** Slightly more complex config; enables the full power of Tailwind's opacity system.

**Implementation:**

```typescript
// In tailwind.config.ts — for tokens used with /opacity
eden: {
  gold: 'rgb(var(--color-gold) / <alpha-value>)',
  // ...
}

// In globals.css — declare the RGB variable
@layer base {
  :root {
    --color-gold: 197 164 126;  /* #C5A47E in space-separated RGB */
  }
}
```

This pattern already exists in the codebase (e.g., `eden-gold/40`, `eden-gold/50`). The new palette must maintain this for all tokens used with opacity modifiers: `gold`, `dark`, `border`, `muted`.

---

### Pattern 3: Section Alternation via Semantic Background Tokens

**What:** Pages use a strict light/dark alternation pattern. Light sections use `bg-eden-bg` or `bg-eden-bg-alt`. Dark sections (header, footer, CTA) use `bg-eden-dark`. The key design decision is that the *body* of the site is now light, not dark.

**When to use:** Every page section uses exactly one of the two backgrounds.

**Trade-offs:** Requires updating all existing section backgrounds from `bg-eden-surface`/`bg-eden-bg` (currently dark) to new light tokens.

**Pattern:**

```
Page structure:
  Navbar         → bg-eden-dark (always dark)
  Hero section   → bg-eden-dark (full-bleed image with dark overlay)
  Content section → bg-eden-bg (light warm white)
  Alt section    → bg-eden-bg-alt (slightly deeper warm)
  CTA section    → bg-eden-dark (dark for contrast, gold CTA button)
  Footer         → bg-eden-dark (always dark)
```

**Text token pairing rule:** `bg-eden-bg` → `text-eden-heading` / `text-eden-body` / `text-eden-muted`. `bg-eden-dark` → `text-eden-on-dark` / `text-eden-muted-dark`.

---

### Pattern 4: Component-Level Class Constant Pattern

**What:** For components with repeated complex class strings (inputs, selects), define a `const` at the top of the file rather than inline repetition. This is already used in `FilterBar.tsx` and `ContactPage`.

**When to use:** Any class string applied to more than one element in a component.

**Trade-offs:** None — pure upside for maintainability.

**Example:**

```typescript
// At top of component file, not inside the JSX
const inputClass = [
  'w-full bg-eden-surface border border-eden-border',
  'text-eden-body px-4 py-3.5',
  'focus:outline-none focus:border-eden-gold focus:ring-1 focus:ring-eden-gold/30',
  'transition-all duration-300 placeholder:text-eden-muted/50',
].join(' ')
```

This pattern scales: when the design system token changes, there is one place to update per component.

---

### Pattern 5: Font Loading via CSS Variables (existing, keep)

**What:** Next.js `next/font/google` loads the font and injects a CSS variable (`--font-montserrat`). Tailwind references that variable in `fontFamily`. This is the correct pattern.

**Why keep:** Zero layout shift, automatic subsetting, no external requests at render time.

**Change needed:** Replace `Playfair_Display` + `DM_Sans` imports in `app/layout.tsx` with `Montserrat`. Update `fontFamily.sans` in tailwind.config.ts to `var(--font-montserrat)`. Remove `fontFamily.serif` entirely (no more two-font system).

```typescript
// app/layout.tsx
import { Montserrat } from 'next/font/google'

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
})
// html className: montserrat.variable only (one font)
```

---

## Data Flow (Design System)

### Token Propagation Flow

```
tailwind.config.ts (token definition)
    ↓ (Tailwind processes config at build time)
Generated utility classes (bg-eden-*, text-eden-*, etc.)
    ↓ (used in component className strings)
Component JSX (Navbar, PropertyCard, etc.)
    ↓ (rendered to HTML)
Browser renders with computed styles

globals.css (@layer base)
    ↓ (sets CSS custom properties on :root)
:root { --color-gold: 197 164 126; ... }
    ↓ (Tailwind opacity modifiers resolve at render)
text-eden-gold/50 → color: rgb(197 164 126 / 0.5)
```

### Build Order (Critical for Implementation)

```
Phase 1: Foundation
  1. tailwind.config.ts — define all new tokens (replace eden.* palette)
  2. app/globals.css — CSS variables for opacity-modifier tokens, update @layer base body defaults
  3. app/layout.tsx — swap font imports (Playfair + DM Sans → Montserrat)
  4. Verify: run dev server, check token classes resolve

Phase 2: Layout Components
  5. components/Navbar.tsx — update all eden.* classes to new semantic tokens
  6. components/Footer.tsx — same

Phase 3: Core Display Components
  7. components/PropertyCard.tsx — card background now bg-eden-surface (white), text now eden-heading/body
  8. components/FilterBar.tsx — update input classes, sticky bar now bg-eden-dark/98 or bg-eden-bg/98
  9. components/ImageGallery.tsx — overlay and control tokens
  10. components/SpecsGrid.tsx — border and text tokens

Phase 4: Pages
  11. app/page.tsx — section-by-section background/text token update
  12. app/listings/page.tsx — heading and layout tokens
  13. app/listings/[id]/page.tsx — detail page layout tokens
  14. app/about/page.tsx — section alternation
  15. app/contact/page.tsx — form input tokens

Phase 5: Polish
  16. WhatsApp floating button (new component, inject in layout.tsx)
  17. Mobile touch target audit across all components
  18. Animation and transition token review (timing stays the same)
```

---

## Scaling Considerations

| Scale | Design System Adjustments |
|-------|--------------------------|
| Current (static, 8 listings) | Token system in tailwind.config.ts is sufficient — no abstraction overhead needed |
| If new pages added | New pages adopt existing tokens automatically; no config changes |
| If theming needed (dark mode toggle) | Add CSS variable swap via `data-theme` attribute; already supported by the CSS variable pattern |
| If design tokens shared with Figma | Export `tailwind.config.ts` tokens to JSON via script; Style Dictionary can generate Figma Tokens plugin format |

---

## Anti-Patterns

### Anti-Pattern 1: Hardcoded Hex Values in Components

**What people do:** Use `className="text-[#C5A47E]"` or `style={{ color: '#C5A47E' }}` in component files.

**Why it's wrong:** The site currently has `outline: 2px solid #C9A84C` hardcoded in `globals.css` focus styles. When the gold token changes, the focus ring is missed. Multiply this by every component and you have a brittle system.

**Do this instead:** Every color reference must use a semantic token class. Focus ring goes in `globals.css` as `outline-color: theme('colors.eden.gold')` or a CSS variable.

---

### Anti-Pattern 2: Two-Font Complexity for a Single-Brand Site

**What people do:** Use Playfair Display for headings + DM Sans for body to create "editorial" hierarchy.

**Why it's wrong:** The current site has `font-serif` on `h1-h5` via `@layer base` and `font-sans` on body. This creates two systems to maintain. The user explicitly wants "chic not editorial" — a refined sans-serif handles all weights and creates a cleaner, more modern luxury feel.

**Do this instead:** Single font family (Montserrat) with weight variation for hierarchy. `font-light` (300) for display headings. `font-normal` (400) for body. `font-medium` (500) for labels/captions. `font-semibold` (600) for CTA buttons.

---

### Anti-Pattern 3: Dark Body with Dark Header/Footer

**What people do:** Apply `bg-eden-bg` (currently `#0F0D0D`) to the body, making everything dark.

**Why it's wrong:** This is the current state and the core problem. Dark body + dark card surfaces + dark Navbar = no visual contrast hierarchy. Cards blend into the background. The "too dark and cluttered" complaint is structural, not cosmetic.

**Do this instead:** Light warm body (`#FAF8F5`) with dark Navbar/Footer as bookends. Cards (`bg-white` or `bg-eden-surface`) lift off the warm body. The dark sections (hero overlay, CTA block) have maximum impact precisely because they are the exception, not the rule.

---

### Anti-Pattern 4: Arbitrary Tracking Values Per Component

**What people do:** Use `tracking-widest`, `tracking-label` (custom), and `tracking-wider` inconsistently across components. Currently `FilterBar` uses `gap-4` while `PropertyCard` uses `gap-5`; tracking values vary between components with no system.

**Why it's wrong:** Visual inconsistency accumulates. Spacing between similar elements (card metadata vs. section labels) looks arbitrary.

**Do this instead:** Define tracking in `tailwind.config.ts` as named tokens and use them consistently: `tracking-label` for ALL-CAPS category labels everywhere, `tracking-wide` for nav/button text everywhere, `tracking-title` for headings.

---

## Integration Points

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| tailwind.config.ts ↔ all components | Tailwind processes config at build; components use generated classes | Config change requires no component code changes if tokens are renamed correctly |
| globals.css ↔ Tailwind opacity modifiers | CSS variables on `:root` are read by browser when Tailwind's `rgb(var(...) / alpha)` syntax resolves | Must define CSS vars for every token used with `/opacity` modifier |
| layout.tsx ↔ font tokens | Font variable (`--font-montserrat`) set on `<html>` element via `className`; Tailwind `fontFamily` references it | Font variable must match exactly between `next/font` config and tailwind config |
| globals.css `@layer base` ↔ component defaults | Base layer sets `body`, `h1-h5`, `input`, `button` defaults; components inherit or override | After removing serif font, remove `h1, h2... { @apply font-serif }` from base layer |

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| Google Fonts (Montserrat) | `next/font/google` — loaded at build, self-hosted | Weight variants `300,400,500,600,700` needed; subset `latin` only |
| Unsplash images | `next/image` with `sizes` prop | No change needed — image component is not part of design system scope |

---

## Sources

- Tailwind CSS official docs — theme configuration: https://tailwindcss.com/docs/theme
- Tailwind CSS official docs — adding custom styles, @layer: https://tailwindcss.com/docs/adding-custom-styles
- Subframe — semantic Tailwind color setup: https://www.subframe.com/blog/how-to-setup-semantic-tailwind-colors
- Nicola Lazzari — design tokens with Tailwind: https://nicolalazzari.ai/articles/integrating-design-tokens-with-tailwind-css
- Luxury Presence — luxury real estate typography: https://www.luxurypresence.com/blogs/brand-fonts-real-estate-website/
- Frontend Tools — Tailwind design system patterns: https://www.frontendtools.tech/blog/tailwind-css-best-practices-design-system-patterns
- UX Collective — typography semantic tokens and responsive scaling: https://uxdesign.cc/mastering-typography-in-design-systems-with-semantic-tokens-and-responsive-scaling-6ccd598d9f21
- Next.js docs — Tailwind CSS setup: https://nextjs.org/docs/app/building-your-application/styling/tailwind-css

---

*Architecture research for: Eden Immobilier premium design system*
*Researched: 2026-04-07*
