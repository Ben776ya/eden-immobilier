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
      <h1 className="font-serif text-2xl text-eden-cream mb-8">Ajouter une propri&eacute;t&eacute;</h1>
      <div className="bg-eden-surface border border-eden-border p-8">
        <ListingForm onSave={handleSave} />
      </div>
    </div>
  )
}
