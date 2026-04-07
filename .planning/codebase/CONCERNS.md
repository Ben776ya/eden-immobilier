# Codebase Concerns

**Analysis Date:** 2026-04-07

## Tech Debt

**Hardcoded Admin Password in Source Code:**
- Issue: The admin password `'eden2024'` is a plain-text constant defined directly in the component source. It is committed to version control and visible to anyone with repo access.
- Files: `components/admin/AdminProvider.tsx` (line 19: `const ADMIN_PASSWORD = 'eden2024'`)
- Impact: Any person with access to the repository can log into the admin panel. Credentials cannot be rotated without a code deploy.
- Fix approach: Move to an environment variable (`process.env.ADMIN_PASSWORD`) with a server-side API route validating the password, never exposing it to the client bundle.

**Admin Authentication is Client-Side Only:**
- Issue: The entire auth flow lives in React state + `sessionStorage`. There is no server-side check; anyone who sets `sessionStorage.getItem('eden_admin') === 'true'` in the browser console bypasses authentication entirely.
- Files: `components/admin/AdminProvider.tsx`, `components/admin/AdminShell.tsx`
- Impact: The `/admin` routes provide zero real protection. Any browser user can access and mutate data.
- Fix approach: Implement server-side authentication (e.g., Next.js middleware with `next-auth` or a signed JWT stored in an `httpOnly` cookie). Protect `/admin` routes at the middleware level.

**Admin Data is Ephemeral — Not Persisted:**
- Issue: `AdminProvider` initializes state from the static `mockListings` array on every page load. Any listing created, updated, or deleted via the admin panel is lost on page refresh because there is no backend or persistent store.
- Files: `components/admin/AdminProvider.tsx`, `data/listings.ts`
- Impact: The admin panel is non-functional for real usage. All CRUD operations are in-memory only.
- Fix approach: Connect to a database (e.g., Supabase, PlanetScale, or a simple JSON file via API routes) or at minimum use `localStorage` as a short-term workaround.

**Public Listings Page Uses Static Import, Not Admin State:**
- Issue: `app/listings/page.tsx` and `app/listings/[id]/page.tsx` import directly from `data/listings.ts`. Admin changes in `AdminProvider` context are never reflected on the public-facing pages because those pages operate on the static data module, not the context.
- Files: `app/listings/page.tsx` (line 4), `app/listings/[id]/page.tsx` (line 4), `components/admin/AdminProvider.tsx`
- Impact: Publishing, editing, or deleting a listing in the admin dashboard has zero effect on the public site. The admin CRUD flow is effectively disconnected from the display layer.
- Fix approach: Listings must be persisted server-side (database or CMS). Public pages should fetch from that source. The `data/listings.ts` static array should become seed data only, not the runtime source of truth.

**`generateStaticParams` Locks Routes at Build Time:**
- Issue: `app/listings/[id]/page.tsx` uses `generateStaticParams` to statically generate detail pages from the static data array. Any listing added at runtime will return a 404 because no corresponding static route was generated.
- Files: `app/listings/[id]/page.tsx` (lines 7–9)
- Impact: Admin-added listings are entirely unreachable from the public site.
- Fix approach: Either remove `generateStaticParams` and switch to dynamic rendering (`dynamicParams = true`), or use ISR with `revalidate`. Both require listings to come from a persistent data source.

**Duplicate `formatPrice` Function:**
- Issue: An identical `formatPrice` function (same logic, same currency, same options) is defined separately in three files.
- Files: `app/listings/[id]/page.tsx` (line 11), `components/PropertyCard.tsx` (line 9), `components/admin/AdminTable.tsx` (line 11)
- Impact: Currency changes (currently `MAD` despite French locale content — see Known Bugs below) must be updated in three places. Risk of divergence.
- Fix approach: Extract to `lib/formatPrice.ts` and import from all three files.

**`ListingForm` Price Label Shows `€` but Currency is `MAD`:**
- Issue: `ListingForm` has a label reading `"Prix (€)"` but the actual `Intl.NumberFormat` currency used everywhere else is `'MAD'` (Moroccan Dirham). The displayed prices on cards and detail pages render in MAD, not euros.
- Files: `components/admin/ListingForm.tsx` (line 82: `label Prix (\u20ac)`)
- Impact: Misleading UI — admin users enter what they think is a euro price but it is stored as a raw number and displayed as MAD.
- Fix approach: Align label and currency. Decide on the intended currency (MAD or EUR) and apply consistently across `formatPrice` calls and the form label.

