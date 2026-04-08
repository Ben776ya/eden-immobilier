<!-- GSD:project-start source:PROJECT.md -->
## Project

**Eden Immobilier — Design Overhaul**

A complete visual redesign of the Eden Immobilier luxury real estate website. The site structure, pages, and functionality remain intact — the goal is to replace the current dark, cluttered aesthetic with a premium, warm luxury design that feels polished on both desktop and mobile.

**Core Value:** The site must look and feel premium — every element should reinforce trust and luxury so potential buyers take the agency seriously.

### Constraints

- **Tech stack**: Keep Next.js 14 + Tailwind CSS + TypeScript — no framework changes
- **Structure**: Preserve all existing routes, pages, and component hierarchy
- **Data**: No changes to `data/listings.ts` or `types/listing.ts`
- **Admin**: Admin panel is out of scope for this redesign
<!-- GSD:project-end -->

<!-- GSD:stack-start source:codebase/STACK.md -->
## Technology Stack

## Languages
- TypeScript 5.x - All application code (`.ts`, `.tsx`)
- CSS - Global styles via `app/globals.css`
## Runtime
- Node.js (LTS) — inferred from `@types/node ^20`
- npm
- Lockfile: `package-lock.json` present
## Frameworks
- Next.js 14.2.35 — Full-stack React framework, App Router, server and client components
- React 18.x — UI component library
- TypeScript compiler (`tsc`) — via Next.js build pipeline, `noEmit: true`
- PostCSS 8.x — CSS processing, configured in `postcss.config.mjs` (Tailwind plugin only)
- Tailwind CSS 3.4.1 — Utility-first CSS framework
- Not detected — no test runner, no test files found
## Key Dependencies
- `next` 14.2.35 — Provides routing (App Router), image optimization, font loading, ESLint config
- `react` ^18 — Component model and hooks (`useState`, `useEffect`, `useContext`, `useCallback`)
- `react-dom` ^18 — DOM rendering
- `tailwindcss` ^3.4.1 — Design system via custom `eden.*` color tokens defined in `tailwind.config.ts`
- `postcss` ^8 — Required peer for Tailwind CSS processing
- `typescript` ^5
- `@types/node` ^20
- `@types/react` ^18
- `@types/react-dom` ^18
- `eslint` ^8
- `eslint-config-next` 14.2.35
## Configuration
- `strict: true`
- Module resolution: `bundler`
- Path alias: `@/*` → `./*` (project root)
- Plugins: `next` (type generation for App Router)
- Incremental compilation enabled
- Content: `app/**/*`, `components/**/*`, `contexts/**/*`
- Custom color palette: `eden.bg`, `eden.surface`, `eden.burgundy`, `eden.gold`, `eden.gold-light`, `eden.cream`, `eden.muted`, `eden.border`, `eden.border-light`
- Custom fonts: `--font-playfair` (Playfair Display), `--font-dm-sans` (DM Sans)
- Custom letter-spacing: `label` (0.35em)
- No Tailwind plugins
- Extends: `next/core-web-vitals`, `next/typescript`
- Image remote patterns: `https://images.unsplash.com` (only approved external image host)
- Plugins: `tailwindcss` only
## Platform Requirements
- Node.js 20+
- npm (lock file committed)
- `npm run dev` → `next dev`
- `npm run lint` → `next lint`
- `npm run build` → `next build`
- `npm run start` → `next start`
- Deployment target: any Node.js host supporting Next.js 14 (Vercel, self-hosted)
- No containerisation config detected (no Dockerfile)
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

