# Codebase Structure

**Analysis Date:** 2026-04-07

## Directory Layout

```
eden-immobilier/
├── app/                    # Next.js App Router — all routes and layouts
│   ├── layout.tsx          # Root layout (Navbar, Footer, fonts, globals)
│   ├── page.tsx            # Home page (/)
│   ├── globals.css         # Global styles, Tailwind directives, animations
│   ├── favicon.ico
│   ├── fonts/              # Local font assets (if any)
│   ├── about/
│   │   └── page.tsx        # About page (/about)
│   ├── contact/
│   │   └── page.tsx        # Contact page with form (/contact)
│   ├── listings/
│   │   ├── page.tsx        # Filterable listings index (/listings)
│   │   └── [id]/
│   │       └── page.tsx    # Listing detail, statically generated (/listings/[id])
│   └── admin/
│       ├── layout.tsx      # Admin sub-layout (AdminProvider + AdminShell)
│       ├── page.tsx        # Admin dashboard — listings table (/admin)
│       └── listings/
│           ├── new/
│           │   └── page.tsx    # Add listing form (/admin/listings/new)
│           └── [id]/
│               └── page.tsx    # Edit listing form (/admin/listings/[id])
├── components/             # Shared UI components
│   ├── Navbar.tsx          # Fixed top navigation bar (client)
│   ├── Footer.tsx          # Site footer (server)
│   ├── PropertyCard.tsx    # Listing card used in grids (server)
│   ├── ImageGallery.tsx    # Image carousel with lightbox (client)
│   ├── FilterBar.tsx       # Type/status/price filter bar (client)
│   ├── SpecsGrid.tsx       # Bedrooms/bathrooms/area stats + amenities (server)
│   └── admin/
│       ├── AdminProvider.tsx   # React Context for admin state + auth (client)
│       ├── AdminShell.tsx      # Auth gate + admin sidebar layout (client)
│       ├── AdminTable.tsx      # Listings management table (client)
│       └── ListingForm.tsx     # Create/edit listing form (client)
├── data/
│   └── listings.ts         # Static listing data array (source of truth)
├── types/
│   └── listing.ts          # Listing TypeScript interface
├── docs/                   # Project documentation (not consumed at runtime)
├── .planning/              # GSD planning documents
│   └── codebase/           # Codebase analysis documents
├── next.config.mjs         # Next.js config (image domain allowlist)
├── tailwind.config.ts      # Tailwind theme (eden color palette, fonts)
├── tsconfig.json           # TypeScript config (@/* path alias)
├── postcss.config.mjs
├── .eslintrc.json
└── package.json
```

## Directory Purposes

**`app/`:**
- Purpose: All routes and layouts using Next.js App Router file-based routing
- Contains: `page.tsx` files (route segments), `layout.tsx` files (layout wrappers), `globals.css`
- Key files: `app/layout.tsx` (root shell), `app/page.tsx` (home), `app/listings/[id]/page.tsx` (static detail)

**`app/admin/`:**
- Purpose: Password-protected CRUD interface for managing listings
- Contains: Admin dashboard, listing form pages, admin-specific layout
- Key files: `app/admin/layout.tsx` (wraps everything in AdminProvider), `app/admin/page.tsx` (dashboard)

**`components/`:**
- Purpose: Reusable UI components consumed by pages
- Contains: Layout chrome (Navbar, Footer) and feature components (PropertyCard, ImageGallery, FilterBar, SpecsGrid)
- Key files: `components/PropertyCard.tsx` (used in 2 places), `components/ImageGallery.tsx` (listing detail)

**`components/admin/`:**
- Purpose: Admin-only components; not imported by public pages
- Contains: Auth context provider, layout shell, table, and form
- Key files: `components/admin/AdminProvider.tsx` (all admin state), `components/admin/ListingForm.tsx` (create/edit)

