# Pitfalls Research

**Domain:** Luxury real estate website visual redesign (Next.js 14 + Tailwind CSS 3.4)
**Researched:** 2026-04-07
**Confidence:** HIGH — findings verified against actual codebase color tokens and WCAG math

---

## Critical Pitfalls

### Pitfall 1: Gold Accent Fails WCAG on Light Backgrounds

**What goes wrong:**
The redesign calls for a light body (e.g. `#FAF8F4`) with gold accents (`#C5A47E` range). Gold at `#C5A47E` achieves only 2.20:1 contrast against that light surface — less than half the WCAG AA minimum of 4.5:1. Any body text, label, or price rendered in gold on a cream/warm-white section becomes illegible, especially on low-brightness mobile screens. The current dark palette actually passes — `#C9A84C` gold on `#0F0D0D` background achieves 8.48:1. The redesign inverts the contrast problem rather than solving it.

**Why it happens:**
Gold reads visually rich against dark backgrounds. When the body is flipped to light, designers keep the same gold token, not realising the contrast relationship has reversed. Contrast tools are rarely consulted during the "vibe" phase of redesign.

**Verified data (computed from actual tokens):**
| Gold Hex | On `#FAF8F4` | WCAG AA Body? |
|----------|--------------|---------------|
| `#C5A47E` | 2.20:1 | FAIL |
| `#A07840` | 3.77:1 | FAIL |
| `#8B6330` | 5.04:1 | PASS |
| `#7A5520` | 6.29:1 | PASS |

Gold usable as body text only at `#8B6330` or darker — which reads as warm brown, not gold.

**How to avoid:**
- Reserve gold for **decorative, non-text elements**: divider lines, borders, badge backgrounds, icon fills. Never as body copy.
- For text labels and section eyebrows on light sections, use dark charcoal/warm-slate text instead of gold.
- Gold as text is valid only on dark header/footer surfaces where contrast reverses back above 7:1.
- Define two gold roles in the token system: `eden-gold-accent` (decorative, any surface) and `eden-gold-text` (text, dark surfaces only).

**Warning signs:**
- "Typography" is the first thing user says looks wrong after light-body implementation
- Price displays on property cards become hard to read in daylight on mobile
- Any gold text that appears against cream/white sections in a browser inspect

**Phase to address:**
Color system phase — define two gold semantic tokens before writing any component CSS.

---

### Pitfall 2: Incomplete Token Migration Leaves Orphaned Dark Classes

**What goes wrong:**
The site uses a custom `eden.*` color palette in `tailwind.config.ts`. Replacing all tokens requires touching every component file. Missing even one instance of `bg-eden-bg`, `text-eden-cream`, or `border-eden-border` leaves a dark patch in an otherwise light redesign — a stark visual bug that looks like a rendering error rather than a design choice.

**Why it happens:**
The token names are semantic (`eden-bg`, `eden-surface`, `eden-border`), not descriptive (`eden-dark`, `eden-charcoal`), so a developer updating the token values without updating component usage will silently produce wrong colors. The Tailwind JIT compiler cannot warn about this — it will happily emit whatever color the token resolves to.

**Specific risk surface in this codebase:**
- `globals.css` — `@apply bg-eden-bg text-eden-cream` on the `body` rule (line 10)
- `Navbar.tsx` — `bg-eden-bg/98`, `bg-eden-surface`, `border-eden-border` (6 distinct uses)
- `FilterBar.tsx` — `bg-eden-surface`, `border-eden-border`, `bg-eden-bg/98`
- `PropertyCard.tsx` — `bg-eden-surface`, `border-eden-border`, `border-eden-border-light`
- `ListingDetailPage` — `bg-eden-surface`, `border-eden-border` on the contact sidebar
- Every section in `page.tsx` that uses `bg-eden-surface` for the "About Teaser"

**How to avoid:**
- Before changing any token values, run a grep across the whole project for every eden token name and generate a checklist.
- Change token **values** in `tailwind.config.ts` first, then verify in browser — this reveals which components have wrong colors without any code changes.
- After the value swap, do a second pass for any hardcoded hex values in JSX (none found currently, but check inline `style=` props).
- Use the browser's element inspector to systematically audit each page at each breakpoint, not just the homepage.