## Naming Patterns
- React components: PascalCase matching the default export name — `PropertyCard.tsx`, `FilterBar.tsx`, `ImageGallery.tsx`
- Next.js pages: lowercase `page.tsx` per App Router convention — `app/page.tsx`, `app/listings/page.tsx`
- Next.js layouts: lowercase `layout.tsx` — `app/layout.tsx`, `app/admin/layout.tsx`
- Data modules: camelCase — `data/listings.ts`
- Type modules: camelCase, singular noun — `types/listing.ts`
- Admin components grouped in subdirectory: `components/admin/AdminProvider.tsx`
- React components: PascalCase — `PropertyCard`, `ListingForm`, `AdminProvider`
- Event handlers: `handle` prefix + noun — `handleSubmit`
- Utility/helper functions: camelCase verb+noun — `formatPrice`, `closeMenu`
- Custom hooks: `use` prefix — `useAdmin`
- Inner helper components: PascalCase — `PasswordGate` (defined inside same file when only used there)
- camelCase throughout — `menuOpen`, `scrolled`, `activeIndex`, `lightboxOpen`
- Boolean state: descriptive adjective/past-participle — `isAuthenticated`, `submitted`, `menuOpen`
- Derived/computed values: noun that describes the result — `featured`, `filtered`
- CSS class string constants: `camelCase` with `Class` suffix — `inputClass`, `labelClass`, `selectClass`
- Interfaces for prop types: PascalCase component name + `Props` suffix — `PropertyCardProps`, `FilterBarProps`, `ImageGalleryProps`
- Interfaces for context: PascalCase + `ContextValue` suffix — `AdminContextValue`
- Interfaces for domain data: PascalCase noun — `Filters`, `Listing`
- Type aliases via `interface` (not `type`) for objects throughout
## Code Style
- No Prettier config present — formatting is enforced by ESLint + Next.js rules
- Single quotes for strings in TypeScript/TSX
- No semicolons at end of statements (except inline JSX event handlers)
- 2-space indentation
- Trailing commas in multi-line object/array literals
- ESLint config: `next/core-web-vitals` + `next/typescript` (`/.eslintrc.json`)
- TypeScript strict mode enabled (`tsconfig.json` has `"strict": true`)
- No additional custom rules beyond Next.js defaults
## Import Organization
- `@/*` maps to project root — used universally for all internal imports
- Example: `import { listings } from '@/data/listings'`, `import PropertyCard from '@/components/PropertyCard'`
- Never use relative paths (`../../`) — always use `@/` alias
## Component Patterns
- Add `'use client'` directive only when component uses browser APIs, React state/effects, or Next.js client hooks
- Client components: `Navbar`, `FilterBar`, `ImageGallery`, `ListingForm`, `AdminProvider`, `AdminShell`, `AdminTable`, all `'use client'` pages
- Server components (no directive): `Footer`, `PropertyCard`, `SpecsGrid`, layout pages, static pages (`about`, `listings/[id]`)
- Pages using `useState`/`useMemo` explicitly add `'use client'` — `app/listings/page.tsx`, `app/contact/page.tsx`
## Context Pattern
## Error Handling
- Use `notFound()` from Next.js for missing data in server components — `app/listings/[id]/page.tsx` calls `if (!listing) notFound()`
- Context guard: throw descriptive error when hook is used outside its provider — `useAdmin`
- Form validation: HTML5 native `required` attribute on inputs; no client-side JS validation library
- Form submission: mock only — `handleSubmit` calls `e.preventDefault()` and sets state without network calls
- Admin auth failure: set boolean `error` state and display inline error message
## Formatting / Display Utilities
## Logging
- No logging library used
- No `console.log` statements in source
- Errors are surfaced via UI state, not logged
## Comments
- Section dividers in JSX: inline `{/* Section Name */}` comments mark logical sections — `{/* Hero */}`, `{/* Featured Listings */}`
- CSS: comments explain intent — `/* Entrance animations — ease-out-quart for natural deceleration */`, `/* Respect reduced motion preferences */`
- No JSDoc/TSDoc on any functions or components
- No inline code comments explaining business logic
## Tailwind Usage
- `text-eden-gold`, `bg-eden-bg`, `border-eden-border`, `text-eden-muted`, `text-eden-cream`
## Module Exports
- Default export for every component file — one component per file
- Named exports for non-component entities in the same file — e.g., `export interface Filters` in `components/FilterBar.tsx`, `export function useAdmin` in `components/admin/AdminProvider.tsx`
- No barrel `index.ts` files — import directly from file paths
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

