# Eden Immobilier — Luxury Real Estate Frontend Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a complete Next.js 14 frontend prototype for Eden Immobilier — a luxury real estate brand site with 5 public pages, per-listing detail pages, and a 3-page admin dashboard, all powered by hardcoded mock data.

**Architecture:** Static Next.js 14 App Router site with TypeScript. All listing data lives in `data/listings.ts`. The admin dashboard uses a React Context (client component) initialized from mock data — state resets on page refresh (intentional for prototype). Admin access is gated by a hardcoded password stored in `sessionStorage`. No backend, no database, no external dependencies beyond Next.js and Tailwind.

**Tech Stack:** Next.js 14 (App Router), TypeScript, Tailwind CSS v3, next/image, next/font/google (Playfair Display + DM Sans)

---

## File Map

| File | Responsibility |
|---|---|
| `tailwind.config.ts` | Custom eden color palette + font family tokens |
| `app/globals.css` | Tailwind directives + body base styles |
| `types/listing.ts` | Listing TypeScript interface |
| `data/listings.ts` | 8 hardcoded mock listing objects |
| `app/layout.tsx` | Root layout: font variables, Navbar, Footer |
| `app/page.tsx` | Home: hero, featured listings, about teaser, contact CTA |
| `app/listings/page.tsx` | Listings grid with client-side FilterBar |
| `app/listings/[id]/page.tsx` | Detail: ImageGallery, SpecsGrid, inquiry CTA |
| `app/about/page.tsx` | Brand story + agent bio |
| `app/contact/page.tsx` | Static contact form with success state |
| `app/admin/layout.tsx` | Admin shell: renders AdminProvider (password gate + sidebar) |
| `app/admin/page.tsx` | Admin dashboard: AdminTable |
| `app/admin/listings/[id]/page.tsx` | Edit listing via ListingForm |
| `app/admin/listings/new/page.tsx` | New listing via ListingForm |
| `components/Navbar.tsx` | Public navbar: logo, links, gold CTA |
| `components/Footer.tsx` | Site footer: brand, links, copyright |
| `components/PropertyCard.tsx` | Listing thumbnail card with price overlay |
| `components/ImageGallery.tsx` | Hero image + thumbnails + fullscreen lightbox |
| `components/SpecsGrid.tsx` | Bedrooms/bathrooms/area/amenities icon grid |
| `components/FilterBar.tsx` | Client-side type/price/location filter controls |
| `components/admin/AdminProvider.tsx` | React Context: admin listings state + CRUD actions |
| `components/admin/AdminTable.tsx` | Listings table with edit/delete buttons |
| `components/admin/ListingForm.tsx` | Reusable create/edit form for listings |

---

## Task 1: Initialize Next.js Project

**Files:**
- Create: project root (via create-next-app)

- [ ] **Step 1: Scaffold the project**

Run inside `c:/Users/bench/OneDrive/Desktop/eden-immobilier/`:
```bash
npx create-next-app@14 . --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*" --use-npm
```
Answer prompts: accept all defaults. This creates `app/`, `components/`, `public/`, `tailwind.config.ts`, `tsconfig.json`, `package.json`.

- [ ] **Step 2: Verify dev server starts**

```bash
npm run dev
```
Expected: server starts on `http://localhost:3000`, no errors in terminal.

- [ ] **Step 3: Remove boilerplate**

Delete the contents of `app/page.tsx` (replace with a placeholder), clear `app/globals.css` after the Tailwind directives. Do not delete any files.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: initialize Next.js 14 project with TypeScript and Tailwind"
```

---

## Task 2: Configure Tailwind Color System and Fonts

**Files:**
- Modify: `tailwind.config.ts`
- Modify: `app/globals.css`

- [ ] **Step 1: Replace tailwind.config.ts**

```ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './contexts/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        eden: {
          bg: '#0F0D0D',
          surface: '#2A0D0D',
          burgundy: '#7B1D1D',
          gold: '#C9A84C',
          cream: '#F5F0E8',
          muted: '#9E9289',
          border: '#6B5A2E',
        },
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
        sans: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
```

- [ ] **Step 2: Replace app/globals.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-eden-bg text-eden-cream font-sans antialiased;
  }
  h1, h2, h3, h4, h5 {
    @apply font-serif;
  }
  ::selection {
    @apply bg-eden-gold text-eden-bg;
  }
}

@layer utilities {
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
}
```

- [ ] **Step 3: Verify build compiles**

```bash
npm run build
```
Expected: Build succeeds with no TypeScript or Tailwind errors.

- [ ] **Step 4: Commit**

```bash
git add tailwind.config.ts app/globals.css
git commit -m "feat: configure Eden Immobilier luxury color palette and typography tokens"
```

---

## Task 3: TypeScript Types and Mock Data

**Files:**
- Create: `types/listing.ts`
- Create: `data/listings.ts`

- [ ] **Step 1: Create types/listing.ts**

```ts
export interface Listing {
  id: string
  title: string
  type: 'Villa' | 'Appartement' | 'Penthouse' | 'Maison'
  status: 'À vendre' | 'À louer' | 'Vendu'
  price: number
  location: string
  bedrooms: number
  bathrooms: number
  area: number
  description: string
  images: string[]
  featured: boolean
  amenities: string[]
}
```

- [ ] **Step 2: Create data/listings.ts**