**Warning signs:**
- A single section has a dark background while surrounding sections are light
- The mobile menu drawer appears dark against a now-light page
- `FilterBar` sticky bar retains dark background after body sections go light

**Phase to address:**
Phase 1 (color system) — create a migration checklist before touching token values.

---

### Pitfall 3: Muted Text Color Fails on Light Background

**What goes wrong:**
`eden-muted` (`#9E9289`) achieves 6.39:1 on the current dark background — excellent. On a proposed light body (`#FAF8F4`) it achieves only **1.86:1** — a catastrophic failure. The muted color is used extensively for secondary text: property specs, descriptions, contact sidebar copy, filter bar counts. All of it becomes unreadable after a body-to-light flip.

**Verified:** `#9E9289` on `#FAF8F4` = 1.86:1 (computed). WCAG AA minimum is 4.5:1.

**Why it happens:**
The same root cause as Pitfall 1: the muted token is designed for dark-on-dark contrast. Redesigns that flip the body color without creating light-mode variants of muted text end up with washing-out secondary text.

**How to avoid:**
- Define a `eden-text-secondary` token specifically for light body sections, targeting at minimum 4.5:1 on the chosen background. Based on calculations, `#6B5F5A` achieves 5.81:1 — usable range.
- Do not reuse the same muted token for both dark sections (header/footer) and light body sections. Two tokens are needed.
- Check that `FilterBar`, `PropertyCard` spec rows, and the detail page sidebar all pull from the correct token for their surface color.

**Warning signs:**
- Secondary text on property cards (bedroom count, surface area) is pale/faint after redesign
- The filter bar result count `"X propriétés"` is nearly invisible against the filter bar background
- Description paragraphs on listing detail page feel washed out

**Phase to address:**
Color system phase — alongside gold token split, create a text hierarchy for light surfaces before any component work.

---

### Pitfall 4: Animation on Non-Compositor Properties Causes Layout Jank

**What goes wrong:**
The existing `globals.css` already defines `fadeUp` (animates `opacity` + `translateY`) and `scaleReveal` (animates `opacity` + `scale`) — both compositor-safe. The risk is during redesign: if any new animations are added that touch `width`, `height`, `margin`, `padding`, `top`, `left`, or `background-color`, the browser must recalculate layout on every frame, dropping below 60fps on mid-range mobile devices — exactly the premium client's phone.

Additionally, `will-change` overuse (applying it to every animated card or section) promotes too many elements to GPU layers, consuming memory and causing slowdowns on mobile — the opposite of the intended optimization.

**Why it happens:**
Designers see a smooth hover effect in a reference site and replicate the CSS property without checking whether it's compositor-safe. Expanding/collapsing filter bars, animated card heights, or background-color transitions on hover are common offenders in real estate redesigns.

**How to avoid:**
- Stick to the existing pattern: only animate `opacity` and `transform` (translate, scale, rotate).
- Property card hover: use `transform: scale(1.02)` on the image (already done), not `width` changes.
- The mobile menu drawer currently uses `max-height` animation — this triggers layout recalculation. Replace with `transform: translateY(-100%)` for smoother mobile performance.
- Never apply `will-change: transform` globally. Apply it transiently via JS before an animation and remove it after.
- Test with Chrome DevTools "Rendering > Paint flashing" to catch non-compositor animations early.

**Warning signs:**
- Mobile menu open/close feels slightly sticky or delayed
- Scrolling the listings grid on mobile stutters when cards have hover transitions
- DevTools performance trace shows "Recalculate Style" or "Layout" tasks during animations

**Phase to address:**
Animation polish phase — review any new animation additions against the compositor-safe checklist.

---

### Pitfall 5: The "Premium Overload" Anti-Pattern — Too Many Luxury Signals

**What goes wrong:**
Adding every luxury signal simultaneously: gold borders on every card, gold dividers before every heading, gold eyebrow text (`text-xs tracking-label uppercase`) on every section, gold CTA buttons AND gold outline buttons on the same page, gold price typography — produces visual noise instead of luxury restraint. The eye has nowhere to rest. The site feels like a parody of luxury rather than the real thing.