**New Listing ID Generation Uses `Date.now()`:**
- Issue: New listings created through the form receive an ID of `` `eden-${Date.now()}` ``.
- Files: `components/admin/ListingForm.tsx` (line 44)
- Impact: IDs are not collision-resistant and are meaningless outside the client session. When a real backend is added this pattern will break.
- Fix approach: Generate IDs server-side (UUID, CUID, or database-assigned).

**Contact Form Submits No Data:**
- Issue: The contact form's `handleSubmit` function only calls `setSubmitted(true)`. No form data is captured, validated, or sent anywhere — no API call, no email, no storage.
- Files: `app/contact/page.tsx` (lines 8–10)
- Impact: Users receive a success confirmation message but their submission is silently discarded. This is a silent data loss issue for a business-critical touchpoint.
- Fix approach: Implement a form submission handler using a service such as Resend, SendGrid, or Formspree, or a Next.js API route that emails the submission.

**Tailwind `content` Glob Includes Non-Existent `contexts/` Directory:**
- Issue: `tailwind.config.ts` includes `'./contexts/**/*.{js,ts,jsx,tsx,mdx}'` in `content`, but no `contexts/` directory exists in the project.
- Files: `tailwind.config.ts` (line 7)
- Impact: Harmless at present, but creates confusion and indicates a planned directory that was never created.
- Fix approach: Remove the dead glob or create the `contexts/` directory if context modules are planned.

## Known Bugs

