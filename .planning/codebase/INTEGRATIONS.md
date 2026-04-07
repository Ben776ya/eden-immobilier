# External Integrations

**Analysis Date:** 2026-04-07

## APIs & External Services

**Image CDN:**
- Unsplash — All property and hero images are served from `https://images.unsplash.com`
  - SDK/Client: None — direct URL references in `data/listings.ts` and `app/page.tsx`
  - Auth: None (public CDN URLs with query params `?w=&q=`)
  - Next.js image optimization is enabled for this host via `next.config.mjs` `remotePatterns`

**No other external APIs detected.** No Stripe, no analytics, no maps, no CRM, no email service SDK.

## Data Storage

**Databases:**
- None — all listing data is hardcoded in `data/listings.ts` as a static in-memory array

**File Storage:**
- Local filesystem — font files (`GeistVF.woff`, `GeistMonoVF.woff`) stored at `app/fonts/` (unused — layout imports Google Fonts instead)

**Caching:**
- None — no Redis, no edge KV, no ISR configuration detected

## Authentication & Identity

**Auth Provider:**
- Custom hardcoded password — `ADMIN_PASSWORD = 'eden2024'` in `components/admin/AdminProvider.tsx`
  - Implementation: plain string comparison, no hashing, no JWT, no session tokens
  - Session persistence: `sessionStorage` key `eden_admin` (browser tab scope only)
  - No server-side auth — all authentication is client-side React state

## Monitoring & Observability

**Error Tracking:**
- None detected (no Sentry, no Datadog, no LogRocket)

**Logs:**
- None — no logging library or structured logging implemented

**Analytics:**
- None detected (no Google Analytics, no Plausible, no Posthog)

## CI/CD & Deployment

**Hosting:**
- Not configured — no `vercel.json`, no `netlify.toml`, no Dockerfile, no deployment manifests detected

**CI Pipeline:**
- None detected — no `.github/workflows/`, no CircleCI, no GitLab CI

## Environment Configuration

**Required env vars:**
- None — the application has zero environment variable dependencies; all config is hardcoded or static

**Secrets location:**
- No `.env` files detected
- Admin password is hardcoded in source: `components/admin/AdminProvider.tsx` line 19

## Webhooks & Callbacks

**Incoming:**
- None — no API route handlers detected under `app/api/`

**Outgoing:**
- None

## Contact Form

**Submission handling:**
- No backend — the contact form in `app/contact/page.tsx` calls `e.preventDefault()` and sets a local `submitted` state flag only
- No email, no API call, no form service (no Formspree, no Resend, no SendGrid)
- Form data is never transmitted anywhere

---

*Integration audit: 2026-04-07*
