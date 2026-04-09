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
        <div className="absolute inset-0 bg-gradient-to-b from-eden-ink/80 via-eden-ink/40 to-eden-ink" />
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <p className="text-xs tracking-label uppercase text-eden-gold mb-6 animate-fade-up">
            L&apos;Excellence Immobilière
          </p>
          <h1 className="text-5xl md:text-7xl text-eden-white mb-8 leading-tight animate-fade-up delay-200 font-semibold">
            Eden Immobilier
          </h1>
          <div className="w-12 h-px bg-eden-gold/50 mx-auto mb-8 animate-fade-in delay-300" />
          <p className="text-eden-white/70 text-lg md:text-xl mb-12 max-w-xl mx-auto leading-relaxed animate-fade-up delay-300">
            Propriétés d&apos;exception pour une clientèle d&apos;exception.
            Découvrez notre sélection exclusive.
          </p>
          <Link
            href="/listings"
            className="inline-block px-10 py-4 border border-eden-gold/60 text-eden-gold text-sm tracking-widest uppercase hover:bg-eden-gold hover:text-eden-ink hover:border-eden-gold active:scale-[0.97] transition-all duration-500 animate-fade-up delay-500"
          >
            Découvrir les propriétés
          </Link>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-eden-white/50 animate-fade-in delay-600">
          <span className="text-xs tracking-widest uppercase">Défiler</span>
          <div className="w-px h-12 bg-gradient-to-b from-eden-white/40 to-transparent" />
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-24 px-6 bg-eden-surface">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs tracking-label uppercase text-eden-gold mb-4">Sélection</p>
            <h2 className="text-4xl text-eden-text mb-5 font-semibold">Propriétés en Vedette</h2>
            <div className="w-10 h-px bg-eden-gold/40 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featured.map((listing) => (
              <PropertyCard key={listing.id} listing={listing} />
            ))}
          </div>
          <div className="text-center mt-16">
            <Link
              href="/listings"
              className="inline-block px-10 py-4 border border-eden-border text-eden-text-muted text-sm tracking-widest uppercase hover:border-eden-gold hover:text-eden-gold transition-all duration-500"
            >
              Voir toutes les propriétés
            </Link>
          </div>
        </div>
      </section>

      {/* About Teaser */}
      <section className="bg-eden-card border-t border-b border-eden-border py-24 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-xs tracking-label uppercase text-eden-gold mb-4">Notre Maison</p>
            <h2 className="text-4xl text-eden-text mb-6 leading-tight font-semibold">
              Un service d&apos;exception pour des biens d&apos;exception
            </h2>
            <div className="w-10 h-px bg-eden-gold/40 mb-6" />
            <p className="text-eden-text-muted leading-relaxed mb-8">
              Eden Immobilier est né d&apos;une passion pour l&apos;architecture et les lieux d&apos;exception.
              Depuis plus de 15 ans, nous accompagnons une clientèle internationale dans
              l&apos;acquisition des plus belles propriétés de France.
            </p>
            <Link
              href="/about"
              className="inline-block text-eden-gold text-sm tracking-widest uppercase border-b border-eden-gold/50 pb-1 hover:text-eden-gold-deep hover:border-eden-gold-deep transition-colors duration-300"
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
      <section className="py-24 px-6 text-center bg-eden-ink">
        <div className="max-w-2xl mx-auto">
          <p className="text-xs tracking-label uppercase text-eden-gold mb-4">Contact</p>
          <h2 className="text-4xl text-eden-white mb-5 font-semibold">
            Un projet immobilier ?
          </h2>
          <div className="w-10 h-px bg-eden-gold/40 mx-auto mb-6" />
          <p className="text-eden-white/70 mb-10 leading-relaxed">
            Notre équipe est à votre disposition pour vous accompagner dans votre projet
            d&apos;acquisition ou de vente d&apos;un bien d&apos;exception.
          </p>
          <Link
            href="/contact"
            className="inline-block px-10 py-4 bg-eden-gold text-eden-ink text-sm tracking-widest uppercase hover:bg-eden-gold-deep active:scale-[0.97] transition-all duration-500"
          >
            Nous Contacter
          </Link>
        </div>
      </section>
    </div>
  )
}
