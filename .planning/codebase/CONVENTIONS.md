# Coding Conventions

**Analysis Date:** 2026-04-07

## Naming Patterns

**Files:**
- React components: PascalCase matching the default export name — `PropertyCard.tsx`, `FilterBar.tsx`, `ImageGallery.tsx`
- Next.js pages: lowercase `page.tsx` per App Router convention — `app/page.tsx`, `app/listings/page.tsx`
- Next.js layouts: lowercase `layout.tsx` — `app/layout.tsx`, `app/admin/layout.tsx`
- Data modules: camelCase — `data/listings.ts`
- Type modules: camelCase, singular noun — `types/listing.ts`
- Admin components grouped in subdirectory: `components/admin/AdminProvider.tsx`

**Functions:**
- React components: PascalCase — `PropertyCard`, `ListingForm`, `AdminProvider`
- Event handlers: `handle` prefix + noun — `handleSubmit`
- Utility/helper functions: camelCase verb+noun — `formatPrice`, `closeMenu`
- Custom hooks: `use` prefix — `useAdmin`
- Inner helper components: PascalCase — `PasswordGate` (defined inside same file when only used there)

**Variables:**
- camelCase throughout — `menuOpen`, `scrolled`, `activeIndex`, `lightboxOpen`
- Boolean state: descriptive adjective/past-participle — `isAuthenticated`, `submitted`, `menuOpen`
- Derived/computed values: noun that describes the result — `featured`, `filtered`
- CSS class string constants: `camelCase` with `Class` suffix — `inputClass`, `labelClass`, `selectClass`

**Types/Interfaces:**
- Interfaces for prop types: PascalCase component name + `Props` suffix — `PropertyCardProps`, `FilterBarProps`, `ImageGalleryProps`
- Interfaces for context: PascalCase + `ContextValue` suffix — `AdminContextValue`
- Interfaces for domain data: PascalCase noun — `Filters`, `Listing`
- Type aliases via `interface` (not `type`) for objects throughout

## Code Style

**Formatting:**
- No Prettier config present — formatting is enforced by ESLint + Next.js rules
- Single quotes for strings in TypeScript/TSX
- No semicolons at end of statements (except inline JSX event handlers)
- 2-space indentation
- Trailing commas in multi-line object/array literals

**Linting:**
- ESLint config: `next/core-web-vitals` + `next/typescript` (`/.eslintrc.json`)
- TypeScript strict mode enabled (`tsconfig.json` has `"strict": true`)
- No additional custom rules beyond Next.js defaults

## Import Organization

**Order:**
1. Next.js framework imports — `import { notFound } from 'next/navigation'`, `import Link from 'next/link'`
2. React imports — `import { useState, useEffect, useCallback } from 'react'`
3. Internal path-aliased imports — `import { Listing } from '@/types/listing'`
4. Internal relative imports — not used (all internal imports use `@/` alias)
5. Local sibling imports (components within same directory) — `import AdminTable from '@/components/admin/AdminTable'`

**Path Aliases:**
- `@/*` maps to project root — used universally for all internal imports
- Example: `import { listings } from '@/data/listings'`, `import PropertyCard from '@/components/PropertyCard'`
- Never use relative paths (`../../`) — always use `@/` alias

## Component Patterns

**Client vs. Server Components:**
- Add `'use client'` directive only when component uses browser APIs, React state/effects, or Next.js client hooks
- Client components: `Navbar`, `FilterBar`, `ImageGallery`, `ListingForm`, `AdminProvider`, `AdminShell`, `AdminTable`, all `'use client'` pages
- Server components (no directive): `Footer`, `PropertyCard`, `SpecsGrid`, layout pages, static pages (`about`, `listings/[id]`)
- Pages using `useState`/`useMemo` explicitly add `'use client'` — `app/listings/page.tsx`, `app/contact/page.tsx`

