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
    currency: 'MAD',
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
          <div className="lg:col-span-2">
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs tracking-label uppercase text-eden-gold">
                  {listing.type}
                </span>
                <span className="w-px h-3 bg-eden-border-light" />
                <span className="text-xs tracking-label uppercase text-eden-muted">
                  {listing.location}
                </span>
                <span
                  className={`ml-auto px-3 py-1 text-xs tracking-widest uppercase ${
                    listing.status === 'Vendu'
                      ? 'bg-eden-muted/90 text-eden-bg'
                      : 'bg-eden-gold text-eden-bg'
                  }`}
                >
                  {listing.status}
                </span>
              </div>
              <h1 className="font-serif text-4xl md:text-5xl text-eden-cream mb-5 leading-tight">
                {listing.title}
              </h1>
              <div className="w-10 h-px bg-eden-gold/40 mb-5" />
              <p className="font-serif text-3xl text-eden-gold">
                {formatPrice(listing.price, listing.status)}
              </p>
            </div>

            <div className="mb-10">
              <SpecsGrid
                bedrooms={listing.bedrooms}
                bathrooms={listing.bathrooms}
                area={listing.area}
                amenities={listing.amenities}
              />
            </div>

            <div>
              <p className="text-xs tracking-label uppercase text-eden-gold mb-4">Description</p>
              <p className="text-eden-muted leading-relaxed text-lg">{listing.description}</p>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-eden-surface border border-eden-border p-8">
              <p className="font-serif text-xl text-eden-cream mb-2">Intéressé par ce bien ?</p>
              <p className="text-eden-muted text-sm mb-6 leading-relaxed">
                Contactez notre équipe pour organiser une visite ou obtenir plus d&apos;informations.
              </p>
              <Link
                href="/contact"
                className="block text-center px-6 py-4 bg-eden-gold text-eden-bg text-sm tracking-widest uppercase hover:bg-eden-gold-light active:scale-[0.97] transition-all duration-500 mb-4"
              >
                Demander une visite
              </Link>
              <Link
                href="/contact"
                className="block text-center px-6 py-3 border border-eden-border text-eden-muted text-sm tracking-widest uppercase hover:border-eden-gold hover:text-eden-gold transition-all duration-500"
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

        <div className="mt-16 pt-10 border-t border-eden-border">
          <Link
            href="/listings"
            className="text-eden-muted text-sm tracking-wider hover:text-eden-gold transition-colors duration-300"
          >
            &larr; Retour aux propriétés
          </Link>
        </div>
      </div>
    </div>
  )
}
