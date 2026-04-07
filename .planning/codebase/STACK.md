# Technology Stack

**Analysis Date:** 2026-04-07

## Languages

**Primary:**
- TypeScript 5.x - All application code (`.ts`, `.tsx`)

**Secondary:**
- CSS - Global styles via `app/globals.css`

## Runtime

**Environment:**
- Node.js (LTS) — inferred from `@types/node ^20`

**Package Manager:**
- npm
- Lockfile: `package-lock.json` present

## Frameworks

**Core:**
- Next.js 14.2.35 — Full-stack React framework, App Router, server and client components
- React 18.x — UI component library

**Build/Dev:**
- TypeScript compiler (`tsc`) — via Next.js build pipeline, `noEmit: true`
- PostCSS 8.x — CSS processing, configured in `postcss.config.mjs` (Tailwind plugin only)
- Tailwind CSS 3.4.1 — Utility-first CSS framework

**Testing:**
- Not detected — no test runner, no test files found

## Key Dependencies

**Critical:**
- `next` 14.2.35 — Provides routing (App Router), image optimization, font loading, ESLint config
- `react` ^18 — Component model and hooks (`useState`, `useEffect`, `useContext`, `useCallback`)
- `react-dom` ^18 — DOM rendering

**Infrastructure:**
- `tailwindcss` ^3.4.1 — Design system via custom `eden.*` color tokens defined in `tailwind.config.ts`
- `postcss` ^8 — Required peer for Tailwind CSS processing

**Dev / Type Support:**
- `typescript` ^5
- `@types/node` ^20
- `@types/react` ^18
- `@types/react-dom` ^18
- `eslint` ^8
- `eslint-config-next` 14.2.35

## Configuration

**TypeScript (`tsconfig.json`):**
- `strict: true`
- Module resolution: `bundler`
- Path alias: `@/*` → `./*` (project root)
- Plugins: `next` (type generation for App Router)
- Incremental compilation enabled

**Tailwind (`tailwind.config.ts`):**
- Content: `app/**/*`, `components/**/*`, `contexts/**/*`
- Custom color palette: `eden.bg`, `eden.surface`, `eden.burgundy`, `eden.gold`, `eden.gold-light`, `eden.cream`, `eden.muted`, `eden.border`, `eden.border-light`
- Custom fonts: `--font-playfair` (Playfair Display), `--font-dm-sans` (DM Sans)
- Custom letter-spacing: `label` (0.35em)
- No Tailwind plugins

**ESLint (`.eslintrc.json`):**
- Extends: `next/core-web-vitals`, `next/typescript`

**Next.js (`next.config.mjs`):**
- Image remote patterns: `https://images.unsplash.com` (only approved external image host)

**PostCSS (`postcss.config.mjs`):**
- Plugins: `tailwindcss` only

## Platform Requirements

**Development:**
- Node.js 20+
- npm (lock file committed)
- `npm run dev` → `next dev`
- `npm run lint` → `next lint`

**Production:**
- `npm run build` → `next build`
- `npm run start` → `next start`
- Deployment target: any Node.js host supporting Next.js 14 (Vercel, self-hosted)
- No containerisation config detected (no Dockerfile)

---

*Stack analysis: 2026-04-07*