**Props Interface Pattern:**
```typescript
interface ComponentNameProps {
  propName: Type
  optionalProp?: Type
}

export default function ComponentName({ prop1, prop2 }: ComponentNameProps) {
  // ...
}
```

**Shared CSS Class Strings:**
When multiple elements share a class combination, extract to a `const` before the JSX:
```typescript
const inputClass = 'w-full bg-eden-bg border border-eden-border text-eden-cream px-4 py-2.5 ...'
const labelClass = 'block text-xs tracking-widest uppercase text-eden-muted mb-1.5'
```

**Static Data Arrays:**
Define outside the component function to avoid re-creation on render:
```typescript
const navLinks = [
  { href: '/', label: 'Accueil' },
  // ...
]

export default function Navbar() { ... }
```

## Context Pattern

Context is defined in `components/admin/AdminProvider.tsx` with:
1. Interface for context value — `AdminContextValue`
2. `createContext<Type | null>(null)` initialization
3. Custom hook with null-guard error — `useAdmin()` throws if used outside provider
4. Provider component as default export
5. Hook as named export — `export function useAdmin()`

```typescript
const AdminContext = createContext<AdminContextValue | null>(null)

export function useAdmin() {
  const ctx = useContext(AdminContext)
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider')
  return ctx
}
```

## Error Handling

**Strategy:** Minimal — this is a static frontend with no API calls.

**Patterns:**
- Use `notFound()` from Next.js for missing data in server components — `app/listings/[id]/page.tsx` calls `if (!listing) notFound()`
- Context guard: throw descriptive error when hook is used outside its provider — `useAdmin`
- Form validation: HTML5 native `required` attribute on inputs; no client-side JS validation library
- Form submission: mock only — `handleSubmit` calls `e.preventDefault()` and sets state without network calls
- Admin auth failure: set boolean `error` state and display inline error message

## Formatting / Display Utilities

**Price Formatting:**
`formatPrice` is defined as a module-level helper function in each file that needs it (duplicated in `components/PropertyCard.tsx` and `app/listings/[id]/page.tsx` and `components/admin/AdminTable.tsx`). Pattern:

```typescript
function formatPrice(price: number, status: Listing['status']) {
  const formatted = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'MAD',
    maximumFractionDigits: 0,
  }).format(price)
  return status === 'À louer' ? `${formatted} / mois` : formatted
}
```

## Logging

- No logging library used
- No `console.log` statements in source
- Errors are surfaced via UI state, not logged

## Comments

**When to Comment:**
- Section dividers in JSX: inline `{/* Section Name */}` comments mark logical sections — `{/* Hero */}`, `{/* Featured Listings */}`
- CSS: comments explain intent — `/* Entrance animations — ease-out-quart for natural deceleration */`, `/* Respect reduced motion preferences */`
- No JSDoc/TSDoc on any functions or components
- No inline code comments explaining business logic

## Tailwind Usage

**Design Tokens:**
Use `eden-*` custom color tokens exclusively — never raw hex or Tailwind default colors in component classes:
- `text-eden-gold`, `bg-eden-bg`, `border-eden-border`, `text-eden-muted`, `text-eden-cream`

**Responsive:**
Mobile-first with `md:` and `lg:` breakpoints. Common pattern:
```
grid-cols-1 md:grid-cols-2 lg:grid-cols-3
hidden md:flex
```

**Hover/Active States:**
Interactive elements always include transition — `transition-all duration-300` or `duration-500`. Active press states use `active:scale-[0.97]`.

**Conditional Classes:**
Use template literals with ternary — never `clsx` or `cn`:
```typescript
className={`base-classes ${condition ? 'true-class' : 'false-class'}`}
```

## Module Exports

- Default export for every component file — one component per file
- Named exports for non-component entities in the same file — e.g., `export interface Filters` in `components/FilterBar.tsx`, `export function useAdmin` in `components/admin/AdminProvider.tsx`
- No barrel `index.ts` files — import directly from file paths

---

*Convention analysis: 2026-04-07*