The current codebase already has gold used in: navbar logo, nav CTA border, hero eyebrow label, hero divider line, hero CTA border, featured section eyebrow, featured section divider, about section eyebrow, about section divider, contact CTA eyebrow, contact CTA divider, contact CTA button, property card status badge, property card location label, property card price, back-link hover, listing detail label, listing detail divider, listing detail price — gold appears on virtually every element.

**Why it happens:**
When the design brief says "make it feel premium," the instinct is to add more premium signals. The actual mechanism of luxury is scarcity and restraint — gold means nothing if everything is gold.

**How to avoid:**
- Limit gold to 2-3 roles per page: one decorative (e.g. section divider line), one interactive (primary CTA), one data highlight (price). Everything else uses the neutral text hierarchy.
- The "quiet luxury" direction (warm neutrals, deliberate white space, editorial photography) achieves premium without gold saturation.
- Audit every use of gold after redesign. If gold appears more than 4-5 times per viewport height, reduce.
- Reserve gold eyebrow labels for hero sections and key landing sections only — not every section header.

**Warning signs:**
- Taking a screenshot and blurring it: if gold spots appear uniformly distributed across the page, there's too much.
- Someone describes the site as "flashy" rather than "elegant" — these are opposite outcomes.
- Any section where gold appears in both the eyebrow, the heading accent, the divider, and a button simultaneously.

**Phase to address:**
Visual audit at end of component redesign phase — run a systematic gold inventory before sign-off.

---

### Pitfall 6: Font Swap During Redesign Breaks Spacing Throughout

**What goes wrong:**
Replacing Playfair Display + DM Sans with Montserrat or Outfit changes the font's metrics (x-height, line height, character width). Since the codebase uses fixed pixel heights for image containers (`h-72`, `h-96`, `h-screen`), those are fine. But text containers, card titles, and hero headlines sized with `text-5xl`, `text-7xl` will reflow differently with a new font. A hero title that wraps gracefully in Playfair may overflow or awkwardly single-line in Montserrat at the same size. Property card titles (`font-serif text-lg`) may truncate differently.

Additionally, Next.js `next/font` already prevents FOUT by calculating size-adjust metrics. If the new font is added correctly through `next/font/google`, this remains handled. If a developer imports via a CSS `@import` instead (e.g. from Google Fonts URL directly in globals.css), this bypasses the optimization and reintroduces FOUT — visible as layout shift during page load.

**How to avoid:**
- Always swap fonts through `next/font/google` in `layout.tsx`, never via CSS `@import`.
- After font swap, manually review every page's hero, card titles, and section headings at mobile, tablet, and desktop widths for reflow issues.
- Adjust `text-*` size classes per breakpoint if headings need rebalancing — do not assume the same scale works for a geometrically wider sans-serif (Montserrat) as a condensed serif (Playfair).
- If using Montserrat, apply `font-feature-settings: 'kern' 1` and check that `tracking-widest` uppercase labels don't over-kern on mobile.

**Warning signs:**
- Hero headline breaks onto 3 lines on mobile after font change where it was 2 before
- Navigation bar text shifts width slightly on load (FOUT symptom)
- Property card titles in the grid truncate inconsistently across cards

**Phase to address:**
Typography phase — immediately after swapping font declarations, do a full-page reflow review before proceeding.

---

### Pitfall 7: Mobile Nav Drawer Height Animation Fails at Extremes

**What goes wrong:**
The mobile navigation uses `max-height` transition between `max-h-0` and `max-h-80` for the drawer open/close. This creates two problems: (1) it animates layout (non-compositor), causing jank; (2) if future nav links are added and the drawer exceeds `max-h-80` (320px), links are silently clipped. The current 4 nav links + 1 CTA button + padding likely fits, but it's a fragile magic number.

**Why it happens:**
`max-height` animation is a common CSS trick for "reveal" effects because `height: auto` cannot be transitioned. Developers use it without considering either the compositor cost or the fixed ceiling risk.

**How to avoid:**
- Replace the `max-height` approach with a CSS transform-based drawer: position the drawer off-screen with `transform: translateY(-100%)` and animate to `translateY(0)`. This is compositor-safe and height-independent.
- Alternatively, use a small JS measurement: read `scrollHeight` on mount, then animate to that specific pixel height.
- If keeping `max-height`, set it to something generous (`max-h-screen`) rather than a specific value.