## Pattern Overview
- All data is static: a single in-memory array in `data/listings.ts` acts as the data source with no backend or database
- Pages default to React Server Components (RSC); `'use client'` is added only when interactivity is required
- The admin section is a fully client-side feature area using React Context for ephemeral state; changes reset on page reload
- Static generation is used for listing detail pages via `generateStaticParams`
## Layers
- Purpose: Holds all property data as a typed static array
- Location: `data/listings.ts`
- Contains: Hardcoded `Listing[]` array (8 properties) typed against `types/listing.ts`
- Depends on: `types/listing.ts`
- Used by: All pages and admin components that need listing data
- Purpose: Shared TypeScript interfaces
- Location: `types/listing.ts`
- Contains: `Listing` interface with all property fields and discriminated union types for `type`, `status`
- Depends on: Nothing
- Used by: Everything that touches listing data
- Purpose: Route handlers — renders pages and defines URL structure
- Location: `app/`
- Contains: `page.tsx` files for each route, `layout.tsx` for root and admin shells
- Depends on: `data/listings.ts`, `types/listing.ts`, `components/`
- Used by: Next.js router
- Purpose: Reusable UI elements consumed by pages
- Location: `components/` (public-facing) and `components/admin/` (admin-only)
- Contains: Display components (`PropertyCard`, `ImageGallery`, `SpecsGrid`, `FilterBar`), layout components (`Navbar`, `Footer`), admin components (`AdminProvider`, `AdminShell`, `AdminTable`, `ListingForm`)
- Depends on: `types/listing.ts`
- Used by: Pages
- Purpose: Runtime state management for the admin CRUD interface
- Location: `components/admin/AdminProvider.tsx`
- Contains: React Context providing `listings`, `addListing`, `updateListing`, `deleteListing`, `login`, `logout`, `isAuthenticated`
- Depends on: `data/listings.ts` (seeds initial state), `types/listing.ts`
- Used by: All `components/admin/` components and `app/admin/**` pages
## Data Flow
- Public pages: no persistent state; filter state is local to `app/listings/page.tsx`
- Admin section: ephemeral React Context in `AdminProvider`; all mutations are lost on reload
## Key Abstractions
- Purpose: Single source of truth for property shape across all layers
- File: `types/listing.ts`
- Pattern: TypeScript interface with discriminated union literals for `type` and `status`
- Purpose: Provides admin state and CRUD operations to the entire `/admin` subtree
- File: `components/admin/AdminProvider.tsx`
- Pattern: React Context + `useContext` hook (`useAdmin()`) — context is null-guarded; throws if used outside provider
- Purpose: Reusable listing card used on both the home page (featured) and the full listings page
- File: `components/PropertyCard.tsx`
- Pattern: Pure display component accepting a `Listing` prop; renders as a `<Link>` wrapping a card
- Purpose: Layout wrapper that gates admin content behind `PasswordGate` when unauthenticated
- File: `components/admin/AdminShell.tsx`
- Pattern: Conditional render — renders `<PasswordGate />` if `!isAuthenticated`, otherwise renders sidebar layout with `children`
## Entry Points
- Location: `app/layout.tsx`
- Triggers: Every page request
- Responsibilities: Sets HTML lang, applies Google Fonts via CSS variables, renders `<Navbar>` and `<Footer>` around all page content
- Location: `app/admin/layout.tsx`
- Triggers: Any request to `/admin/**`
- Responsibilities: Wraps subtree in `AdminProvider` and `AdminShell`; does NOT inherit the public `Navbar`/`Footer` (AdminShell renders its own layout)
- Location: `app/page.tsx`
- Triggers: Request to `/`
- Responsibilities: Renders hero, featured listings grid (filtered to `featured: true`), about teaser, contact CTA
- Location: `app/listings/page.tsx`
- Triggers: Request to `/listings`
- Responsibilities: Client component; renders filterable grid of all listings using local filter state
- Location: `app/listings/[id]/page.tsx`
- Triggers: Request to `/listings/[id]`
- Responsibilities: Server component; statically generated; looks up listing by ID, renders gallery and detail layout
## Error Handling
- `notFound()` is called in `app/listings/[id]/page.tsx` when a listing ID does not match
- Admin edit page (`app/admin/listings/[id]/page.tsx`) renders an inline "Propriété introuvable" message instead of using `notFound()`
- Contact form and admin `ListingForm` use HTML5 `required` attributes for basic client-side validation; no server-side validation exists
- No error boundaries defined in the codebase
## Cross-Cutting Concerns
<!-- GSD:architecture-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd:quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd:debug` for investigation and bug fixing
- `/gsd:execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->



<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd:profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