**`data/`:**
- Purpose: Static data — the only data persistence mechanism in the project
- Contains: `listings.ts` with the hardcoded `Listing[]` array
- Key files: `data/listings.ts`

**`types/`:**
- Purpose: Shared TypeScript type definitions
- Contains: `listing.ts` with the `Listing` interface
- Key files: `types/listing.ts`

## Key File Locations

**Entry Points:**
- `app/layout.tsx`: Root HTML shell, applies fonts and global styles
- `app/page.tsx`: Home page rendered at `/`
- `app/admin/layout.tsx`: Admin subtree entry; injects auth context

**Configuration:**
- `tailwind.config.ts`: Eden brand color palette (`eden-bg`, `eden-gold`, `eden-cream`, etc.) and font families
- `tsconfig.json`: Path alias `@/*` maps to project root
- `next.config.mjs`: Allowlists `images.unsplash.com` for `next/image`
- `app/globals.css`: Tailwind base/components/utilities, animation keyframes, focus-visible styles

**Core Logic:**
- `data/listings.ts`: All listing data; edit this file to change available properties
- `types/listing.ts`: `Listing` interface; change here to add/remove fields
- `components/admin/AdminProvider.tsx`: All admin CRUD logic and auth; the `ADMIN_PASSWORD` constant is defined here

**Testing:**
- No test files present in the codebase

## Naming Conventions

**Files:**
- React components: PascalCase — `PropertyCard.tsx`, `AdminProvider.tsx`
- Page files: always named `page.tsx` (Next.js convention)
- Layout files: always named `layout.tsx` (Next.js convention)
- Data/type files: camelCase — `listings.ts`, `listing.ts`

**Directories:**
- Route segments: lowercase, matching URL path — `listings/`, `about/`, `contact/`
- Dynamic segments: bracket notation — `[id]/`
- Feature groupings within components: lowercase — `components/admin/`

**Components:**
- Exported default function matches filename exactly — `export default function PropertyCard`
- Props interfaces: `[ComponentName]Props` — `PropertyCardProps`, `FilterBarProps`
- Context hook: `useAdmin()` (exported named function from `AdminProvider.tsx`)

## Where to Add New Code

**New public page (e.g., `/services`):**
- Create directory: `app/services/`
- Add file: `app/services/page.tsx`
- If static content only: no `'use client'` directive needed (RSC by default)

**New dynamic route segment:**
- Follow pattern of `app/listings/[id]/page.tsx`
- Call `generateStaticParams()` if the set of IDs is known at build time

**New reusable UI component:**
- Add to `components/[ComponentName].tsx`
- Use PascalCase filename matching the exported default function name
- Import `Listing` type from `@/types/listing` if component displays property data

**New admin component:**
- Add to `components/admin/[ComponentName].tsx`
- Call `useAdmin()` to access listings state and mutations
- Add `'use client'` directive at top of file

**New listing field:**
- Add to `types/listing.ts` `Listing` interface
- Update `data/listings.ts` entries with the new field
- Update `components/admin/ListingForm.tsx` to include the field in the form
- TypeScript will surface all other files that need updating

**Shared utilities:**
- No `utils/` or `lib/` directory currently exists; add one if needed
- Recommended path: `lib/utils.ts` or `utils/[name].ts`

**Global styles:**
- Add to `app/globals.css` under appropriate `@layer` directive
- New custom colors should go in `tailwind.config.ts` under `theme.extend.colors.eden`

## Special Directories

**`.next/`:**
- Purpose: Next.js build output and cache
- Generated: Yes
- Committed: No (in `.gitignore`)

**`.planning/`:**
- Purpose: GSD planning and codebase analysis documents
- Generated: By GSD commands
- Committed: Yes

**`docs/`:**
- Purpose: Project-level documentation (plans, specs)
- Generated: No
- Committed: Yes

**`node_modules/`:**
- Purpose: npm dependencies
- Generated: Yes
- Committed: No

---

*Structure analysis: 2026-04-07*