**Warning signs:**
- Mobile menu animation appears slightly hesitant on slower Android devices
- Adding a 5th nav link causes the bottom CTA button to be clipped in the closed state

**Phase to address:**
Responsiveness phase — fix the nav drawer animation strategy before other mobile optimizations.

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Keep `max-height` drawer animation | No JS needed | Jank on mobile, magic number ceiling | Never — replace with transform approach |
| Reuse same muted token for dark and light surfaces | One token to manage | Invisible text on light sections | Never — define surface-specific text tokens |
| Use gold everywhere for "luxury feel" | Instant premium look during dev | Visual noise, dilutes luxury signal | Never — gold must be rationed |
| Import fonts via CSS `@import` instead of `next/font` | Familiar pattern | FOUT on load, loses Next.js size-adjust optimization | Never on this stack |
| Hardcode `pt-20` offset for fixed navbar | Works for current navbar height | Breaks if navbar height changes or at intermediate breakpoints | Acceptable temporarily, replace with CSS custom property |

---

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| Unsplash remote images | Forgetting to add `images.unsplash.com` to `remotePatterns` in `next.config.js` | Configure `remotePatterns` with `hostname: 'images.unsplash.com'` — already done, preserve during any config changes |
| `next/font/google` | Adding a new font via CSS `@import` to use it alongside the next/font setup | Import all Google Fonts exclusively through `next/font/google` in `layout.tsx`; assign CSS variables and reference via Tailwind `fontFamily` config |
| Tailwind custom color tokens | Changing token values in `tailwind.config.ts` without auditing all component usage | Grep every `eden-*` token name before changing values; use browser-based visual audit after each value change |
| WhatsApp floating button | Placing with `position: fixed` at `bottom-6 right-6` without accounting for mobile browser chrome | Test on actual iOS Safari and Android Chrome — browser UI chrome reduces visible area; use `bottom: env(safe-area-inset-bottom, 24px)` or equivalent |

---

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Non-compositor CSS animation | Jank during scroll/open on mid-range Android | Only animate `opacity` and `transform` | Immediately on devices below iPhone 12 class |
| `will-change` applied to all cards | Page feels sluggish, memory warning in DevTools | Apply `will-change` only transiently, remove after animation completes | At 12+ property cards visible simultaneously |
| Full-resolution Unsplash images without `sizes` attribute | Slow LCP on mobile, large images downloaded unnecessarily | Current `sizes` values are correct — preserve them during redesign | Every mobile page load |
| Stagger animation delays accumulating | Later cards in a list take >1s to appear, users think page is broken | Cap total stagger at 400-500ms regardless of item count | Listings page with 8+ properties |

---

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Gold text on light sections for price display | Price is the primary decision-making data point; if it's hard to read, the page fails its core job | Use dark charcoal for price on light surfaces; reserve gold for dark sections where it passes contrast |
| Touch targets smaller than 44×44px | Mobile users mis-tap nav links, filter dropdowns, and CTA buttons — increasing exit rate | Ensure all interactive elements meet 44×44px minimum; filter selects currently at `py-2.5` may need verification |
| Hero section with text on varying Unsplash images | Overlay gradient may be insufficient for some Unsplash photos — text can disappear | The current overlay is `from-eden-bg/70 via-eden-bg/30 to-eden-bg` — in the new system, calibrate overlay opacity to the new background color, not the old dark bg token |
| WhatsApp button obscuring bottom CTA on listing detail | User cannot tap "Demander une visite" because the floating button covers it | Position WhatsApp button at `bottom-24` on mobile, or add `mb-24` padding to the last element before the button overlaps |
| Insufficient whitespace between sections | Even with good colors, sections feel cramped and "budget" | The current `py-24` sectioning is correct — do not reduce padding during redesign to "fit more content" |

---

## "Looks Done But Isn't" Checklist

