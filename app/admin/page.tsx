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
          <h1 className="font-serif text-2xl text-eden-cream mb-1">Propri&eacute;t&eacute;s</h1>
          <p className="text-eden-muted text-sm">{listings.length} bien(s) au total</p>
        </div>
        <Link href="/admin/listings/new" className="px-6 py-3 bg-eden-gold text-eden-bg text-sm tracking-widest uppercase hover:bg-eden-cream transition-colors">
          + Ajouter
        </Link>
      </div>
      <div className="bg-eden-surface border border-eden-border p-6">
        <AdminTable listings={listings} onDelete={deleteListing} />
      </div>
    </div>
  )
}
