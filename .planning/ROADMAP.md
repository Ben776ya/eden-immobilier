# Roadmap: Eden Immobilier — Design Overhaul

## Overview

The redesign proceeds in five phases: establish the design foundation (tokens and typography), rebuild the structural chrome (nav and footer), polish the core product display (property cards), layer in motion and interactions, then close with WhatsApp contact integration and final visual polish. Each phase is verifiable on its own before the next begins.

## Phases

- [ ] **Phase 1: Design Foundation** - Replace color tokens and typography system-wide
- [ ] **Phase 2: Navigation & Footer** - Rebuild structural chrome with premium dark bookends
- [ ] **Phase 3: Property Cards & Listings** - Polish the core property display surface
- [ ] **Phase 4: Motion & Interactions** - Layer scroll animations, hero motion, and micro-interactions
- [ ] **Phase 5: WhatsApp & Visual Polish** - Floating contact button and final cross-cutting finish

## Phase Details

### Phase 1: Design Foundation
**Goal**: The design token and typography foundation is replaced so every component renders with the correct palette and typeface
**Depends on**: Nothing (first phase)
**Requirements**: CLR-01, CLR-02, CLR-03, CLR-04, CLR-05, TYP-01, TYP-02, TYP-03
**Success Criteria** (what must be TRUE):
  1. The site renders with dark header/footer (#1C1917) and warm light body (#FAFAF8) — no legacy dark backgrounds bleed into content areas
  2. Gold accents (#C5A47E) appear on decorative elements; a darker gold variant is used for readable text on light backgrounds
  3. All body text, headings, and labels use Outfit — no Playfair Display or DM Sans fonts remain visible
  4. All text/background combinations pass WCAG AA (4.5:1 contrast) — no invisible or unreadable text anywhere on the site
**Plans**: 2 plans
Plans:
- [x] 01-01-PLAN.md — Install tailwindcss-motion, replace tailwind.config.ts tokens, swap font loading to Outfit, update globals.css base layer
- [x] 01-02-PLAN.md — Build verification and visual font rendering checkpoint
**UI hint**: yes

### Phase 2: Navigation & Footer
**Goal**: The navigation and footer communicate premium quality and work flawlessly on all screen sizes
**Depends on**: Phase 1
**Requirements**: NAV-01, NAV-02, NAV-03, FTR-01, FTR-02
**Success Criteria** (what must be TRUE):
  1. The navbar is transparent over the hero image and transitions to a solid glass-blur bar on scroll — no jarring jump
  2. On mobile, the menu opens as a full-screen overlay or smooth slide panel (not the old max-height dropdown) with 60fps animation
  3. The footer shows logo, tagline, navigation columns, contact info, and legal text on a dark surface that visually matches the header
**Plans**: TBD
**UI hint**: yes

### Phase 3: Property Cards & Listings
**Goal**: Property cards on the listings page present properties with polish and confidence
**Depends on**: Phase 2
**Requirements**: CRD-01, CRD-02, CRD-03, CRD-04
**Success Criteria** (what must be TRUE):
  1. Hovering a card produces a smooth image zoom (scale ~1.05, 600-800ms) and a dark gradient overlay fades in over the photo
  2. Cards use warm off-white backgrounds with clear drop shadows — they read cleanly against the light page body
  3. On the listings page, cards animate in with a staggered entrance (100ms delay per card) as they scroll into view
**Plans**: TBD
**UI hint**: yes

### Phase 4: Motion & Interactions
**Goal**: The site feels alive and cinematic through tasteful, performant animation
**Depends on**: Phase 3
**Requirements**: MOT-01, MOT-02, MOT-03, MOT-04
**Success Criteria** (what must be TRUE):
  1. Page sections fade up into view as the user scrolls down — no section snaps in instantly
  2. The hero image has a slow Ken Burns pan/zoom that plays on load, giving the site a cinematic opening
  3. Ghost (outlined) buttons fill smoothly on hover with a 300-500ms ease — no instant color swap
  4. All animations are implemented with CSS or tailwindcss-motion — no GSAP, full Framer Motion, or heavy JS animation libraries appear in the bundle
**Plans**: TBD
**UI hint**: yes

### Phase 5: WhatsApp & Visual Polish
**Goal**: The site is fully finished — a persistent contact affordance is in place and every page has consistent editorial polish
**Depends on**: Phase 4
**Requirements**: WHA-01, WHA-02, WHA-03, POL-01, POL-02, POL-03, POL-04
**Success Criteria** (what must be TRUE):
  1. A gold WhatsApp button is visible in the bottom-right corner on every page and every scroll position — tapping it opens WhatsApp with a pre-filled French message
  2. The button has a subtle pulse animation when idle that draws the eye without being intrusive
  3. Every section heading is preceded by a small ALL-CAPS ultra-tracked eyebrow label and followed by a gold decorative rule — consistently across all pages
  4. Property images load with a blur-up placeholder before the full image arrives — no layout shift or blank boxes
  5. All page sections have generous, consistent vertical spacing — no cramped or inconsistently padded areas remain
**Plans**: TBD
**UI hint**: yes

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4 -> 5

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Design Foundation | 1/2 | In Progress|  |
| 2. Navigation & Footer | 0/TBD | Not started | - |
| 3. Property Cards & Listings | 0/TBD | Not started | - |
| 4. Motion & Interactions | 0/TBD | Not started | - |
| 5. WhatsApp & Visual Polish | 0/TBD | Not started | - |
