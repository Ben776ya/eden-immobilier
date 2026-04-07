# Eden Immobilier — Luxury Real Estate Website Design Spec

**Date:** 2026-03-29
**Type:** Frontend Prototype (Next.js, no backend)

---

## 1. Project Overview

Eden Immobilier is a luxury real estate brand website combining agency showcase and agent personal brand. The site allows buyers to browse property listings and view detailed property pages. An admin dashboard allows the agency to manage listings and their specs.

**Scope:** Frontend-only prototype with hardcoded mock data. No backend, no real authentication, no database. Admin changes live in React state only. Backend integration is a future phase.

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Data | Hardcoded JSON (`/data/listings.json`) |
| Images | `next/image` (Unsplash placeholder URLs) |
| Typography | `next/font` — Playfair Display (headings) + DM Sans (body) |

---

## 3. Color System

| Role | Name | Hex |
|---|---|---|
| Background | Deep Charcoal | `#0F0D0D` |
| Surface | Dark Burgundy | `#2A0D0D` |
| Primary Accent | Rich Burgundy | `#7B1D1D` |
| Highlight | Antique Gold | `#C9A84C` |
| Text Primary | Cream White | `#F5F0E8` |
| Text Muted | Warm Gray | `#9E9289` |
| Border/Divider | Dark Gold | `#6B5A2E` |

**Typography:**
- Headings: `Playfair Display` — serif, classic luxury feel
- Body/UI: `DM Sans` — clean, modern, highly readable

---

## 4. Site Structure

### Public Pages

| Page | Route | Purpose |
|---|---|---|
| Home | `/` | Hero section, featured listings, about teaser, contact CTA |
| Listings | `/listings` | Full property grid with filter bar |
| Listing Detail | `/listings/[id]` | Image gallery, full specs, inquiry CTA |
| About | `/about` | Brand story, agent profile, values |
| Contact | `/contact` | Static contact form |

### Admin Pages

| Page | Route | Purpose |
|---|---|---|
| Admin Dashboard | `/admin` | Table of all listings, edit/delete actions |
| Edit Listing | `/admin/listings/[id]` | Form to edit listing fields |
| New Listing | `/admin/listings/new` | Form to create a new listing |

**Admin access:** Protected by a hardcoded password check (no real auth). Prototype only.

---

## 5. Listing Data Model

```ts
interface Listing {
  id: string;                  // e.g. "eden-001"
  title: string;               // e.g. "Villa Prestige — Cap d'Antibes"
  type: "Villa" | "Appartement" | "Penthouse" | "Maison";
  status: "À vendre" | "À louer" | "Vendu";
  price: number;               // in EUR
  location: string;            // city/region
  bedrooms: number;
  bathrooms: number;
  area: number;                // in m²
  description: string;
  images: string[];            // array of URLs
  featured: boolean;           // shown on home page
  amenities: string[];         // e.g. ["Piscine", "Vue mer", "Garage"]
}
```

**Mock data:** 6–8 listings (mix of villas, apartments, penthouses) using high-quality Unsplash placeholder images.

---

## 6. Components

| Component | Description |
|---|---|
| `Navbar` | Logo left, nav links right, gold CTA button ("Voir les propriétés") |
| `Footer` | Brand info, links, social icons |
| `PropertyCard` | Listing thumbnail with price overlay, title, location, key specs |
| `ImageGallery` | Fullscreen swipeable gallery on listing detail page |
| `SpecsGrid` | Icon + value pairs for bedrooms, bathrooms, area, amenities |
| `FilterBar` | Dropdowns for property type, price range, location on `/listings` |
| `AdminTable` | Sortable listing table with edit/delete action buttons |
| `ListingForm` | Reusable form shared by new and edit listing pages |

---

## 7. Page Designs

### Home (`/`)
- **Hero:** Fullscreen cinematic image, Eden Immobilier logo/tagline centered, scroll indicator
- **Featured Listings:** 3-card horizontal strip of `featured: true` properties
- **About Teaser:** 2-column — brand statement left, agent photo right
- **Contact CTA:** Full-width dark section with gold "Nous Contacter" button

### Listings (`/listings`)
- **Filter Bar:** sticky top bar with type, price range, location filters
- **Grid:** responsive 3-column card grid (2 on tablet, 1 on mobile)
- **Empty State:** elegant "Aucun résultat" message if filters return nothing

### Listing Detail (`/listings/[id]`)
- **Image Gallery:** large hero image + thumbnail strip, click to fullscreen
- **Specs Header:** title, location, price (gold), status badge
- **SpecsGrid:** bedrooms, bathrooms, area, amenities icons grid
- **Description:** full property description
- **Inquiry CTA:** sticky sidebar or bottom bar — "Demander une visite" button

### About (`/about`)
- Brand story, core values, agent name/bio/photo

### Contact (`/contact`)
- Static form: name, email, phone, message, property interest
- No submission handler (prototype) — shows success state on submit click

### Admin Dashboard (`/admin`)
- Simple password gate (hardcoded)
- Table: listing title, type, price, status, actions (Edit / Delete)
- "Ajouter une propriété" button → `/admin/listings/new`

### Admin Listing Form (`/admin/listings/[id]` and `/admin/listings/new`)
- Fields: title, type, status, price, location, bedrooms, bathrooms, area, description, image URLs (comma-separated), amenities (comma-separated), featured toggle
- Save/Cancel buttons

---

## 8. Routing & Navigation

- Public navbar visible on all public pages, hidden on `/admin` routes
- Admin has its own minimal sidebar layout
- All routing via Next.js App Router (file-based)
- Listing detail pages use `generateStaticParams` for SSG

---

## 9. Out of Scope (This Phase)

- Real backend / database
- Real authentication
- Image uploads (URLs only)
- Email sending from contact/inquiry forms
- Animations beyond Tailwind transitions
- Multi-language support
- Map integration

---

## 10. Success Criteria

- All 5 public pages render correctly with mock data
- Listing detail page shows full gallery + specs for each mock listing
- Admin dashboard lists all mock listings and renders the edit form
- Site is fully responsive (mobile, tablet, desktop)
- Design feels premium: consistent use of the burgundy/gold palette, Playfair Display headings, luxury spacing
