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