- [ ] **Gold contrast on light sections:** Verify every gold text element achieves 4.5:1 on its background — do not rely on visual impression, use a contrast checker
- [ ] **Muted text on light surfaces:** `eden-muted` (#9E9289) fails on cream/white — verify a new light-mode muted token is defined and applied everywhere secondary text appears
- [ ] **Mobile menu:** Test drawer open/close on a physical device or accurate DevTools simulation — the max-height animation may appear smooth in desktop DevTools but jank on actual Android
- [ ] **Hero overlay calibration:** After color token change, the hero gradient references `eden-bg` — if the token value changes, the overlay opacity changes too; re-verify text legibility on the hero image
- [ ] **Filter bar sticky behavior:** At exactly the `top-20` offset, verify the filter bar does not overlap the navbar on any viewport — especially at 375px width where stacking can shift heights
- [ ] **WhatsApp button z-index:** At `z-50`, it should float above all content but below modals — verify it doesn't obscure the image gallery on the detail page
- [ ] **Font variable names:** When swapping from Playfair/DM Sans to a new font, the CSS variable names (`--font-playfair`, `--font-dm-sans`) must be updated in both `layout.tsx` and `tailwind.config.ts` — a mismatch silently falls back to system fonts

---

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Gold fails contrast on light sections | LOW | Darken the text role of gold to `#8B6330` equivalent; gold decorative elements (lines, borders) unchanged |
| Orphaned dark tokens after migration | LOW | Global find-replace for each token name; one-pass visual audit per page |
| Muted text invisible on light surface | LOW | Create `eden-text-secondary` token at 4.5:1+ on light bg; grep and replace `text-eden-muted` in light-surface contexts |
| Font swap breaks heading reflow | MEDIUM | Adjust `text-*` size scale per breakpoint; requires per-page visual review |
| Nav drawer clips content | LOW | Change `max-h-80` to `max-h-screen`; no component logic changes needed |
| Luxury overload (too much gold) | MEDIUM | Audit every gold usage, demote eyebrow labels and section dividers to neutral color; requires systematic sweep across all pages |
| Animation jank from non-compositor property | LOW-MEDIUM | Identify offending property via Paint Flashing in DevTools; replace with transform equivalent |

---

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Gold contrast on light sections | Phase 1: Color System | Run contrast calculator on every text/background token combination before writing component CSS |
| Muted text fails on light surface | Phase 1: Color System | Define light-surface text hierarchy tokens; verify ratios before proceeding |
| Incomplete token migration | Phase 1: Color System | Grep checklist of all eden token names; visual audit each page after token value swap |
| Premium overload (too much gold) | Phase 3: Visual Audit | Gold inventory count per page — max 4-5 visible gold elements per viewport |
| Font swap causes heading reflow | Phase 2: Typography | Post-font-swap review of every heading at mobile + desktop breakpoints |
| Font loaded via CSS @import bypasses Next.js optimization | Phase 2: Typography | Verify `layout.tsx` is the single source of font imports |
| Non-compositor animation (max-height) | Phase 4: Mobile + Responsiveness | DevTools Paint Flashing on mobile menu open/close |
| will-change overuse | Phase 4: Animation Polish | DevTools memory profile during listings page scroll |
| WhatsApp button overlap | Phase 4: Mobile + Responsiveness | Test on iPhone SE (375px) and Android viewport with listing detail sticky sidebar visible |

---

## Sources

- WCAG 2.2 contrast requirements: https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html
- Contrast ratios above computed from actual `tailwind.config.ts` token values (#0F0D0D, #1A1210, #C9A84C, #9E9289, #F5F0E8) using WCAG luminance formula
- CSS animation compositor properties: https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/Animation_performance_and_frame_rate
- Animation performance tier list: https://motion.dev/magazine/web-animation-performance-tier-list
- Next.js font optimization (FOUT prevention): https://vercel.com/blog/nextjs-next-font
- Luxury real estate design principles: https://videinfra.com/blog/luxury-real-estate-website-design-principles-strategy-and-best-practices
- Luxury real estate color palette guidance: https://www.agentimage.com/blog/the-hue-of-luxury-the-art-science-of-choosing-colors-for-stunning-real-estate-websites/
- Real estate typography best practices: https://www.luxurypresence.com/blogs/brand-fonts-real-estate-website/
- Tailwind color token design: https://www.epicweb.dev/tutorials/tailwind-color-tokens
- Next.js remote image patterns: https://nextjs.org/docs/app/api-reference/components/image

---
*Pitfalls research for: luxury real estate website visual redesign (Eden Immobilier)*
*Researched: 2026-04-07*
