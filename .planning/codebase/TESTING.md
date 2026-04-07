# Testing Patterns

**Analysis Date:** 2026-04-07

## Test Framework

**Runner:** None — no test framework is installed or configured.

**Assertion Library:** None

**Test Config:** None — no `jest.config.*`, `vitest.config.*`, or equivalent file exists.

**Run Commands:**
```bash
# No test commands available
# package.json scripts: dev, build, start, lint only
npm run lint   # ESLint only — not a test runner
```

## Test File Organization

**Location:** No test files exist in the project.

**Naming:** Not applicable — no test files found.

**Coverage:** Not applicable — no coverage tooling configured.

## Current State

This codebase has **zero test coverage**. No unit tests, integration tests, or end-to-end tests are present. The `package.json` at `/c/Users/bench/OneDrive/Desktop/eden-immobilier/package.json` contains no test dependencies and no `test` script.

The only quality automation in place is ESLint via `npm run lint` (Next.js + TypeScript rules, configured in `/.eslintrc.json`).

## Recommended Test Setup

If tests are added to this project, the following setup matches the existing stack (Next.js 14, React 18, TypeScript, Tailwind):

### Framework Choice

**Vitest** is recommended over Jest for this project due to native ESM support and faster execution:

```bash
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/user-event @testing-library/jest-dom
```

**Config file to create:** `vitest.config.ts`

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    globals: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
})
```

### Test File Organization

Co-locate tests with source files or use a top-level `__tests__/` directory:

```
eden-immobilier/
├── components/
│   ├── PropertyCard.tsx
│   ├── PropertyCard.test.tsx    # co-located
│   └── Navbar.tsx
├── __tests__/
│   ├── data/
│   │   └── listings.test.ts    # data layer tests
│   └── utils/
│       └── formatPrice.test.ts # utility tests
└── tests/
    └── setup.ts                # global test setup
```

**Naming convention:**
- Unit tests: `ComponentName.test.tsx` or `moduleName.test.ts`
- Integration tests: `feature.integration.test.tsx`

### Test Structure Pattern

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

describe('ComponentName', () => {
  describe('when condition', () => {
    it('should behave a certain way', () => {
      // Arrange
      // Act
      // Assert
    })
  })
})
```

### Key Areas to Test

**High Priority — Pure Logic (no mocking needed):**

1. `formatPrice` utility — currently duplicated in three files:
   - `components/PropertyCard.tsx`
   - `app/listings/[id]/page.tsx`
   - `components/admin/AdminTable.tsx`
   - Extract to `lib/formatPrice.ts` and test there

2. Filter logic in `app/listings/page.tsx` — the `useMemo` filter callback is untested:
   ```typescript
   // Test: type filter, status filter, maxPrice filter, combined filters, empty results
   ```

3. `AdminProvider` context — CRUD operations (`updateListing`, `deleteListing`, `addListing`) and `login`/`logout`:
   - File: `components/admin/AdminProvider.tsx`

4. `ListingForm` submit handler — `id` generation, image/amenity string parsing:
   - File: `components/admin/ListingForm.tsx`

**Medium Priority — Component Rendering:**

1. `PropertyCard` — renders title, price, status badge, correct link href
2. `SpecsGrid` — renders bedroom/bathroom/area values, amenities list
3. `FilterBar` — onChange fires with correct merged filter object, reset button visibility

**Lower Priority — Interaction/Navigation:**

1. `Navbar` — mobile menu open/close, Escape key handler, scroll state, active link
2. `ImageGallery` — prev/next navigation, lightbox open/close, keyboard arrows

### Mocking Patterns

**Next.js Navigation:**
```typescript
vi.mock('next/navigation', () => ({
  usePathname: () => '/listings',
  useRouter: () => ({ push: vi.fn() }),
}))
```

**Next.js Image:**
```typescript
vi.mock('next/image', () => ({
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}))
```

**sessionStorage (for AdminProvider):**
```typescript
beforeEach(() => {
  Object.defineProperty(window, 'sessionStorage', {
    value: {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    },
  })
})
```

**What NOT to Mock:**
- `@/data/listings` — use real data in tests; it is a static TypeScript constant
- `@/types/listing` — never mock type definitions
- Tailwind CSS classes — not relevant to behavior assertions

### Fixtures and Factories

Use a subset of real listing data from `data/listings.ts` directly, or create minimal fixtures:

```typescript
// tests/fixtures/listings.ts
import type { Listing } from '@/types/listing'

export const mockListing: Listing = {
  id: 'test-001',
  title: 'Test Villa',
  type: 'Villa',
  status: 'À vendre',
  price: 1000000,
  location: 'Test Location',
  bedrooms: 3,
  bathrooms: 2,
  area: 150,
  description: 'Test description',
  images: ['https://images.unsplash.com/test.jpg'],
  featured: false,
  amenities: ['Piscine'],
}
```

## Test Types

**Unit Tests:**
- Scope: individual functions, hooks, and components in isolation
- Target: `formatPrice`, filter logic, `useAdmin` hook, form handlers

**Integration Tests:**
- Scope: component trees with real context providers
- Target: admin CRUD flow (AdminProvider + AdminTable + ListingForm), listings filter + card render

**E2E Tests:** Not applicable — no Playwright or Cypress installed.

## Coverage

**Requirements:** None enforced.

**Recommended targets when tests are added:**
- `lib/` utilities: 100%
- Context providers: 90%+
- UI components: 60%+ (focus on interaction logic, not styling)

---

*Testing analysis: 2026-04-07*
