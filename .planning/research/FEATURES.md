# Feature Research — Luxury Real Estate Visual Design

**Domain:** Luxury real estate website — design overhaul (visual/UX only, no functional changes)
**Researched:** 2026-04-07
**Confidence:** HIGH (cross-verified across multiple sources including Luxury Presence, WebFlow, dmrmedia, mediaboom, Ambrose Marketing)

---

## Feature Landscape

### Table Stakes (Users Expect These)

Features that make a site feel premium. Missing any of them and the site reads as amateur regardless of other polish.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Scroll-triggered sticky navbar (transparent → solid) | Every premium site does this. Transparent on hero, solid with blur on scroll. | LOW | Already partially implemented — needs glass-morphism backdrop-blur + shadow refinement on scroll threshold |
| Full-bleed hero with full-viewport height | Luxury real estate hero = immersive. Anything less feels like a content site, not a premium brand. | LOW | Already full-screen. Needs: better gradient layering, stronger typographic hierarchy |
| Oversized typographic hierarchy in hero | Statement headline dominates. Small eyebrow label above it. CTA below. Classic luxury sequence. | LOW | Currently correct pattern. Font needs switching from Playfair to refined sans (Montserrat/Outfit) per PROJECT.md |
| Animated scroll indicator below hero | A vertical line or chevron pulsing at bottom of hero. Signals "there is more below" without being pushy. | LOW | Already exists as a static line. Add breathing animation (fade-in-out pulse) |
| Property card image zoom on hover | The definitive hover pattern for real estate cards. Subtle scale (1.05 max) over 600–800ms ease-out. | LOW | Already implemented. Currently correct. |
| Image overlay gradient on card hover | Dark gradient fades in over card image on hover, making the image feel "selected." | LOW | Already implemented. Currently correct. |
| Status badge on card image (Vente / Location / Vendu) | Buyers scan for this before reading anything else. | LOW | Already implemented. |
| Gold accent color throughout | Gold is the universal luxury real estate signifier. Buttons, rules, labels, hover states. | LOW | Already tokenized as `eden-gold`. Needs the full warm-luxury color system swap per PROJECT.md |
| Generous whitespace between sections | Luxury = breathing room. Compressed spacing signals low-end. | LOW | Currently lacks consistent vertical rhythm — sections feel cramped in some areas |
| Thin decorative horizontal rule (gold) | Used under section headings and in the hero. The luxury "editorial" separator. | LOW | Already exists (`w-10 h-px bg-eden-gold/40`). Good pattern — keep and apply consistently |
| Mobile hamburger → full-screen or slide-out menu | Luxury sites never use a cramped dropdown. Either full-screen overlay or slide-in panel. | MEDIUM | Currently uses max-height expansion. Upgrade to either full-screen overlay or `translate-x` slide panel |
| WhatsApp floating action button | Table stakes for North Africa / French-speaking luxury market. Bottom-right, always visible. | LOW | Specified in PROJECT.md. Needs gold-branded icon + subtle pulse ring animation on idle |
| Consistent typographic scale | All headings feel family-related. Body text is comfortable (16–18px). Labels are ultra-tracked. | LOW | Currently inconsistent — Playfair + DM Sans pairing is not achieving "chic" goal |
| High-contrast readable body text | Text must never fight background. Minimum 4.5:1 contrast ratio for WCAG AA. | LOW | Current dark theme has contrast failures (invisible text on dark backgrounds per PROJECT.md) |
| Next.js Image optimization | `fill` + proper `sizes` prevents layout shift and blur-up loads correctly. | LOW | Already implemented throughout |

### Differentiators (Competitive Advantage)

