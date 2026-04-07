'use client'

import { useAdmin } from '@/components/admin/AdminProvider'
import ListingForm from '@/components/admin/ListingForm'
import { Listing } from '@/types/listing'

export default function EditListingPage({ params }: { params: { id: string } }) {
  const { listings, updateListing } = useAdmin()
  const listing = listings.find((l) => l.id === params.id)

  if (!listing) {
    return (
      <div>
        <p className="text-eden-muted">Propri&eacute;t&eacute; introuvable.</p>
      </div>
    )
  }

  function handleSave(updated: Listing) {
    updateListing(updated)
  }

  return (
    <div>
      <h1 className="font-serif text-2xl text-eden-cream mb-8">Modifier la propri&eacute;t&eacute;</h1>
      <div className="bg-eden-surface border border-eden-border p-8">
        <ListingForm initial={listing} onSave={handleSave} />
      </div>
    </div>
  )
}
