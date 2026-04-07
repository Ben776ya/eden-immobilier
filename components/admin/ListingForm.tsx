'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Listing } from '@/types/listing'

interface ListingFormProps {
  initial?: Listing
  onSave: (listing: Listing) => void
}

const emptyListing = {
  title: '',
  type: 'Villa' as Listing['type'],
  status: '\u00c0 vendre' as Listing['status'],
  price: 0,
  location: '',
  bedrooms: 0,
  bathrooms: 0,
  area: 0,
  description: '',
  images: [] as string[],
  featured: false,
  amenities: [] as string[],
}

const inputClass = 'w-full bg-eden-bg border border-eden-border text-eden-cream px-4 py-2.5 text-sm focus:outline-none focus:border-eden-gold transition-colors'
const labelClass = 'block text-xs tracking-widest uppercase text-eden-muted mb-1.5'

export default function ListingForm({ initial, onSave }: ListingFormProps) {
  const router = useRouter()
  const [form, setForm] = useState(initial ? { ...initial } : { ...emptyListing })
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
      <div>
        <label className={labelClass}>Titre *</label>
        <input required type="text" value={form.title} onChange={(e) => set('title', e.target.value)} className={inputClass} placeholder="Villa Prestige — Cap d&apos;Antibes" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
            <option>\u00c0 vendre</option>
            <option>\u00c0 louer</option>
            <option>Vendu</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className={labelClass}>Prix (\u20ac) *</label>
          <input required type="number" min={0} value={form.price} onChange={(e) => set('price', Number(e.target.value))} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Localisation *</label>
          <input required type="text" value={form.location} onChange={(e) => set('location', e.target.value)} className={inputClass} placeholder="Cap d&apos;Antibes, C\u00f4te d&apos;Azur" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div>
          <label className={labelClass}>Chambres</label>
          <input type="number" min={0} value={form.bedrooms} onChange={(e) => set('bedrooms', Number(e.target.value))} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Salles de bain</label>
          <input type="number" min={0} value={form.bathrooms} onChange={(e) => set('bathrooms', Number(e.target.value))} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Surface (m\u00b2)</label>
          <input type="number" min={0} value={form.area} onChange={(e) => set('area', Number(e.target.value))} className={inputClass} />
        </div>
      </div>

      <div>
        <label className={labelClass}>Description</label>
        <textarea rows={5} value={form.description} onChange={(e) => set('description', e.target.value)} className={inputClass + ' resize-none'} />
      </div>

      <div>
        <label className={labelClass}>URLs des images (s\u00e9par\u00e9es par des virgules)</label>
        <textarea rows={3} value={imagesRaw} onChange={(e) => setImagesRaw(e.target.value)} className={inputClass + ' resize-none'} placeholder="https://images.unsplash.com/..., https://..." />
      </div>

      <div>
        <label className={labelClass}>Prestations (s\u00e9par\u00e9es par des virgules)</label>
        <input type="text" value={amenitiesRaw} onChange={(e) => setAmenitiesRaw(e.target.value)} className={inputClass} placeholder="Piscine, Vue mer, Garage" />
      </div>

      <div className="flex items-center gap-3">
        <input id="featured" type="checkbox" checked={form.featured} onChange={(e) => set('featured', e.target.checked)} className="w-4 h-4 accent-eden-gold" />
        <label htmlFor="featured" className="text-sm text-eden-muted cursor-pointer">
          Mettre en vedette (affich\u00e9 sur la page d&apos;accueil)
        </label>
      </div>

      <div className="flex items-center gap-4 pt-4 border-t border-eden-border">
        <button type="submit" className="px-8 py-3 bg-eden-gold text-eden-bg text-sm tracking-widest uppercase hover:bg-eden-cream transition-colors">
          Enregistrer
        </button>
        <button type="button" onClick={() => router.push('/admin')} className="px-8 py-3 border border-eden-border text-eden-muted text-sm tracking-widest uppercase hover:border-eden-gold hover:text-eden-gold transition-colors">
          Annuler
        </button>
      </div>
    </form>
  )
}