**Currency Mismatch — MAD Applied to French Euro Prices:**
- Symptoms: Property prices such as `4,500,000` are displayed as `4 500 000 MAD` across all property cards and detail pages. The listings appear to be priced in euros (e.g., Cap d'Antibes villa at 4.5M, Paris 16e apartment at 3.2M), but the currency formatter uses `'MAD'` (Moroccan Dirham).
- Files: `components/PropertyCard.tsx` (line 11), `app/listings/[id]/page.tsx` (line 13), `components/admin/AdminTable.tsx` (line 12)
- Trigger: Visible on any listing card or detail page.
- Workaround: None — affects all displayed prices.

**`À louer` Status Filter May Not Match Accented Character Encoding:**
- Symptoms: The `FilterBar` status filter option uses the literal string `"À louer"` while `ListingForm` stores the status via Unicode escape `'\u00c0 louer'`. These are the same character but the encoding inconsistency is a fragility risk.
- Files: `components/FilterBar.tsx` (line 41), `components/admin/ListingForm.tsx` (line 15)
- Trigger: Would manifest if a runtime comparison fails due to normalization mismatch.
- Workaround: Filter matching works in current build but is not guarded.

## Security Considerations

**Admin Panel Has No Real Access Control:**
- Risk: The `/admin`, `/admin/listings/new`, and `/admin/listings/[id]` routes are publicly accessible. The only guard is a React component that checks client-side `sessionStorage`. No server-side protection exists.
- Files: `app/admin/layout.tsx`, `components/admin/AdminShell.tsx`, `components/admin/AdminProvider.tsx`
- Current mitigation: Visual password gate in the browser; password is hardcoded as `'eden2024'` in the client bundle.
- Recommendations: Add Next.js Middleware (`middleware.ts`) to redirect unauthenticated requests to `/admin` server-side, backed by `httpOnly` session cookies. Remove the password from source code entirely.

**External Image URLs Are User-Controlled in the Admin Form:**
- Risk: The listing form accepts arbitrary image URLs entered as comma-separated text. These URLs are rendered via `next/image`, which requires whitelisted hostnames in `next.config.mjs`. Currently only `images.unsplash.com` is whitelisted, but this is a client-side restriction easily bypassed.
- Files: `components/admin/ListingForm.tsx` (lines 111–113), `next.config.mjs`
- Current mitigation: Next.js `remotePatterns` limits image optimization to `images.unsplash.com`, but images from other domains would simply render without optimization (not blocked in all cases).
- Recommendations: Validate URLs server-side before saving. Consider a file upload flow instead of raw URL input.

**No CSRF Protection on Admin Actions:**
- Risk: All admin mutations (add, update, delete) happen via React state with no CSRF tokens. If real API routes are added later without CSRF consideration, cross-site request forgery becomes exploitable.
- Files: `components/admin/AdminProvider.tsx`
- Current mitigation: Not applicable at present (no HTTP mutations), but the pattern should be established before adding a backend.

## Performance Bottlenecks

**Hero Image Loaded at Full 1920px Width on All Devices:**
- Problem: The homepage hero `<Image>` uses `sizes="100vw"` but the source URL is hardcoded at `w=1920&q=90`. On mobile devices, a 1920px-wide image is fetched unnecessarily.
- Files: `app/page.tsx` (line 13–19)
- Cause: The Unsplash URL has a fixed width parameter, bypassing Next.js responsive image optimization logic.
- Improvement path: Use a URL without a hardcoded `w=` parameter and let Next.js `sizes` prop drive responsive image selection.

**All Listings Loaded Client-Side on `/listings` Page:**
- Problem: `app/listings/page.tsx` is a `'use client'` component that imports the full static listings array at bundle time. All filtering is done in-memory via `useMemo`.
- Files: `app/listings/page.tsx`
- Cause: The page was built as a client component to support interactive filters, but there is no pagination and the full dataset is always loaded.
- Improvement path: Convert to a server component with URL-based filter params and server-side filtering, or add pagination when the listing count grows.

## Fragile Areas

**Admin State Scoped to Admin Layout Only:**
- Files: `app/admin/layout.tsx`, `components/admin/AdminProvider.tsx`
- Why fragile: `AdminProvider` is mounted only inside the `/admin` layout. Any navigation outside `/admin` and back will re-initialize state from the static `mockListings` array, wiping all in-session changes.
- Safe modification: Do not try to share admin context with public pages without first establishing persistent storage.
- Test coverage: None.

**`PropertyCard` Assumes `listing.images[0]` Always Exists:**
- Files: `components/PropertyCard.tsx` (line 24)
- Why fragile: If a listing is created via the admin form with no images, `images[0]` is `undefined`, and the `<Image>` component will throw or render a broken image without an error boundary.
- Safe modification: Add a fallback image or conditional rendering: `listing.images[0] ?? '/placeholder.jpg'`.
- Test coverage: None.

**`ImageGallery` Has No Guard for Empty `images` Array:**
- Files: `components/ImageGallery.tsx` (line 36)
- Why fragile: If `images` is an empty array, `images[activeIndex]` is `undefined` and the `<Image src>` will be an empty string, causing a runtime error. The component will crash rather than degrade gracefully.
- Safe modification: Return a placeholder or null when `images.length === 0`.
- Test coverage: None.

**Edit Page Does Not Handle Navigating Directly to Unknown Listing IDs:**
- Files: `app/admin/listings/[id]/page.tsx` (lines 9–16)
- Why fragile: If the admin navigates directly to `/admin/listings/unknown-id`, the page renders a plain text "Propriété introuvable." paragraph with no navigation affordance to return to the dashboard.
- Safe modification: Render a proper error state with a back link, or use `notFound()` to trigger the 404 page.
- Test coverage: None.

## Scaling Limits

**Static Data File as Sole Data Source:**
- Current capacity: 8 listings hardcoded in `data/listings.ts`.
- Limit: Adding listings requires editing source code and redeploying. The admin CRUD panel does not persist changes.
- Scaling path: Replace `data/listings.ts` with a database-backed API. Candidates: Supabase (Postgres + auto-generated API), Contentful/Sanity (headless CMS), or a simple JSON file served via a Next.js API route as an interim step.

## Test Coverage Gaps

**Zero Test Coverage Across the Entire Application:**
- What's not tested: Every component, page, hook, utility function, and data module.
- Files: All files under `app/`, `components/`, `data/`, `types/`
- Risk: Any refactor, bug fix, or new feature can break existing functionality silently. No regression safety net exists.
- Priority: High — particularly critical for admin auth logic and the `formatPrice` utility which has a known currency bug.

**Admin Authentication Logic is Untested:**
- What's not tested: `login()`, `logout()`, `sessionStorage` interaction, and the `PasswordGate` gate component.
- Files: `components/admin/AdminProvider.tsx`, `components/admin/AdminShell.tsx`
- Risk: The authentication bypass via `sessionStorage` manipulation would not be caught by tests even if tests existed, but component-level tests would at least validate that the gate renders when unauthenticated.
- Priority: High.

**`formatPrice` Currency Bug is Untested:**
- What's not tested: Output of the `formatPrice` function across `'À vendre'`, `'À louer'`, and `'Vendu'` statuses.
- Files: `components/PropertyCard.tsx`, `app/listings/[id]/page.tsx`, `components/admin/AdminTable.tsx`
- Risk: The MAD vs EUR discrepancy went undetected; a unit test would have caught this immediately.
- Priority: Medium.

---

*Concerns audit: 2026-04-07*
