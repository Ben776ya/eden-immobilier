# Eden Immobilier — Design Overhaul

## What This Is

A complete visual redesign of the Eden Immobilier luxury real estate website. The site structure, pages, and functionality remain intact — the goal is to replace the current dark, cluttered aesthetic with a premium, warm luxury design that feels polished on both desktop and mobile.

## Core Value

The site must look and feel premium — every element should reinforce trust and luxury so potential buyers take the agency seriously.

## Requirements

### Validated

- ✓ Property listings page with filtering — existing
- ✓ Property detail pages with image gallery and specs — existing
- ✓ Home page with hero, featured listings, about section, contact CTA — existing
- ✓ Admin CRUD interface with password-gated access — existing
- ✓ Static data layer with typed listing model — existing
- ✓ Responsive layout structure — existing

### Active

- [ ] Premium color system: dark header/footer, light body sections, gold accents (#C5A47E)
- [ ] Refined sans-serif typography (Montserrat, Outfit, or similar)
- [ ] Fix all overlapping elements and invisible text / poor contrast
- [ ] Consistent spacing and visual breathing room across all pages
- [ ] Floating WhatsApp button (bottom-right, always visible on scroll)
- [ ] Mobile-optimized touch targets and readable text at all breakpoints
- [ ] Cohesive component styling (cards, buttons, forms, navigation)

### Out of Scope

- Structural changes to pages or routes — structure is good as-is
- Backend/database integration — static data layer stays
- New pages or sections — redesign only
- Admin panel redesign — focus is on public-facing site
- SEO or performance optimization — separate concern

## Context

- **Existing stack:** Next.js 14 (App Router), React 18, Tailwind CSS 3.4, TypeScript
- **Current design tokens:** Custom `eden.*` color palette in Tailwind config (too dark, needs full replacement)
- **Current fonts:** Playfair Display + DM Sans (user wants refined sans-serif instead)
- **Currency:** MAD (Moroccan Dirham)
- **Language:** French (site content)
- **Images:** Unsplash remote images via Next.js Image
- **Pain points:** Elements overlap, text invisible against dark backgrounds, font feels unrefined, overall not premium enough

## Constraints

- **Tech stack**: Keep Next.js 14 + Tailwind CSS + TypeScript — no framework changes
- **Structure**: Preserve all existing routes, pages, and component hierarchy
- **Data**: No changes to `data/listings.ts` or `types/listing.ts`
- **Admin**: Admin panel is out of scope for this redesign

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Warm luxury with contrast (dark header/footer, light body) | User wants depth without the current "too dark" problem | — Pending |
| Gold accents (#C5A47E range) | Classic luxury signifier, pairs well with warm neutrals | — Pending |
| Refined sans-serif (Montserrat/Outfit) over current Playfair + DM Sans | User wants "chic" not "editorial" — sans-serif feels more modern luxury | — Pending |
| WhatsApp as primary contact method | User's target market prefers WhatsApp; floating button for constant access | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd:transition`):
1. Requirements invalidated? Move to Out of Scope with reason
2. Requirements validated? Move to Validated with phase reference
3. New requirements emerged? Add to Active
4. Decisions to log? Add to Key Decisions
5. "What This Is" still accurate? Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-04-07 after initialization*