Features that elevate Eden Immobilier above the majority of local competition. Not expected, but clearly premium when present.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Scroll-triggered reveal animations (fade-up on viewport entry) | Sections materialize as user scrolls — creates sense of craftsmanship, like a magazine unfolding. Quiet luxury signal. | MEDIUM | CSS-only approach is viable: `IntersectionObserver` + Tailwind `data-visible` classes. Avoid heavy libraries. Hero entry stagger already exists — extend this to all sections |
| "Quiet luxury" warm color palette | Deep charcoal header/footer + warm off-white body + gold = Hermès/Bottega tier. Distinguishes from cold "tech dark mode" aesthetic that dominates Moroccan real estate sites. | MEDIUM | Full Tailwind config token replacement required. This is the foundational design decision per PROJECT.md |
| Eyebrow label pattern with ultra-letter-spacing | Small ALL-CAPS label above every section heading (e.g., "Sélection", "Notre Maison"). Signals editorial restraint — brand DNA. | LOW | Already partially implemented (`tracking-label` at 0.35em). Make this a consistent pattern on every section. |
| Ken Burns / slow drift on hero image | Hero image very slowly pans or zooms (CSS `animation: kenBurns 20s ease-in-out infinite`). Creates life without video cost. Much cheaper than drone footage. | LOW | Pure CSS. One keyframe. Huge premium visual impact. Recommended over video for this project. |
| Property card price in large serif | Price displayed in a larger, more refined type than the supporting specs. Creates a "jeweler's tag" visual hierarchy. | LOW | Currently already serif. Increase size contrast between price and specs slightly. |
| Thin-line ghost button style | Outlined buttons (1px border, no fill) with fill-on-hover. Signals restraint over urgency. Used by luxury brands universally. | LOW | Already the pattern. Make sure hover fill is buttery smooth (300–500ms ease). |
| Section asymmetry (text left, image right) | The about-teaser two-column is correct. Real luxury sites break from the "centered everything" pattern to create editorial rhythm. | LOW | Already implemented in about-teaser. Enforce this pattern consistently. |
| Footer with editorial richness | Premium footer has logo + tagline + nav columns + contact + small legal. Not just a copyright line. | MEDIUM | Current footer not seen in codebase — assess and upgrade if needed |
| WhatsApp button with pre-filled message | Instead of raw number, button opens WhatsApp with "Bonjour, je suis intéressé par..." prefilled. Removes friction entirely. | LOW | URL pattern: `https://wa.me/[number]?text=[encoded message]`. One-line change. |
| Staggered card grid animation on listings page | Cards appear with a 100ms stagger delay as they enter viewport. Not all at once — sequentially from top-left. | MEDIUM | Requires IntersectionObserver + CSS delay logic. Can be done without Framer Motion. |
| Image lazy-reveal with blur-up placeholder | Next.js Image handles this natively with `placeholder="blur"` + `blurDataURL`. Adds a sophisticated "focus-in" quality to image loading. | LOW | Verify existing cards use `placeholder="blur"`. Unsplash images need a static blurDataURL. |
| Smooth page transitions | Subtle fade between page navigations using Next.js App Router layout animation. Makes site feel like a native app, not a website. | HIGH | Requires `'use client'` wrapper + CSS/Framer Motion. Complex with App Router. Defer unless time allows — not worth breaking navigation for. |

### Anti-Features (Deliberately NOT Build)

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Autoplay video hero | "Cinematic" feel is trendy | Expensive to produce, kills mobile performance, Unsplash images can't provide it, adds bundle weight, accessibility concerns | Ken Burns CSS animation on still image achieves 80% of the effect at 0 extra cost |
| Heavy animation library (GSAP, full Framer Motion) | Perceived as the "pro" choice | Adds 30–80kb+ to client bundle; for this project's animation needs, CSS keyframes + IntersectionObserver + `motion/react` with LazyMotion cover everything needed | CSS animations for entrance; `motion/react` with `LazyMotion + domAnimation` if needed (reduces to ~4.6kb) |
| Parallax scrolling | Makes site feel dynamic | CSS `background-attachment: fixed` is broken on mobile Safari; JS parallax hammers main thread; for real estate the content is the property, not the scrolling effect | Scroll-triggered fade-in reveals achieve depth without parallax issues |
| Splash / loading screen | "Luxury" brands sometimes use them | Adds latency before user sees any content; Google penalizes LCP; feels dated post-2020; high-end sites abandoned these | First contentful paint should be instant — hero image loads fast with Next.js priority |
| Sticky search bar that transforms on scroll | Used by some agents (Avantgarde Properties example) | Eden Immobilier has 4 nav links, not a search-heavy product; search is on the /listings page; adding this pattern without a search-driven UX creates cognitive overhead | Keep nav clean and minimal; let /listings page handle filtering |
| Cursor replacement | Custom cursor is seen on luxury fashion sites | Works on desktop only; breaks mobile; requires significant JS; very hit-or-miss on "luxury" vs "gimmicky"; distracts from photography | The photography and typography should carry the premium feel — cursor tricks signal insecurity |
| Infinite scroll on listings | Feels "social media" and hides properties at the bottom | Pagination with clear numbers is more intentional and works better for high-ticket purchases where buyers want to feel in control | Standard grid with a "Voir plus" button or clean pagination |
| Glassmorphism cards | Trendy 2022-era design | Contrast failures on variable photo backgrounds; accessibility nightmare; looks dated; clashes with "quiet luxury" warm aesthetic | Solid card backgrounds (warm off-white or dark surface) with clear shadows and borders |
| Dark mode toggle | Some premium sites offer this | Eden Immobilier is committing to warm dark header / light body — a deliberate dual-zone design. A toggle adds complexity and breaks the intentional color story. | The contrast-aware dual-zone layout already handles the light/dark need without a toggle |
| Animated number counters ("15+ years", "500+ properties sold") | Common on agency "about" sections | Feels like a WordPress template trope; luxury brands trust copy, not animated statistics | Static numbers in elegant typography with surrounding context copy |

