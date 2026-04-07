# Requirements: Eden Immobilier — Design Overhaul

**Defined:** 2026-04-08
**Core Value:** The site must look and feel premium — every element should reinforce trust and luxury

## v1 Requirements

### Color System

- [ ] **CLR-01**: Full palette replacement — dark header/footer (#1C1917), warm light body (#FAFAF8), gold accents (#C5A47E)
- [ ] **CLR-02**: Two-layer token system — primitive color values + semantic token names in Tailwind config
- [ ] **CLR-03**: Dual-role gold tokens — decorative gold for borders/dividers, darker gold for text on light backgrounds
- [ ] **CLR-04**: Section contrast zones — dark bookend sections (nav/footer) with warm light content areas
- [ ] **CLR-05**: All text passes WCAG AA contrast ratios (4.5:1 minimum) on their respective backgrounds

### Typography

- [ ] **TYP-01**: Replace Playfair Display + DM Sans with Outfit via next/font/google (self-hosted, zero FOUT)
- [ ] **TYP-02**: Consistent typographic scale — headings feel family-related, body 16-18px, labels ultra-tracked
- [ ] **TYP-03**: All font weights loaded: 300 (light), 400 (regular), 500 (medium), 600 (semibold)

### Navigation

- [ ] **NAV-01**: Sticky navbar — transparent on hero, solid with backdrop-blur glass effect on scroll
- [ ] **NAV-02**: Mobile menu — full-screen overlay or slide panel (replace current max-height dropdown)
- [ ] **NAV-03**: Mobile menu uses transform-based animation (not max-height) for 60fps performance

### Footer

- [ ] **FTR-01**: Editorial footer with logo, tagline, navigation columns, contact info, and legal text
- [ ] **FTR-02**: Footer uses dark surface color consistent with header for visual bookend effect

### Property Cards

- [ ] **CRD-01**: Polished hover effect — subtle image zoom (scale 1.05, 600-800ms ease-out)
- [ ] **CRD-02**: Dark gradient overlay on card image hover
- [ ] **CRD-03**: Cards appear with staggered animation (100ms delay) as they enter viewport on listings page
- [ ] **CRD-04**: Cards use warm off-white background with clear shadows on light body sections

### Interactions & Motion

- [ ] **MOT-01**: Scroll-triggered reveal animations — sections fade-up as they enter viewport
- [ ] **MOT-02**: Ken Burns CSS animation — hero image slow pan/zoom for cinematic feel
- [ ] **MOT-03**: Ghost button style — outlined with smooth fill-on-hover (300-500ms ease)
- [ ] **MOT-04**: All animations are CSS-only or use tailwindcss-motion plugin (no heavy JS libraries)

### WhatsApp

- [ ] **WHA-01**: Floating WhatsApp button — bottom-right, always visible on scroll
- [ ] **WHA-02**: Pre-filled WhatsApp message in French ("Bonjour, je suis intéressé par...")
- [ ] **WHA-03**: Button styled with gold brand accent and subtle pulse animation on idle

### Visual Polish

- [ ] **POL-01**: Eyebrow labels — small ALL-CAPS ultra-tracked labels above section headings consistently
- [ ] **POL-02**: Gold decorative horizontal rules under section headings consistently
- [ ] **POL-03**: Blur-up image placeholders using Next.js Image placeholder="blur"
- [ ] **POL-04**: Consistent generous spacing between all page sections

## v2 Requirements

### Advanced Animation

- **ANI-01**: Smooth page transitions between routes (fade/slide)
- **ANI-02**: Animated scroll indicator below hero (breathing pulse)

### Image Enhancement

- **IMG-01**: Image lazy-reveal with custom blur-up placeholder URLs for Unsplash images

### Spacing System

- **SPC-01**: Full spacing audit and consistent vertical rhythm system

## Out of Scope

| Feature | Reason |
|---------|--------|
| Autoplay video hero | Performance cost, production cost, Ken Burns achieves 80% of the effect |
| Parallax scrolling | Broken on mobile Safari, jank on mobile devices |
| Dark mode toggle | Dual-zone design (dark header/light body) is intentional — toggle would break it |
| Splash/loading screen | Adds latency, Google penalizes LCP, feels dated |
| Custom cursor | Desktop-only, distracts from photography, signals insecurity |
| Animated number counters | WordPress template trope, luxury brands trust copy not gimmicks |
| Glassmorphism cards | Contrast failures, dated, clashes with quiet luxury aesthetic |
| Infinite scroll on listings | High-ticket buyers want control, not social media patterns |
| Heavy animation libraries (GSAP, full Framer Motion) | 30-80kb+ bundle; CSS + tailwindcss-motion covers all needs |
| Admin panel redesign | Focus is public-facing site only |
| Structural/route changes | Structure is already good |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| CLR-01 | Pending | Pending |
| CLR-02 | Pending | Pending |
| CLR-03 | Pending | Pending |
| CLR-04 | Pending | Pending |
| CLR-05 | Pending | Pending |
| TYP-01 | Pending | Pending |
| TYP-02 | Pending | Pending |
| TYP-03 | Pending | Pending |
| NAV-01 | Pending | Pending |
| NAV-02 | Pending | Pending |
| NAV-03 | Pending | Pending |
| FTR-01 | Pending | Pending |
| FTR-02 | Pending | Pending |
| CRD-01 | Pending | Pending |
| CRD-02 | Pending | Pending |
| CRD-03 | Pending | Pending |
| CRD-04 | Pending | Pending |
| MOT-01 | Pending | Pending |
| MOT-02 | Pending | Pending |
| MOT-03 | Pending | Pending |
| MOT-04 | Pending | Pending |
| WHA-01 | Pending | Pending |
| WHA-02 | Pending | Pending |
| WHA-03 | Pending | Pending |
| POL-01 | Pending | Pending |
| POL-02 | Pending | Pending |
| POL-03 | Pending | Pending |
| POL-04 | Pending | Pending |

**Coverage:**
- v1 requirements: 28 total
- Mapped to phases: 0
- Unmapped: 28 ⚠️

---
*Requirements defined: 2026-04-08*
*Last updated: 2026-04-08 after initial definition*