```ts
import { Listing } from '@/types/listing'

export const listings: Listing[] = [
  {
    id: 'eden-001',
    title: "Villa Prestige — Cap d'Antibes",
    type: 'Villa',
    status: 'À vendre',
    price: 4500000,
    location: "Cap d'Antibes, Côte d'Azur",
    bedrooms: 6,
    bathrooms: 4,
    area: 420,
    description:
      "Majestueuse villa d'exception surplombant la Méditerranée, nichée dans un parc arboré de 2 000 m². Volumes exceptionnels, finitions haut de gamme, piscine à débordement et vue panoramique sur la mer. Une opportunité rare sur la Côte d'Azur.",
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80',
      'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1200&q=80',
      'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1200&q=80',
    ],
    featured: true,
    amenities: ['Piscine', 'Vue mer', 'Garage', 'Jardin', 'Domotique', 'Gardiennage'],
  },
  {
    id: 'eden-002',
    title: 'Penthouse Panoramique — Monaco',
    type: 'Penthouse',
    status: 'À vendre',
    price: 8200000,
    location: 'Fontvieille, Monaco',
    bedrooms: 4,
    bathrooms: 3,
    area: 280,
    description:
      'Au sommet de Monaco, ce penthouse d\'exception offre une vue à 360° sur la Méditerranée et le Rocher. Terrasse de 120 m², finitions sur-mesure, accès privé par ascenseur. Le nec plus ultra de la Principauté.',
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&q=80',
    ],
    featured: true,
    amenities: ['Terrasse 120m²', 'Vue mer 360°', 'Ascenseur privé', 'Parking double', 'Cave à vin'],
  },
  {
    id: 'eden-003',
    title: 'Château Privé — Médoc',
    type: 'Maison',
    status: 'À vendre',
    price: 6800000,
    location: 'Saint-Julien, Bordeaux',
    bedrooms: 10,
    bathrooms: 7,
    area: 1200,
    description:
      'Château du XVIIIe siècle entièrement rénové, entouré de 15 hectares de vignes en appellation Saint-Julien. Réception de prestige, cellier historique, pool house contemporain. Un domaine viticole d\'exception.',
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
      'https://images.unsplash.com/photo-1416331108676-a22ccb276e35?w=1200&q=80',
    ],
    featured: true,
    amenities: ['Vignoble 15ha', 'Cave historique', 'Pool house', 'Dépendances', 'Héliport'],
  },
  {
    id: 'eden-004',
    title: 'Appartement Haussmann — Paris 16e',
    type: 'Appartement',
    status: 'À vendre',
    price: 3200000,
    location: 'Avenue Foch, Paris 16e',
    bedrooms: 5,
    bathrooms: 3,
    area: 210,
    description:
      "Somptueux appartement Haussmannien au 4e étage avec ascenseur, avenue Foch. Moulures d'époque, parquet point de Hongrie, double salon en enfilade. Vue dégagée sur l'avenue, aucun vis-à-vis.",
    images: [
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80',
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&q=80',
      'https://images.unsplash.com/photo-1615873968403-89e068629265?w=1200&q=80',
    ],
    featured: false,
    amenities: ['Double salon', 'Parquet ancien', 'Cave', 'Gardien', 'Ascenseur'],
  },
  {
    id: 'eden-005',
    title: 'Villa Contemporaine — Saint-Tropez',
    type: 'Villa',
    status: 'À vendre',
    price: 5500000,
    location: 'Les Parcs, Saint-Tropez',
    bedrooms: 5,
    bathrooms: 5,
    area: 350,
    description:
      "Villa d'architecte contemporaine dans le domaine sécurisé des Parcs de Saint-Tropez. Volumes baignés de lumière, cuisine Boffi, piscine chauffée et pergola extérieure. À deux pas des plages de Pampelonne.",
    images: [
      'https://images.unsplash.com/photo-1600047509358-9dc75507daeb?w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=80',
      'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1200&q=80',
    ],
    featured: false,
    amenities: ['Piscine chauffée', 'Domaine sécurisé', 'Cuisine Boffi', 'Garage 3 voitures', 'Pergola'],
  },
  {
    id: 'eden-006',
    title: 'Penthouse Belle Époque — Nice',
    type: 'Penthouse',
    status: 'À louer',
    price: 40000,
    location: 'Promenade des Anglais, Nice',
    bedrooms: 3,
    bathrooms: 2,
    area: 180,
    description:
      "Penthouse en location saisonnière sur la Promenade des Anglais, dernier étage d'un immeuble Belle Époque. Terrasse panoramique sur la Baie des Anges, intérieur entièrement décoré par un architecte d'intérieur parisien.",
    images: [
      'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=1200&q=80',
      'https://images.unsplash.com/photo-1560185127-6a7b4a5b3e47?w=1200&q=80',
    ],
    featured: false,
    amenities: ['Terrasse panoramique', 'Vue mer', 'Parking', 'Conciergerie', 'Climatisation'],
  },
  {
    id: 'eden-007',
    title: 'Manoir Normand — Deauville',
    type: 'Maison',
    status: 'À vendre',
    price: 4100000,
    location: 'Deauville, Normandie',
    bedrooms: 8,
    bathrooms: 5,
    area: 650,
    description:
      "Manoir normand du XIXe siècle restauré avec soin, à 5 minutes des planches de Deauville. Colombages d'origine, cheminées monumentales, parc de 5 000 m² avec pommiers centenaires. Un patrimoine d'exception.",
    images: [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80',
      'https://images.unsplash.com/photo-1598228723793-55f8409e7e52?w=1200&q=80',
    ],
    featured: false,
    amenities: ['Parc 5000m²', 'Cheminées', 'Dépendances', 'Verger', 'Piscine couverte'],
  },
  {
    id: 'eden-008',
    title: 'Appartement Vue Mer — Cannes',
    type: 'Appartement',
    status: 'Vendu',
    price: 1800000,
    location: 'La Croisette, Cannes',
    bedrooms: 3,
    bathrooms: 2,
    area: 130,
    description:
      "Appartement de prestige sur la Croisette avec vue frontale sur la mer. Entièrement rénové en 2023, cuisine ouverte, balcon filant, résidence sécurisée avec piscine. À quelques mètres du Palais des Festivals.",
    images: [
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200&q=80',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&q=80',
    ],
    featured: false,
    amenities: ['Vue mer', 'Balcon filant', 'Piscine résidence', 'Parking', 'Gardiennage 24h'],
  },
]
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```
Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add types/listing.ts data/listings.ts
git commit -m "feat: add Listing type and 8 mock luxury property listings"
```

---

## Task 4: Root Layout with Fonts

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Replace app/layout.tsx**

```tsx
import type { Metadata } from 'next'
import { Playfair_Display, DM_Sans } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Eden Immobilier — Propriétés de Prestige',
  description:
    'Découvrez notre sélection exclusive de propriétés de luxe sur la Côte d\'Azur, à Paris et dans les plus beaux domaines de France.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={`${playfair.variable} ${dmSans.variable}`}>
      <body className="bg-eden-bg text-eden-cream font-sans antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
