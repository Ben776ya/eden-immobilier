'use client'

import Link from 'next/link'
import { Listing } from '@/types/listing'

interface AdminTableProps {
  listings: Listing[]
  onDelete: (id: string) => void
}

function formatPrice(price: number) {
  return price.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' MAD'
}

export default function AdminTable({ listings, onDelete }: AdminTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-eden-border text-left">
            {['Titre', 'Type', 'Prix', 'Statut', 'Vedette', 'Actions'].map((h) => (
              <th key={h} className="pb-3 pr-6 text-xs tracking-widest uppercase text-eden-gold font-normal">{h}</th>
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
                <span className={`px-2 py-1 text-xs ${l.status === 'Vendu' ? 'bg-eden-muted/20 text-eden-muted' : 'bg-eden-gold/20 text-eden-gold'}`}>
                  {l.status}
                </span>
              </td>
              <td className="py-4 pr-6 text-eden-muted">{l.featured ? '★' : '—'}</td>
              <td className="py-4 pr-6">
                <div className="flex items-center gap-4">
                  <Link href={`/admin/listings/${l.id}`} className="text-eden-gold text-xs hover:underline">Modifier</Link>
                  <button
                    onClick={() => { if (confirm(`Supprimer "${l.title}" ?`)) onDelete(l.id) }}
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
        <p className="text-eden-muted text-sm text-center py-12">Aucune propri&eacute;t&eacute;.</p>
      )}
    </div>
  )
}