---

## Feature Dependencies

```
Warm color token system (Tailwind config overhaul)
    └──required-by──> All visual components (Navbar, PropertyCard, Footer, CTAs)
    └──required-by──> Gold accent consistency
    └──required-by──> Section background contrast (dark header/footer, light body)

Typography system (Montserrat or Outfit via next/font)
    └──required-by──> Eyebrow label pattern
    └──required-by──> Hero headline impact
    └──required-by──> Card title/price hierarchy

Ken Burns CSS animation
    └──requires──> Hero image element exists (already does)
    └──enhances──> Hero overall cinematic quality

Scroll-trigger reveal animations
    └──requires──> Color token system (so revealed components look correct)
    └──requires──> Component polish (no point revealing broken-looking cards)
    └──enhances──> Staggered card grid

WhatsApp floating button
    └──requires──> Gold color token (button should match brand)
    └──enhances──> Contact CTA (complements static contact page link)

Pre-filled WhatsApp message
    └──requires──> WhatsApp floating button

Mobile menu upgrade (full-screen or slide panel)
    └──requires──> Color token system (menu background must match brand)
    └──conflicts-with──> Current max-height animation approach (replace, don't layer)

Blur-up image placeholders
    └──requires──> Static blurDataURL values for Unsplash images (one-time setup)
    └──enhances──> Property card loading quality
```

### Dependency Notes

- **Color token system blocks everything else.** All component work assumes the correct palette exists. This must be Phase 1.
- **Typography system should accompany or immediately follow color tokens.** Font choices affect perceived spacing, so heading sizes and letter-spacing should be tuned once the font is set.
- **Scroll animations require components to look correct first.** Animating a broken component wastes the effect. Entrance animations are a Phase 2+ concern.
- **Ken Burns is independent and low-risk.** Can be added in the same pass as hero refinement — pure CSS, zero dependencies.
- **WhatsApp button is independent.** Can be added any time. Simple fixed-position component.

---

## MVP Definition

This is a design overhaul, not a feature launch. "MVP" here means: the minimum set of design features that transforms the site from "current dark, cluttered aesthetic" to "clearly premium."

### Launch With (v1 — Phase 1: Foundation)

- [ ] Warm color token system — all `eden.*` values replaced with the correct palette (dark header/footer, warm off-white body, gold `#C5A47E` range)
- [ ] Typography system — Montserrat or Outfit via `next/font`, replacing Playfair + DM Sans, with correct scale
- [ ] Contrast audit pass — fix all invisible text, ensure 4.5:1 minimum on all body copy
- [ ] Spacing normalization — consistent vertical rhythm across all sections
- [ ] Sticky navbar with transparent → backdrop-blur-solid scroll behavior refinement
- [ ] Gold ghost button hover states — fill transition 300ms ease
- [ ] WhatsApp floating button — gold-branded, fixed bottom-right, pre-filled message URL

### Add After Foundation (v1.x — Phase 2: Polish)

- [ ] Ken Burns CSS animation on hero image — trigger: Phase 1 hero is stable
- [ ] Animated scroll indicator (breathing pulse) — trigger: hero is finalized
- [ ] Eyebrow label pattern applied consistently to every section — trigger: typography system stable
- [ ] Mobile menu upgrade to full-screen overlay or slide panel — trigger: color system stable
- [ ] Blur-up image placeholder for property cards — trigger: Unsplash blurDataURL strings prepared
- [ ] Footer editorial upgrade — trigger: overall site color system is correct to reference

### Future Consideration (v2+ — Phase 3: Delight)

- [ ] Scroll-triggered reveal animations (fade-up on viewport enter) — nice, not critical for first premium impression
- [ ] Staggered card grid animation on listings page — after reveal system proven
- [ ] Page transition animations — high complexity with App Router; only if time budget allows

---

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Color token system overhaul | HIGH | LOW | P1 |
| Typography swap (Montserrat/Outfit) | HIGH | LOW | P1 |
| Contrast / visibility fixes | HIGH | LOW | P1 |
| WhatsApp floating button | HIGH | LOW | P1 |
| Navbar scroll behavior refinement | MEDIUM | LOW | P1 |
| Gold ghost button hover refinement | MEDIUM | LOW | P1 |
| Ken Burns hero animation | HIGH | LOW | P2 |
| Scroll indicator breathing animation | LOW | LOW | P2 |
| Mobile menu upgrade | MEDIUM | MEDIUM | P2 |
| Eyebrow label consistency | MEDIUM | LOW | P2 |
| Footer editorial upgrade | MEDIUM | MEDIUM | P2 |
| Blur-up image placeholders | MEDIUM | LOW | P2 |
| Scroll-trigger reveal animations | MEDIUM | MEDIUM | P3 |
| Staggered card grid animation | LOW | MEDIUM | P3 |
| Page transitions | LOW | HIGH | P3 |