```

- [ ] **Step 2: Create placeholder Navbar and Footer so layout compiles**

Create `components/Navbar.tsx`:
```tsx
export default function Navbar() {
  return <nav className="h-20 bg-eden-bg border-b border-eden-border" />
}
```

Create `components/Footer.tsx`:
```tsx
export default function Footer() {
  return <footer className="bg-eden-surface py-12 text-center text-eden-muted text-sm">© Eden Immobilier</footer>
}
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```
Expected: Build succeeds.

- [ ] **Step 4: Commit**

```bash
git add app/layout.tsx components/Navbar.tsx components/Footer.tsx
git commit -m "feat: add root layout with Playfair Display and DM Sans fonts"
```

---

## Task 5: Navbar Component

**Files:**
- Modify: `components/Navbar.tsx`

- [ ] **Step 1: Replace components/Navbar.tsx with full implementation**

```tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const navLinks = [
  { href: '/', label: 'Accueil' },
  { href: '/listings', label: 'Propriétés' },
  { href: '/about', label: 'À propos' },
  { href: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-eden-bg/95 backdrop-blur-sm border-b border-eden-border">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="font-serif text-xl tracking-widest text-eden-gold uppercase">
          Eden Immobilier
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm tracking-wider uppercase transition-colors duration-200 ${
                pathname === link.href
                  ? 'text-eden-gold'
                  : 'text-eden-muted hover:text-eden-cream'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/listings"
            className="ml-4 px-5 py-2 border border-eden-gold text-eden-gold text-sm tracking-wider uppercase hover:bg-eden-gold hover:text-eden-bg transition-colors duration-200"
          >
            Voir les propriétés
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-eden-cream"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <div className="space-y-1.5">
            <span className={`block w-6 h-px bg-eden-cream transition-all ${menuOpen ? 'rotate-45 translate-y-2.5' : ''}`} />
            <span className={`block w-6 h-px bg-eden-cream transition-all ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-px bg-eden-cream transition-all ${menuOpen ? '-rotate-45 -translate-y-2.5' : ''}`} />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-eden-surface border-t border-eden-border px-6 py-6 flex flex-col gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`text-sm tracking-wider uppercase ${
                pathname === link.href ? 'text-eden-gold' : 'text-eden-muted'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/listings"
            onClick={() => setMenuOpen(false)}
            className="px-5 py-2 border border-eden-gold text-eden-gold text-sm tracking-wider uppercase text-center"
          >
            Voir les propriétés
          </Link>
        </div>
      )}
    </nav>
  )
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```
Expected: Build succeeds, no TypeScript errors.

- [ ] **Step 3: Commit**

```bash
git add components/Navbar.tsx
git commit -m "feat: add responsive Navbar with gold CTA and mobile hamburger menu"
```

---

## Task 6: Footer Component

**Files:**
- Modify: `components/Footer.tsx`

- [ ] **Step 1: Replace components/Footer.tsx**

```tsx
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-eden-surface border-t border-eden-border">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <p className="font-serif text-lg tracking-widest text-eden-gold uppercase mb-4">
              Eden Immobilier
            </p>
            <p className="text-eden-muted text-sm leading-relaxed">
              L'excellence au service de votre patrimoine immobilier. Propriétés de prestige
              sur la Côte d'Azur, à Paris et dans les plus beaux domaines de France.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-xs tracking-widest uppercase text-eden-gold mb-4">Navigation</p>
            <ul className="space-y-3">
              {[
                { href: '/', label: 'Accueil' },
                { href: '/listings', label: 'Propriétés' },
                { href: '/about', label: 'À propos' },
                { href: '/contact', label: 'Contact' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-eden-muted text-sm hover:text-eden-cream transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs tracking-widest uppercase text-eden-gold mb-4">Contact</p>
            <ul className="space-y-3 text-eden-muted text-sm">
              <li>12 Avenue Montaigne, Paris 8e</li>
              <li>+33 1 42 00 00 00</li>
              <li>contact@eden-immobilier.fr</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-eden-border mt-12 pt-8 text-center text-eden-muted text-xs tracking-wider">
          © {new Date().getFullYear()} Eden Immobilier. Tous droits réservés.
        </div>
      </div>
    </footer>
  )
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```
Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add components/Footer.tsx
git commit -m "feat: add Footer with brand info, navigation links, and contact details"
```

---

## Task 7: PropertyCard Component

**Files:**
- Create: `components/PropertyCard.tsx`

- [ ] **Step 1: Create components/PropertyCard.tsx**

```tsx
import Link from 'next/link'
import Image from 'next/image'
import { Listing } from '@/types/listing'

interface PropertyCardProps {
  listing: Listing
}

function formatPrice(price: number, status: Listing['status']) {
  const formatted = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(price)
  return status === 'À louer' ? `${formatted} / mois` : formatted
}

export default function PropertyCard({ listing }: PropertyCardProps) {
  return (
    <Link href={`/listings/${listing.id}`} className="group block">
      <div className="relative overflow-hidden bg-eden-surface border border-eden-border hover:border-eden-gold transition-colors duration-300">
        {/* Image */}
        <div className="relative h-64 overflow-hidden">
          <Image
            src={listing.images[0]}
            alt={listing.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {/* Status badge */}
          <div className="absolute top-4 left-4">
            <span
              className={`px-3 py-1 text-xs tracking-widest uppercase font-medium ${
                listing.status === 'Vendu'
                  ? 'bg-eden-muted text-eden-bg'
                  : 'bg-eden-gold text-eden-bg'
              }`}
            >
              {listing.status}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-xs tracking-widest uppercase text-eden-gold mb-2">{listing.type} — {listing.location}</p>
          <h3 className="font-serif text-lg text-eden-cream mb-4 leading-snug group-hover:text-eden-gold transition-colors">
            {listing.title}
          </h3>

          {/* Specs row */}
          <div className="flex items-center gap-5 text-eden-muted text-sm mb-5 border-t border-eden-border pt-4">
            <span>{listing.bedrooms} ch.</span>
            <span className="w-px h-3 bg-eden-border" />
            <span>{listing.bathrooms} sdb.</span>
            <span className="w-px h-3 bg-eden-border" />
            <span>{listing.area} m²</span>
          </div>

          {/* Price */}
          <p className="font-serif text-xl text-eden-gold">
            {formatPrice(listing.price, listing.status)}
          </p>
        </div>
      </div>
    </Link>
  )
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```
Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add components/PropertyCard.tsx
git commit -m "feat: add PropertyCard component with image, specs, price, and hover effects"
```

---

## Task 8: Home Page

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Replace app/page.tsx**

```tsx
import Link from 'next/link'
import Image from 'next/image'
import { listings } from '@/data/listings'
import PropertyCard from '@/components/PropertyCard'

export default function HomePage() {
  const featured = listings.filter((l) => l.featured)

  return (
    <div>
      {/* Hero */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1920&q=90"
          alt="Eden Immobilier — Propriété de prestige"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-eden-bg/60 via-eden-bg/30 to-eden-bg/80" />

        {/* Hero content */}
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <p className="text-xs tracking-[0.4em] uppercase text-eden-gold mb-6">
            L'Excellence Immobilière
          </p>
          <h1 className="font-serif text-5xl md:text-7xl text-eden-cream mb-8 leading-tight">
            Eden Immobilier
          </h1>
          <p className="text-eden-muted text-lg md:text-xl mb-12 max-w-xl mx-auto leading-relaxed">
            Propriétés d'exception pour une clientèle d'exception.
            Découvrez notre sélection exclusive.
          </p>
          <Link
            href="/listings"
            className="inline-block px-10 py-4 border border-eden-gold text-eden-gold text-sm tracking-widest uppercase hover:bg-eden-gold hover:text-eden-bg transition-colors duration-300"
          >
            Découvrir les propriétés
          </Link>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-eden-muted">
          <span className="text-xs tracking-widest uppercase">Défiler</span>
          <div className="w-px h-12 bg-gradient-to-b from-eden-muted to-transparent" />
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs tracking-[0.4em] uppercase text-eden-gold mb-4">Sélection</p>
          <h2 className="font-serif text-4xl text-eden-cream">Propriétés en Vedette</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featured.map((listing) => (
            <PropertyCard key={listing.id} listing={listing} />
          ))}
        </div>
        <div className="text-center mt-14">
          <Link
            href="/listings"
            className="inline-block px-10 py-4 border border-eden-border text-eden-muted text-sm tracking-widest uppercase hover:border-eden-gold hover:text-eden-gold transition-colors duration-300"
          >
            Voir toutes les propriétés
          </Link>
        </div>
      </section>

      {/* About Teaser */}
      <section className="bg-eden-surface border-t border-b border-eden-border py-24 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-xs tracking-[0.4em] uppercase text-eden-gold mb-4">Notre Maison</p>
            <h2 className="font-serif text-4xl text-eden-cream mb-6 leading-tight">
              Un service d'exception pour des biens d'exception
            </h2>
            <p className="text-eden-muted leading-relaxed mb-8">
              Eden Immobilier est né d'une passion pour l'architecture et les lieux d'exception.
              Depuis plus de 15 ans, nous accompagnons une clientèle internationale dans
              l'acquisition des plus belles propriétés de France.
            </p>
            <Link
              href="/about"
              className="inline-block text-eden-gold text-sm tracking-widest uppercase border-b border-eden-gold pb-1 hover:text-eden-cream hover:border-eden-cream transition-colors"
            >
              Notre histoire
            </Link>
          </div>
          <div className="relative h-96">
            <Image
              src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80"
              alt="Intérieur de prestige"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 border border-eden-border" />
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <p className="text-xs tracking-[0.4em] uppercase text-eden-gold mb-4">Contact</p>
          <h2 className="font-serif text-4xl text-eden-cream mb-6">
            Un projet immobilier ?
          </h2>
          <p className="text-eden-muted mb-10 leading-relaxed">
            Notre équipe est à votre disposition pour vous accompagner dans votre projet
            d'acquisition ou de vente d'un bien d'exception.
          </p>
          <Link
            href="/contact"
            className="inline-block px-10 py-4 bg-eden-gold text-eden-bg text-sm tracking-widest uppercase hover:bg-eden-cream transition-colors duration-300"
          >
            Nous Contacter
          </Link>
        </div>
      </section>
    </div>
  )
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```
Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "feat: build home page with hero, featured listings, about teaser, and CTA"
```

---

## Task 9: FilterBar Component and Listings Page

**Files:**
- Create: `components/FilterBar.tsx`
- Create: `app/listings/page.tsx`

- [ ] **Step 1: Create components/FilterBar.tsx**

```tsx
'use client'

import { Listing } from '@/types/listing'

export interface Filters {
  type: string
  status: string
  maxPrice: string
}

interface FilterBarProps {
  filters: Filters
  onChange: (filters: Filters) => void
  totalCount: number
}

export default function FilterBar({ filters, onChange, totalCount }: FilterBarProps) {
  const selectClass =
    'bg-eden-surface border border-eden-border text-eden-cream text-sm px-4 py-2.5 focus:outline-none focus:border-eden-gold appearance-none cursor-pointer'

  return (
    <div className="sticky top-20 z-40 bg-eden-bg/95 backdrop-blur-sm border-b border-eden-border">
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap items-center gap-4">
        <select
          value={filters.type}
          onChange={(e) => onChange({ ...filters, type: e.target.value })}
          className={selectClass}
        >
          <option value="">Tous les types</option>
          <option value="Villa">Villa</option>
          <option value="Appartement">Appartement</option>
          <option value="Penthouse">Penthouse</option>
          <option value="Maison">Maison</option>
        </select>

        <select
          value={filters.status}
          onChange={(e) => onChange({ ...filters, status: e.target.value })}
          className={selectClass}
        >
          <option value="">Tous les statuts</option>
          <option value="À vendre">À vendre</option>
          <option value="À louer">À louer</option>
          <option value="Vendu">Vendu</option>
        </select>

        <select
          value={filters.maxPrice}
          onChange={(e) => onChange({ ...filters, maxPrice: e.target.value })}
          className={selectClass}
        >
          <option value="">Budget max</option>
          <option value="2000000">jusqu'à 2 M€</option>
          <option value="4000000">jusqu'à 4 M€</option>
          <option value="6000000">jusqu'à 6 M€</option>
          <option value="10000000">jusqu'à 10 M€</option>
        </select>

        {(filters.type || filters.status || filters.maxPrice) && (
          <button
            onClick={() => onChange({ type: '', status: '', maxPrice: '' })}
            className="text-eden-muted text-sm hover:text-eden-gold transition-colors underline"
          >
            Réinitialiser
          </button>
        )}

        <span className="ml-auto text-eden-muted text-sm">
          {totalCount} propriété{totalCount !== 1 ? 's' : ''}
        </span>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create app/listings/page.tsx**

```tsx
'use client'

import { useState, useMemo } from 'react'
import { listings } from '@/data/listings'
import PropertyCard from '@/components/PropertyCard'
import FilterBar, { Filters } from '@/components/FilterBar'

export default function ListingsPage() {
  const [filters, setFilters] = useState<Filters>({ type: '', status: '', maxPrice: '' })

  const filtered = useMemo(() => {
    return listings.filter((l) => {
      if (filters.type && l.type !== filters.type) return false
      if (filters.status && l.status !== filters.status) return false
      if (filters.maxPrice && l.price > parseInt(filters.maxPrice)) return false
      return true
    })
  }, [filters])

  return (
    <div className="pt-20">
      <FilterBar filters={filters} onChange={setFilters} totalCount={filtered.length} />

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="mb-12">
          <p className="text-xs tracking-[0.4em] uppercase text-eden-gold mb-3">Portfolio</p>
          <h1 className="font-serif text-4xl text-eden-cream">Nos Propriétés</h1>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-serif text-2xl text-eden-muted mb-4">Aucun résultat</p>
            <p className="text-eden-muted text-sm">
              Aucune propriété ne correspond à vos critères.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((listing) => (
              <PropertyCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```
Expected: Build succeeds.

- [ ] **Step 4: Commit**

```bash
git add components/FilterBar.tsx app/listings/page.tsx
git commit -m "feat: add listings grid page with client-side FilterBar (type, status, price)"
```

---

## Task 10: ImageGallery Component

**Files:**
- Create: `components/ImageGallery.tsx`

- [ ] **Step 1: Create components/ImageGallery.tsx**

```tsx
'use client'

import { useState } from 'react'
import Image from 'next/image'

interface ImageGalleryProps {
  images: string[]
  title: string
}

export default function ImageGallery({ images, title }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  const prev = () => setActiveIndex((i) => (i === 0 ? images.length - 1 : i - 1))
  const next = () => setActiveIndex((i) => (i === images.length - 1 ? 0 : i + 1))

  return (
    <>
      {/* Main gallery */}
      <div className="relative">
        {/* Hero image */}
        <div
          className="relative h-[60vh] md:h-[75vh] cursor-pointer overflow-hidden bg-eden-surface"
          onClick={() => setLightboxOpen(true)}
        >
          <Image
            src={images[activeIndex]}
            alt={`${title} — image ${activeIndex + 1}`}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-eden-bg/40" />
          <div className="absolute bottom-4 right-4 bg-eden-bg/70 px-3 py-1 text-eden-cream text-xs">
            {activeIndex + 1} / {images.length}
          </div>
          <div className="absolute bottom-4 left-4 text-eden-cream text-xs tracking-wider opacity-60">
            Cliquer pour agrandir
          </div>
        </div>

        {/* Prev/Next arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-eden-bg/70 flex items-center justify-center text-eden-cream hover:bg-eden-gold hover:text-eden-bg transition-colors"
              aria-label="Image précédente"
            >
              ←
            </button>
            <button
              onClick={next}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-eden-bg/70 flex items-center justify-center text-eden-cream hover:bg-eden-gold hover:text-eden-bg transition-colors"
              aria-label="Image suivante"
            >
              →
            </button>
          </>
        )}

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-2 mt-2 overflow-x-auto scrollbar-hide px-0">
            {images.map((src, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`relative flex-shrink-0 w-24 h-16 overflow-hidden border-2 transition-colors ${
                  i === activeIndex ? 'border-eden-gold' : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <Image
                  src={src}
                  alt={`Miniature ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            className="absolute top-6 right-6 text-white text-2xl w-10 h-10 flex items-center justify-center hover:text-eden-gold"
            onClick={() => setLightboxOpen(false)}
          >
            ✕
          </button>
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 flex items-center justify-center text-white hover:bg-eden-gold hover:text-eden-bg transition-colors"
            onClick={(e) => { e.stopPropagation(); prev() }}
          >
            ←
          </button>
          <div
            className="relative w-[90vw] h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[activeIndex]}
              alt={`${title} — image ${activeIndex + 1}`}
              fill
              className="object-contain"
              sizes="90vw"
            />
          </div>
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 flex items-center justify-center text-white hover:bg-eden-gold hover:text-eden-bg transition-colors"
            onClick={(e) => { e.stopPropagation(); next() }}
          >
            →
          </button>
        </div>
      )}
    </>
  )
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```
Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add components/ImageGallery.tsx
git commit -m "feat: add ImageGallery with thumbnails, prev/next navigation, and fullscreen lightbox"
```

---

## Task 11: SpecsGrid Component

**Files:**
- Create: `components/SpecsGrid.tsx`

- [ ] **Step 1: Create components/SpecsGrid.tsx**

```tsx
interface SpecsGridProps {
  bedrooms: number
  bathrooms: number
  area: number
  amenities: string[]
}

export default function SpecsGrid({ bedrooms, bathrooms, area, amenities }: SpecsGridProps) {
  const specs = [
    { label: 'Chambres', value: bedrooms, unit: '' },
    { label: 'Salles de bain', value: bathrooms, unit: '' },
    { label: 'Surface', value: area, unit: ' m²' },
  ]

  return (
    <div>
      {/* Primary specs */}
      <div className="grid grid-cols-3 gap-px bg-eden-border mb-8">
        {specs.map((s) => (
          <div key={s.label} className="bg-eden-surface px-6 py-5 text-center">
            <p className="font-serif text-3xl text-eden-gold mb-1">
              {s.value}{s.unit}
            </p>
            <p className="text-eden-muted text-xs tracking-widest uppercase">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Amenities */}
      {amenities.length > 0 && (
        <div>
          <p className="text-xs tracking-widest uppercase text-eden-gold mb-4">Prestations</p>
          <div className="flex flex-wrap gap-2">
            {amenities.map((amenity) => (
              <span
                key={amenity}
                className="px-4 py-1.5 border border-eden-border text-eden-muted text-sm tracking-wide"
              >
                {amenity}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```
Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add components/SpecsGrid.tsx
git commit -m "feat: add SpecsGrid component with primary specs and amenity tags"
```

---

## Task 12: Listing Detail Page

**Files:**
- Create: `app/listings/[id]/page.tsx`

- [ ] **Step 1: Create app/listings/[id]/page.tsx**

```tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { listings } from '@/data/listings'
import ImageGallery from '@/components/ImageGallery'
import SpecsGrid from '@/components/SpecsGrid'

export function generateStaticParams() {
  return listings.map((l) => ({ id: l.id }))
}

function formatPrice(price: number, status: string) {
  const formatted = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(price)
  return status === 'À louer' ? `${formatted} / mois` : formatted
}

export default function ListingDetailPage({ params }: { params: { id: string } }) {
  const listing = listings.find((l) => l.id === params.id)
  if (!listing) notFound()

  return (
    <div className="pt-20">
      <ImageGallery images={listing.images} title={listing.title} />

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Main content */}
          <div className="lg:col-span-2">
            {/* Header */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs tracking-widest uppercase text-eden-gold">
                  {listing.type}
                </span>
                <span className="w-px h-3 bg-eden-border" />
                <span className="text-xs tracking-widest uppercase text-eden-muted">
                  {listing.location}
                </span>
                <span
                  className={`ml-auto px-3 py-1 text-xs tracking-widest uppercase ${
                    listing.status === 'Vendu'
                      ? 'bg-eden-muted text-eden-bg'
                      : 'bg-eden-gold text-eden-bg'
                  }`}
                >
                  {listing.status}
                </span>
              </div>
              <h1 className="font-serif text-4xl md:text-5xl text-eden-cream mb-6 leading-tight">
                {listing.title}
              </h1>
              <p className="font-serif text-3xl text-eden-gold">
                {formatPrice(listing.price, listing.status)}
              </p>
            </div>

            {/* Specs */}
            <div className="mb-10">
              <SpecsGrid
                bedrooms={listing.bedrooms}
                bathrooms={listing.bathrooms}
                area={listing.area}
                amenities={listing.amenities}
              />
            </div>

            {/* Description */}
            <div>
              <p className="text-xs tracking-widest uppercase text-eden-gold mb-4">Description</p>
              <p className="text-eden-muted leading-relaxed text-lg">{listing.description}</p>
            </div>
          </div>

          {/* Sticky sidebar CTA */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-eden-surface border border-eden-border p-8">
              <p className="font-serif text-xl text-eden-cream mb-2">Intéressé par ce bien ?</p>
              <p className="text-eden-muted text-sm mb-6 leading-relaxed">
                Contactez notre équipe pour organiser une visite ou obtenir plus d'informations.
              </p>
              <Link
                href="/contact"
                className="block text-center px-6 py-4 bg-eden-gold text-eden-bg text-sm tracking-widest uppercase hover:bg-eden-cream transition-colors duration-300 mb-4"
              >
                Demander une visite
              </Link>
              <Link
                href="/contact"
                className="block text-center px-6 py-3 border border-eden-border text-eden-muted text-sm tracking-widest uppercase hover:border-eden-gold hover:text-eden-gold transition-colors duration-300"
              >
                Nous contacter
              </Link>
              <div className="border-t border-eden-border mt-6 pt-6 text-eden-muted text-sm space-y-2">
                <p>+33 1 42 00 00 00</p>
                <p>contact@eden-immobilier.fr</p>
              </div>
            </div>
          </div>
        </div>

        {/* Back link */}
        <div className="mt-16 pt-10 border-t border-eden-border">
          <Link
            href="/listings"
            className="text-eden-muted text-sm tracking-wider hover:text-eden-gold transition-colors"
          >
            ← Retour aux propriétés
          </Link>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```
Expected: Build succeeds, 8 static listing pages generated.

- [ ] **Step 3: Commit**

```bash
git add app/listings/[id]/page.tsx
git commit -m "feat: add listing detail page with image gallery, specs, and inquiry CTA"
```

---

## Task 13: About Page

**Files:**
- Create: `app/about/page.tsx`

- [ ] **Step 1: Create app/about/page.tsx**

```tsx
import Image from 'next/image'
import Link from 'next/link'

const values = [
  {
    title: 'Excellence',
    description: 'Chaque propriété est sélectionnée avec le plus grand soin pour répondre aux exigences d'une clientèle d'exception.',
  },
  {
    title: 'Discrétion',
    description: 'Toutes nos transactions sont menées avec la plus grande confidentialité, dans le respect absolu de nos clients.',
  },
  {
    title: 'Expertise',
    description: 'Nos conseillers disposent d'une connaissance approfondie des marchés immobiliers de prestige en France et à l'international.',
  },
]

export default function AboutPage() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative h-72 flex items-end justify-start overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80"
          alt="Eden Immobilier"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-eden-bg via-eden-bg/60 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-12">
          <p className="text-xs tracking-[0.4em] uppercase text-eden-gold mb-3">Notre Maison</p>
          <h1 className="font-serif text-5xl text-eden-cream">À Propos</h1>
        </div>
      </section>

      {/* Story */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          <div>
            <h2 className="font-serif text-3xl text-eden-cream mb-6">Notre Histoire</h2>
            <p className="text-eden-muted leading-relaxed mb-5">
              Fondée en 2008 par Alexandre Moreau, Eden Immobilier est née d'une vision : rendre
              l'accès aux propriétés d'exception aussi fluide et plaisant que les biens eux-mêmes.
            </p>
            <p className="text-eden-muted leading-relaxed mb-5">
              En quinze ans, nous avons accompagné plus de 500 familles dans l'acquisition de leur
              résidence de rêve, des appartements haussmanniens du 16e arrondissement aux villas
              de la Côte d'Azur, en passant par les châteaux de Bordeaux et les manoirs normands.
            </p>
            <p className="text-eden-muted leading-relaxed">
              Notre réseau exclusif de propriétés off-market nous distingue sur un marché
              compétitif. Nombre de nos biens ne sont jamais publiés publiquement — ils sont
              réservés à nos clients en portefeuille.
            </p>
          </div>
          <div className="relative h-96">
            <Image
              src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80"
              alt="Propriété Eden Immobilier"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-eden-surface border-t border-b border-eden-border py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs tracking-[0.4em] uppercase text-eden-gold mb-3">Nos Valeurs</p>
            <h2 className="font-serif text-3xl text-eden-cream">Ce qui nous guide</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((v) => (
              <div key={v.title} className="border border-eden-border p-8 hover:border-eden-gold transition-colors">
                <h3 className="font-serif text-xl text-eden-gold mb-4">{v.title}</h3>
                <p className="text-eden-muted text-sm leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Agent */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="relative h-96">
            <Image
              src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&q=80"
              alt="Alexandre Moreau — Eden Immobilier"
              fill
              className="object-cover grayscale"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div>
            <p className="text-xs tracking-[0.4em] uppercase text-eden-gold mb-3">Fondateur</p>
            <h2 className="font-serif text-3xl text-eden-cream mb-2">Alexandre Moreau</h2>
            <p className="text-eden-muted text-sm tracking-wider mb-6">Directeur Général — Eden Immobilier</p>
            <p className="text-eden-muted leading-relaxed mb-5">
              Après 10 ans chez Sotheby's International Realty, Alexandre a fondé Eden Immobilier
              avec la conviction que le marché du luxe méritait une approche plus personnelle,
              plus humaine et plus transparente.
            </p>
            <p className="text-eden-muted leading-relaxed">
              Trilingue (français, anglais, italien), il accompagne personnellement ses clients
              sur les transactions les plus importantes.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-eden-border py-20 px-6 text-center">
        <h2 className="font-serif text-3xl text-eden-cream mb-6">Travaillons ensemble</h2>
        <Link
          href="/contact"
          className="inline-block px-10 py-4 bg-eden-gold text-eden-bg text-sm tracking-widest uppercase hover:bg-eden-cream transition-colors"
        >
          Prendre contact
        </Link>
      </section>
    </div>
  )
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```
Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add app/about/page.tsx
git commit -m "feat: add About page with brand story, values, and agent profile"
```

---

## Task 14: Contact Page

**Files:**
- Create: `app/contact/page.tsx`

- [ ] **Step 1: Create app/contact/page.tsx**

```tsx
'use client'

import { useState } from 'react'

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="pt-20">
      <section className="max-w-3xl mx-auto px-6 py-24">
        <div className="text-center mb-14">
          <p className="text-xs tracking-[0.4em] uppercase text-eden-gold mb-3">Contact</p>
          <h1 className="font-serif text-5xl text-eden-cream mb-4">Contactez-nous</h1>
          <p className="text-eden-muted leading-relaxed">
            Notre équipe vous répondra dans les 24 heures ouvrées.
          </p>
        </div>

        {submitted ? (
          <div className="text-center bg-eden-surface border border-eden-border p-16">
            <p className="font-serif text-3xl text-eden-gold mb-4">Merci</p>
            <p className="text-eden-muted leading-relaxed">
              Votre message a bien été envoyé. Nous vous contacterons dans les meilleurs délais.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs tracking-widest uppercase text-eden-muted mb-2">
                  Nom *
                </label>
                <input
                  required
                  type="text"
                  className="w-full bg-eden-surface border border-eden-border text-eden-cream px-4 py-3 focus:outline-none focus:border-eden-gold transition-colors"
                  placeholder="Votre nom"
                />
              </div>
              <div>
                <label className="block text-xs tracking-widest uppercase text-eden-muted mb-2">
                  Email *
                </label>
                <input
                  required
                  type="email"
                  className="w-full bg-eden-surface border border-eden-border text-eden-cream px-4 py-3 focus:outline-none focus:border-eden-gold transition-colors"
                  placeholder="votre@email.fr"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs tracking-widest uppercase text-eden-muted mb-2">
                Téléphone
              </label>
              <input
                type="tel"
                className="w-full bg-eden-surface border border-eden-border text-eden-cream px-4 py-3 focus:outline-none focus:border-eden-gold transition-colors"
                placeholder="+33 6 00 00 00 00"
              />
            </div>

            <div>
              <label className="block text-xs tracking-widest uppercase text-eden-muted mb-2">
                Bien souhaité
              </label>
              <select className="w-full bg-eden-surface border border-eden-border text-eden-cream px-4 py-3 focus:outline-none focus:border-eden-gold transition-colors appearance-none">
                <option value="">Sélectionner un type</option>
                <option>Villa</option>
                <option>Appartement</option>
                <option>Penthouse</option>
                <option>Maison / Château</option>
                <option>Autre</option>
              </select>
            </div>

            <div>
              <label className="block text-xs tracking-widest uppercase text-eden-muted mb-2">
                Message *
              </label>
              <textarea
                required
                rows={6}
                className="w-full bg-eden-surface border border-eden-border text-eden-cream px-4 py-3 focus:outline-none focus:border-eden-gold transition-colors resize-none"
                placeholder="Décrivez votre projet immobilier..."
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-eden-gold text-eden-bg text-sm tracking-widest uppercase hover:bg-eden-cream transition-colors duration-300"
            >
              Envoyer le message
            </button>
          </form>
        )}

        {/* Contact info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 pt-16 border-t border-eden-border text-center">
          {[
            { label: 'Adresse', value: '12 Avenue Montaigne\nParis 8e' },
            { label: 'Téléphone', value: '+33 1 42 00 00 00' },
            { label: 'Email', value: 'contact@eden-immobilier.fr' },
          ].map((item) => (
            <div key={item.label}>
              <p className="text-xs tracking-widest uppercase text-eden-gold mb-3">{item.label}</p>
              <p className="text-eden-muted text-sm whitespace-pre-line">{item.value}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```
Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add app/contact/page.tsx
git commit -m "feat: add Contact page with static form and success state"
```

---

## Task 15: Admin Context Provider

**Files:**
- Create: `components/admin/AdminProvider.tsx`

- [ ] **Step 1: Create components/admin/AdminProvider.tsx**

```tsx
'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { Listing } from '@/types/listing'
import { listings as mockListings } from '@/data/listings'

interface AdminContextValue {
  listings: Listing[]
  updateListing: (updated: Listing) => void
  deleteListing: (id: string) => void
  addListing: (listing: Listing) => void
  isAuthenticated: boolean
  login: (password: string) => boolean
  logout: () => void
}

const AdminContext = createContext<AdminContextValue | null>(null)

const ADMIN_PASSWORD = 'eden2024'

export function useAdmin() {
  const ctx = useContext(AdminContext)
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider')
  return ctx
}

export default function AdminProvider({ children }: { children: ReactNode }) {
  const [listings, setListings] = useState<Listing[]>(mockListings)
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('eden_admin') === 'true'
    }
    return false
  })

  function login(password: string): boolean {
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem('eden_admin', 'true')
      setIsAuthenticated(true)
      return true
    }
    return false
  }

  function logout() {
    sessionStorage.removeItem('eden_admin')
    setIsAuthenticated(false)
  }

  function updateListing(updated: Listing) {
    setListings((prev) => prev.map((l) => (l.id === updated.id ? updated : l)))
  }

  function deleteListing(id: string) {
    setListings((prev) => prev.filter((l) => l.id !== id))
  }

  function addListing(listing: Listing) {
    setListings((prev) => [...prev, listing])
  }

  return (
    <AdminContext.Provider
      value={{ listings, updateListing, deleteListing, addListing, isAuthenticated, login, logout }}
    >
      {children}
    </AdminContext.Provider>
  )
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```
Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add components/admin/AdminProvider.tsx
git commit -m "feat: add AdminProvider React Context with listings CRUD and session auth"
```

---

## Task 16: Admin Layout with Password Gate

**Files:**
- Create: `app/admin/layout.tsx`

- [ ] **Step 1: Create app/admin/layout.tsx**

```tsx
import AdminProvider from '@/components/admin/AdminProvider'
import AdminShell from '@/components/admin/AdminShell'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminProvider>
      <AdminShell>{children}</AdminShell>
    </AdminProvider>
  )
}
```

- [ ] **Step 2: Create components/admin/AdminShell.tsx**

```tsx
'use client'

import { useAdmin } from '@/components/admin/AdminProvider'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

function PasswordGate() {
  const { login } = useAdmin()
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const ok = login(password)
    if (!ok) setError(true)
  }

  return (
    <div className="min-h-screen bg-eden-bg flex items-center justify-center px-6">
      <div className="w-full max-w-sm bg-eden-surface border border-eden-border p-10">
        <p className="font-serif text-xl text-eden-gold text-center mb-2">Eden Immobilier</p>
        <p className="text-eden-muted text-sm text-center mb-8 tracking-wider">Administration</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(false) }}
            placeholder="Mot de passe"
            className="w-full bg-eden-bg border border-eden-border text-eden-cream px-4 py-3 focus:outline-none focus:border-eden-gold transition-colors"
          />
          {error && (
            <p className="text-red-400 text-xs tracking-wide">Mot de passe incorrect.</p>
          )}
          <button
            type="submit"
            className="w-full py-3 bg-eden-gold text-eden-bg text-sm tracking-widest uppercase hover:bg-eden-cream transition-colors"
          >
            Accéder
          </button>
        </form>
      </div>
    </div>
  )
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, logout } = useAdmin()
  const pathname = usePathname()

  if (!isAuthenticated) return <PasswordGate />

  const navItems = [
    { href: '/admin', label: 'Propriétés' },
    { href: '/admin/listings/new', label: 'Ajouter' },
  ]

  return (
    <div className="min-h-screen bg-eden-bg flex">
      {/* Sidebar */}
      <aside className="w-56 bg-eden-surface border-r border-eden-border flex flex-col">
        <div className="p-6 border-b border-eden-border">
          <p className="font-serif text-eden-gold tracking-widest text-sm uppercase">Eden</p>
          <p className="text-eden-muted text-xs tracking-wider">Administration</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-4 py-2.5 text-sm tracking-wide transition-colors ${
                pathname === item.href
                  ? 'bg-eden-burgundy text-eden-cream'
                  : 'text-eden-muted hover:text-eden-cream hover:bg-eden-bg'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-eden-border">
          <button
            onClick={logout}
            className="w-full text-left px-4 py-2.5 text-sm text-eden-muted hover:text-eden-cream transition-colors"
          >
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  )
}
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```
Expected: Build succeeds.

- [ ] **Step 4: Commit**

```bash
git add app/admin/layout.tsx components/admin/AdminShell.tsx
git commit -m "feat: add admin layout with password gate and sidebar navigation"
```

---

## Task 17: AdminTable and Dashboard Page

**Files:**
- Create: `components/admin/AdminTable.tsx`
- Create: `app/admin/page.tsx`

- [ ] **Step 1: Create components/admin/AdminTable.tsx**

```tsx
'use client'

import Link from 'next/link'
import { Listing } from '@/types/listing'

interface AdminTableProps {
  listings: Listing[]
  onDelete: (id: string) => void
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(price)
}

export default function AdminTable({ listings, onDelete }: AdminTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-eden-border text-left">
            {['Titre', 'Type', 'Prix', 'Statut', 'Vedette', 'Actions'].map((h) => (
              <th key={h} className="pb-3 pr-6 text-xs tracking-widest uppercase text-eden-gold font-normal">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {listings.map((l) => (
            <tr key={l.id} className="border-b border-eden-border/50 hover:bg-eden-surface/50 transition-colors">
              <td className="py-4 pr-6 text-eden-cream font-medium max-w-xs truncate">{l.title}</td>
              <td className="py-4 pr-6 text-eden-muted">{l.type}</td>
              <td className="py-4 pr-6 text-eden-gold">{formatPrice(l.price)}</td>
              <td className="py-4 pr-6">
                <span
                  className={`px-2 py-1 text-xs ${
                    l.status === 'Vendu' ? 'bg-eden-muted/20 text-eden-muted' : 'bg-eden-gold/20 text-eden-gold'
                  }`}
                >
                  {l.status}
                </span>
              </td>
              <td className="py-4 pr-6 text-eden-muted">{l.featured ? '★' : '—'}</td>
              <td className="py-4 pr-6">
                <div className="flex items-center gap-4">
                  <Link
                    href={`/admin/listings/${l.id}`}
                    className="text-eden-gold text-xs hover:underline"
                  >
                    Modifier
                  </Link>
                  <button
                    onClick={() => {
                      if (confirm(`Supprimer "${l.title}" ?`)) onDelete(l.id)
                    }}
                    className="text-red-400 text-xs hover:underline"
                  >
                    Supprimer
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {listings.length === 0 && (
        <p className="text-eden-muted text-sm text-center py-12">Aucune propriété.</p>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Create app/admin/page.tsx**

```tsx
'use client'

import Link from 'next/link'
import { useAdmin } from '@/components/admin/AdminProvider'
import AdminTable from '@/components/admin/AdminTable'

export default function AdminDashboardPage() {
  const { listings, deleteListing } = useAdmin()

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-2xl text-eden-cream mb-1">Propriétés</h1>
          <p className="text-eden-muted text-sm">{listings.length} bien(s) au total</p>
        </div>
        <Link
          href="/admin/listings/new"
          className="px-6 py-3 bg-eden-gold text-eden-bg text-sm tracking-widest uppercase hover:bg-eden-cream transition-colors"
        >
          + Ajouter
        </Link>
      </div>
      <div className="bg-eden-surface border border-eden-border p-6">
        <AdminTable listings={listings} onDelete={deleteListing} />
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```
Expected: Build succeeds.

- [ ] **Step 4: Commit**

```bash
git add components/admin/AdminTable.tsx app/admin/page.tsx
git commit -m "feat: add admin dashboard with listings table, edit links, and delete action"
```

---

## Task 18: ListingForm Component

**Files:**
- Create: `components/admin/ListingForm.tsx`

- [ ] **Step 1: Create components/admin/ListingForm.tsx**

```tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Listing } from '@/types/listing'

interface ListingFormProps {
  initial?: Listing
  onSave: (listing: Listing) => void
}

const emptyListing: Omit<Listing, 'id'> = {
  title: '',
  type: 'Villa',
  status: 'À vendre',
  price: 0,
  location: '',
  bedrooms: 0,
  bathrooms: 0,
  area: 0,
  description: '',
  images: [],
  featured: false,
  amenities: [],
}

const inputClass =
  'w-full bg-eden-bg border border-eden-border text-eden-cream px-4 py-2.5 text-sm focus:outline-none focus:border-eden-gold transition-colors'
const labelClass = 'block text-xs tracking-widest uppercase text-eden-muted mb-1.5'

export default function ListingForm({ initial, onSave }: ListingFormProps) {
  const router = useRouter()
  const [form, setForm] = useState<Omit<Listing, 'id'>>(
    initial ? { ...initial } : { ...emptyListing }
  )
  const [imagesRaw, setImagesRaw] = useState(initial?.images.join(', ') ?? '')
  const [amenitiesRaw, setAmenitiesRaw] = useState(initial?.amenities.join(', ') ?? '')

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const listing: Listing = {
      ...form,
      id: initial?.id ?? `eden-${Date.now()}`,
      images: imagesRaw.split(',').map((s) => s.trim()).filter(Boolean),
      amenities: amenitiesRaw.split(',').map((s) => s.trim()).filter(Boolean),
    }
    onSave(listing)
    router.push('/admin')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      {/* Title */}
      <div>
        <label className={labelClass}>Titre *</label>
        <input required type="text" value={form.title} onChange={(e) => set('title', e.target.value)} className={inputClass} placeholder="Villa Prestige — Cap d'Antibes" />
      </div>

      {/* Type + Status */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className={labelClass}>Type *</label>
          <select value={form.type} onChange={(e) => set('type', e.target.value as Listing['type'])} className={inputClass + ' appearance-none'}>
            <option>Villa</option>
            <option>Appartement</option>
            <option>Penthouse</option>
            <option>Maison</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Statut *</label>
          <select value={form.status} onChange={(e) => set('status', e.target.value as Listing['status'])} className={inputClass + ' appearance-none'}>
            <option>À vendre</option>
            <option>À louer</option>
            <option>Vendu</option>
          </select>
        </div>
      </div>

      {/* Price + Location */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className={labelClass}>Prix (€) *</label>
          <input required type="number" min={0} value={form.price} onChange={(e) => set('price', Number(e.target.value))} className={inputClass} placeholder="4500000" />
        </div>
        <div>
          <label className={labelClass}>Localisation *</label>
          <input required type="text" value={form.location} onChange={(e) => set('location', e.target.value)} className={inputClass} placeholder="Cap d'Antibes, Côte d'Azur" />
        </div>
      </div>

      {/* Bedrooms + Bathrooms + Area */}
      <div className="grid grid-cols-3 gap-6">
        <div>
          <label className={labelClass}>Chambres</label>
          <input type="number" min={0} value={form.bedrooms} onChange={(e) => set('bedrooms', Number(e.target.value))} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Salles de bain</label>
          <input type="number" min={0} value={form.bathrooms} onChange={(e) => set('bathrooms', Number(e.target.value))} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Surface (m²)</label>
          <input type="number" min={0} value={form.area} onChange={(e) => set('area', Number(e.target.value))} className={inputClass} />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className={labelClass}>Description</label>
        <textarea rows={5} value={form.description} onChange={(e) => set('description', e.target.value)} className={inputClass + ' resize-none'} />
      </div>

      {/* Images */}
      <div>
        <label className={labelClass}>URLs des images (séparées par des virgules)</label>
        <textarea rows={3} value={imagesRaw} onChange={(e) => setImagesRaw(e.target.value)} className={inputClass + ' resize-none'} placeholder="https://images.unsplash.com/..., https://..." />
      </div>

      {/* Amenities */}
      <div>
        <label className={labelClass}>Prestations (séparées par des virgules)</label>
        <input type="text" value={amenitiesRaw} onChange={(e) => setAmenitiesRaw(e.target.value)} className={inputClass} placeholder="Piscine, Vue mer, Garage" />
      </div>

      {/* Featured */}
      <div className="flex items-center gap-3">
        <input
          id="featured"
          type="checkbox"
          checked={form.featured}
          onChange={(e) => set('featured', e.target.checked)}
          className="w-4 h-4 accent-eden-gold"
        />
        <label htmlFor="featured" className="text-sm text-eden-muted cursor-pointer">
          Mettre en vedette (affiché sur la page d'accueil)
        </label>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 pt-4 border-t border-eden-border">
        <button
          type="submit"
          className="px-8 py-3 bg-eden-gold text-eden-bg text-sm tracking-widest uppercase hover:bg-eden-cream transition-colors"
        >
          Enregistrer
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin')}
          className="px-8 py-3 border border-eden-border text-eden-muted text-sm tracking-widest uppercase hover:border-eden-gold hover:text-eden-gold transition-colors"
        >
          Annuler
        </button>
      </div>
    </form>
  )
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```
Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add components/admin/ListingForm.tsx
git commit -m "feat: add reusable ListingForm for create and edit listing pages"
```

---

## Task 19: Admin Edit and New Listing Pages

**Files:**
- Create: `app/admin/listings/[id]/page.tsx`
- Create: `app/admin/listings/new/page.tsx`

- [ ] **Step 1: Create app/admin/listings/[id]/page.tsx**

```tsx
'use client'

import { useAdmin } from '@/components/admin/AdminProvider'
import ListingForm from '@/components/admin/ListingForm'
import { Listing } from '@/types/listing'
import { notFound } from 'next/navigation'

export default function EditListingPage({ params }: { params: { id: string } }) {
  const { listings, updateListing } = useAdmin()
  const listing = listings.find((l) => l.id === params.id)

  if (!listing) return notFound()

  function handleSave(updated: Listing) {
    updateListing(updated)
  }

  return (
    <div>
      <h1 className="font-serif text-2xl text-eden-cream mb-8">Modifier la propriété</h1>
      <div className="bg-eden-surface border border-eden-border p-8">
        <ListingForm initial={listing} onSave={handleSave} />
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create app/admin/listings/new/page.tsx**

```tsx
'use client'

import { useAdmin } from '@/components/admin/AdminProvider'
import ListingForm from '@/components/admin/ListingForm'
import { Listing } from '@/types/listing'

export default function NewListingPage() {
  const { addListing } = useAdmin()

  function handleSave(listing: Listing) {
    addListing(listing)
  }

  return (
    <div>
      <h1 className="font-serif text-2xl text-eden-cream mb-8">Ajouter une propriété</h1>
      <div className="bg-eden-surface border border-eden-border p-8">
        <ListingForm onSave={handleSave} />
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```
Expected: Build succeeds.

- [ ] **Step 4: Commit**

```bash
git add app/admin/listings/[id]/page.tsx app/admin/listings/new/page.tsx
git commit -m "feat: add admin edit and new listing pages using shared ListingForm"
```

---

## Task 20: Final Build Verification and Responsive Check

**Files:** No changes — verification only.

- [ ] **Step 1: Run full production build**

```bash
npm run build
```
Expected: Build succeeds. Output should show:
- `/` — static page
- `/about` — static page
- `/contact` — static page (client component)
- `/listings` — static page (client component)
- `/listings/[id]` — 8 static pages (eden-001 through eden-008)
- `/admin` — client page
- `/admin/listings/[id]` — client page
- `/admin/listings/new` — client page

- [ ] **Step 2: Run dev server and verify all pages load**

```bash
npm run dev
```

Visit each route and confirm:
- `http://localhost:3000` — Home page: hero image visible, 3 featured listings shown
- `http://localhost:3000/listings` — All 8 listings shown, filters work, empty state shows when no results
- `http://localhost:3000/listings/eden-001` — Gallery, specs grid, inquiry CTA visible
- `http://localhost:3000/about` — Brand story, values, agent profile visible
- `http://localhost:3000/contact` — Form renders, success message shows on submit
- `http://localhost:3000/admin` — Password gate shown, `eden2024` grants access
- `/admin` dashboard — listings table with all 8 listings
- `/admin/listings/eden-001` — Edit form pre-filled
- `/admin/listings/new` — Empty form, saving adds listing to dashboard

- [ ] **Step 3: Check mobile responsiveness**

In browser DevTools, check at 375px width:
- Navbar shows hamburger menu
- Home hero renders correctly
- Listings grid collapses to 1 column
- Listing detail: specs, gallery, sidebar stack vertically
- Admin sidebar is visible (scrollable on small screens)

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "feat: complete Eden Immobilier luxury real estate frontend prototype"
```
