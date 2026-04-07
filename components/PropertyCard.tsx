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
      <div className="relative overflow-hidden bg-eden-surface border border-eden-border hover:border-eden-gold/50 transition-all duration-500">
        <div className="relative h-72 overflow-hidden">
          <Image
            src={listing.images[0]}
            alt={listing.title}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-eden-bg/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute top-4 left-4">
            <span
              className={`px-3 py-1 text-xs tracking-widest uppercase font-medium ${
                listing.status === 'Vendu'
                  ? 'bg-eden-muted/90 text-eden-bg'
                  : 'bg-eden-gold text-eden-bg'
              }`}
            >
              {listing.status}
            </span>
          </div>
        </div>
        <div className="p-6">
          <p className="text-xs tracking-label uppercase text-eden-gold/80 mb-2">{listing.type} — {listing.location}</p>
          <h3 className="font-serif text-lg text-eden-cream mb-4 leading-snug group-hover:text-eden-gold transition-colors duration-300">
            {listing.title}
          </h3>
          <div className="flex items-center gap-5 text-eden-muted text-sm mb-5 border-t border-eden-border pt-4">
            <span>{listing.bedrooms} ch.</span>
            <span className="w-px h-3 bg-eden-border-light" />
            <span>{listing.bathrooms} sdb.</span>
            <span className="w-px h-3 bg-eden-border-light" />
            <span>{listing.area} m²</span>
          </div>
          <p className="font-serif text-xl text-eden-gold">
            {formatPrice(listing.price, listing.status)}
          </p>
        </div>
      </div>
    </Link>
  )
}