**Priority key:**
- P1: Must have — this is what "premium" means for this site
- P2: Should have — adds real polish, reasonable effort
- P3: Nice to have — defer unless Phase 1+2 complete with time to spare

---

## Competitor Feature Analysis

Reference sites analyzed (Moroccan and French luxury real estate market context):

| Design Pattern | Generic Moroccan Agency Sites | French Luxury Peers (e.g. Barnes, Sotheby's FR) | Eden Target |
|----------------|-------------------------------|--------------------------------------------------|-------------|
| Color palette | Cold dark grays or gaudy color | Warm neutrals + black + gold | Warm charcoal + off-white + gold — correct direction |
| Hero | Static image, small | Full-bleed with video or editorial still | Full-bleed with Ken Burns still |
| Typography | Often Playfair + system sans | Clean geometric or humanist sans | Montserrat or Outfit — more modern than Playfair |
| Property cards | Info-dense, small images | Spacious, large image, minimal text below | Large image (h-72+), price prominent, specs secondary |
| Navigation | Cluttered dropdown menus | Clean minimal sticky nav | 4 links + CTA button — already correct |
| Mobile menu | Dropdown or broken | Full-screen overlay | Full-screen overlay upgrade |
| Contact method | Form-only | Form + phone | WhatsApp primary + contact page |
| Animations | None or janky | Subtle scroll reveals | CSS scroll triggers, no heavy libraries |
| Image gallery | Simple pagination | Lightbox with filmstrip | Existing `ImageGallery` component — needs visual refinement only |

---

## Implementation Notes (Stack-Specific)

Given the existing stack: Next.js 14 App Router + React 18 + Tailwind CSS 3.4 + TypeScript:

**Color tokens:** Replace the `eden.*` palette in `tailwind.config.ts`. All components already use semantic token names — this propagates everywhere automatically with zero component edits.

**Typography:** Use `next/font/google` with `Montserrat` or `Outfit`. Set in `app/layout.tsx` as CSS variables. Update `tailwind.config.ts` `fontFamily.sans`. Takes 10 minutes.

**Ken Burns:** Pure CSS `@keyframes` in `globals.css`. Apply `animate-ken-burns` to the hero `<Image>` wrapper. Zero JS.

**Scroll reveal:** Use `IntersectionObserver` in a `useInView` hook or a `data-animate` + CSS approach. No Framer Motion needed for simple fade-up reveals. Keeps bundle lean.

**WhatsApp button:** One new `WhatsAppButton` client component. Fixed position, z-50, bottom-right. `href="https://wa.me/[number]?text=[encoded]"`.

**Mobile menu:** Change the current `max-height` expansion to a `translate-x` or opacity/scale full-screen overlay. Stays within the existing `Navbar.tsx` component — just update the animation approach.

---

## Sources

- [7 Luxury Real Estate Website Design Trends Dominating 2026](https://www.dmrmedia.org/blog/Real-Estate-Website-Design-Trends) — Trends verified
- [Luxury Real Estate Website Design – 50 Exquisite Examples](https://mediaboom.com/news/luxury-real-estate-website-design/) — Pattern catalog
- [7 Key Elements of Luxury Website Design in 2025](https://www.ambrosemarketing.com/blog/7-essential-elements-of-luxury-website-design-in-2025) — Design principles
- [Brand Fonts & Typography in Real Estate](https://www.luxurypresence.com/blogs/brand-fonts-real-estate-website/) — Typography guidance
- [7 luxury brand websites to inspire your next high-end project](https://webflow.com/blog/luxury-brand-websites) — Navigation and interaction patterns
- [Framer Motion + Tailwind: The 2025 Animation Stack](https://dev.to/manukumar07/framer-motion-tailwind-the-2025-animation-stack-1801) — Animation stack guidance
- [Reduce bundle size of Framer Motion](https://motion.dev/docs/react-reduce-bundle-size) — Bundle considerations
- [Crafting Compelling Real Estate CTAs](https://www.luxurypresence.com/blogs/call-to-action-real-estate-cta/) — CTA patterns

---

*Feature research for: Luxury real estate visual/UX design overhaul*
*Researched: 2026-04-07*
*Stack: Next.js 14 + Tailwind CSS 3.4 + TypeScript*
