# Architecture

**Analysis Date:** 2026-04-07

## Pattern Overview

**Overall:** Next.js App Router — Static-first with client islands

**Key Characteristics:**
- All data is static: a single in-memory array in `data/listings.ts` acts as the data source with no backend or database
- Pages default to React Server Components (RSC); `'use client'` is added only when interactivity is required
- The admin section is a fully client-side feature area using React Context for ephemeral state; changes reset on page reload
- Static generation is used for listing detail pages via `generateStaticParams`

## Layers

**Data Layer:**
- Purpose: Holds all property data as a typed static array
- Location: `data/listings.ts`
- Contains: Hardcoded `Listing[]` array (8 properties) typed against `types/listing.ts`
- Depends on: `types/listing.ts`
- Used by: All pages and admin components that need listing data

**Type Definitions:**
- Purpose: Shared TypeScript interfaces
- Location: `types/listing.ts`
- Contains: `Listing` interface with all property fields and discriminated union types for `type`, `status`
- Depends on: Nothing
- Used by: Everything that touches listing data

**Page Layer (App Router):**
- Purpose: Route handlers — renders pages and defines URL structure
- Location: `app/`
- Contains: `page.tsx` files for each route, `layout.tsx` for root and admin shells
- Depends on: `data/listings.ts`, `types/listing.ts`, `components/`
- Used by: Next.js router

**Component Layer:**
- Purpose: Reusable UI elements consumed by pages
- Location: `components/` (public-facing) and `components/admin/` (admin-only)
- Contains: Display components (`PropertyCard`, `ImageGallery`, `SpecsGrid`, `FilterBar`), layout components (`Navbar`, `Footer`), admin components (`AdminProvider`, `AdminShell`, `AdminTable`, `ListingForm`)
- Depends on: `types/listing.ts`
- Used by: Pages

**State Layer (Admin only):**
- Purpose: Runtime state management for the admin CRUD interface
- Location: `components/admin/AdminProvider.tsx`
- Contains: React Context providing `listings`, `addListing`, `updateListing`, `deleteListing`, `login`, `logout`, `isAuthenticated`
- Depends on: `data/listings.ts` (seeds initial state), `types/listing.ts`
- Used by: All `components/admin/` components and `app/admin/**` pages

## Data Flow

**Public Listing Browse:**
1. `app/listings/page.tsx` imports `listings` array directly from `data/listings.ts`
2. Page holds filter state (`useState`) and derives `filtered` array with `useMemo`
3. `FilterBar` component receives `filters` + `onChange` callback; user input updates state in page
4. `PropertyCard` components render each filtered listing; each links to `/listings/[id]`

**Listing Detail (Static):**
1. `generateStaticParams` in `app/listings/[id]/page.tsx` maps all listing IDs at build time
2. At request time, `params.id` is matched against the static `listings` array
3. On no match, `notFound()` is called to return 404
4. `ImageGallery` and `SpecsGrid` receive listing fields as props

**Admin CRUD Flow:**
1. `app/admin/layout.tsx` wraps all admin routes in `AdminProvider` then `AdminShell`
2. `AdminProvider` seeds its local `useState` from `data/listings.ts` and exposes mutation functions via context
3. `AdminShell` checks `isAuthenticated`; if false, renders `PasswordGate` instead of children
4. Authentication is a plain password check against the hardcoded string `'eden2024'`; session stored in `sessionStorage`
5. Admin pages (`page.tsx` files) call `useAdmin()` to get listings and mutation functions
6. `ListingForm` calls `onSave(listing)` which is wired to `addListing` or `updateListing` in the calling page
7. After save, `router.push('/admin')` redirects back to the dashboard

**State Management:**
- Public pages: no persistent state; filter state is local to `app/listings/page.tsx`
- Admin section: ephemeral React Context in `AdminProvider`; all mutations are lost on reload

## Key Abstractions

**`Listing` Interface:**
- Purpose: Single source of truth for property shape across all layers
- File: `types/listing.ts`
- Pattern: TypeScript interface with discriminated union literals for `type` and `status`

**`AdminProvider` Context:**
- Purpose: Provides admin state and CRUD operations to the entire `/admin` subtree
- File: `components/admin/AdminProvider.tsx`
- Pattern: React Context + `useContext` hook (`useAdmin()`) — context is null-guarded; throws if used outside provider

**`PropertyCard` Component:**
- Purpose: Reusable listing card used on both the home page (featured) and the full listings page
- File: `components/PropertyCard.tsx`
- Pattern: Pure display component accepting a `Listing` prop; renders as a `<Link>` wrapping a card

**`AdminShell` Component:**
- Purpose: Layout wrapper that gates admin content behind `PasswordGate` when unauthenticated
- File: `components/admin/AdminShell.tsx`
- Pattern: Conditional render — renders `<PasswordGate />` if `!isAuthenticated`, otherwise renders sidebar layout with `children`

## Entry Points

**Root Layout:**
- Location: `app/layout.tsx`
- Triggers: Every page request
- Responsibilities: Sets HTML lang, applies Google Fonts via CSS variables, renders `<Navbar>` and `<Footer>` around all page content

**Admin Layout:**
- Location: `app/admin/layout.tsx`
- Triggers: Any request to `/admin/**`
- Responsibilities: Wraps subtree in `AdminProvider` and `AdminShell`; does NOT inherit the public `Navbar`/`Footer` (AdminShell renders its own layout)

**Home Page:**
- Location: `app/page.tsx`
- Triggers: Request to `/`
- Responsibilities: Renders hero, featured listings grid (filtered to `featured: true`), about teaser, contact CTA

**Listings Index:**
- Location: `app/listings/page.tsx`
- Triggers: Request to `/listings`
- Responsibilities: Client component; renders filterable grid of all listings using local filter state

**Listing Detail:**
- Location: `app/listings/[id]/page.tsx`
- Triggers: Request to `/listings/[id]`
- Responsibilities: Server component; statically generated; looks up listing by ID, renders gallery and detail layout

## Error Handling

**Strategy:** Minimal — primarily relies on Next.js built-ins

**Patterns:**
- `notFound()` is called in `app/listings/[id]/page.tsx` when a listing ID does not match
- Admin edit page (`app/admin/listings/[id]/page.tsx`) renders an inline "Propriété introuvable" message instead of using `notFound()`
- Contact form and admin `ListingForm` use HTML5 `required` attributes for basic client-side validation; no server-side validation exists
- No error boundaries defined in the codebase

## Cross-Cutting Concerns

**Logging:** None — no logging library or instrumentation present
**Validation:** HTML5 form `required` attributes only; no schema validation (Zod, Yup, etc.)
**Authentication:** Password-gate only; hardcoded password `'eden2024'` in `AdminProvider`; session via `sessionStorage`; no real auth provider

---

*Architecture analysis: 2026-04-07*
