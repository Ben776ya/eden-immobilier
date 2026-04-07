import Image from 'next/image'
import Link from 'next/link'

const values = [
  {
    title: 'Excellence',
    description: "Chaque propriété est sélectionnée avec le plus grand soin pour répondre aux exigences d'une clientèle d'exception.",
  },
  {
    title: 'Discrétion',
    description: "Toutes nos transactions sont menées avec la plus grande confidentialité, dans le respect absolu de nos clients.",
  },
  {
    title: 'Expertise',
    description: "Nos conseillers disposent d'une connaissance approfondie des marchés immobiliers de prestige en France et à l'international.",
  },
]

export default function AboutPage() {
  return (
    <div className="pt-20">
      <section className="relative h-72 flex items-end justify-start overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80"
          alt="Eden Immobilier"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-eden-bg via-eden-bg/60 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-12">
          <p className="text-xs tracking-[0.4em] uppercase text-eden-gold mb-3">Notre Maison</p>
          <h1 className="font-serif text-5xl text-eden-cream">À Propos</h1>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          <div>
            <h2 className="font-serif text-3xl text-eden-cream mb-6">Notre Histoire</h2>
            <p className="text-eden-muted leading-relaxed mb-5">
              Fondée en 2008 par Alexandre Moreau, Eden Immobilier est née d&apos;une vision : rendre
              l&apos;accès aux propriétés d&apos;exception aussi fluide et plaisant que les biens eux-mêmes.
            </p>
            <p className="text-eden-muted leading-relaxed mb-5">
              En quinze ans, nous avons accompagné plus de 500 familles dans l&apos;acquisition de leur
              résidence de rêve, des appartements haussmanniens du 16e arrondissement aux villas
              de la Côte d&apos;Azur, en passant par les châteaux de Bordeaux et les manoirs normands.
            </p>
            <p className="text-eden-muted leading-relaxed">
              Notre réseau exclusif de propriétés off-market nous distingue sur un marché
              compétitif. Nombre de nos biens ne sont jamais publiés publiquement — ils sont
              réservés à nos clients en portefeuille.
            </p>
          </div>
          <div className="relative h-96">
            <Image
              src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80"
              alt="Propriété Eden Immobilier"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      <section className="bg-eden-surface border-t border-b border-eden-border py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs tracking-[0.4em] uppercase text-eden-gold mb-3">Nos Valeurs</p>
            <h2 className="font-serif text-3xl text-eden-cream">Ce qui nous guide</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((v) => (
              <div key={v.title} className="border border-eden-border p-8 hover:border-eden-gold transition-colors">
                <h3 className="font-serif text-xl text-eden-gold mb-4">{v.title}</h3>
                <p className="text-eden-muted text-sm leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="relative h-96">
            <Image
              src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&q=80"
              alt="Alexandre Moreau — Eden Immobilier"
              fill
              className="object-cover grayscale"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div>
            <p className="text-xs tracking-[0.4em] uppercase text-eden-gold mb-3">Fondateur</p>
            <h2 className="font-serif text-3xl text-eden-cream mb-2">Alexandre Moreau</h2>
            <p className="text-eden-muted text-sm tracking-wider mb-6">Directeur Général — Eden Immobilier</p>
            <p className="text-eden-muted leading-relaxed mb-5">
              Après 10 ans chez Sotheby&apos;s International Realty, Alexandre a fondé Eden Immobilier
              avec la conviction que le marché du luxe méritait une approche plus personnelle,
              plus humaine et plus transparente.
            </p>
            <p className="text-eden-muted leading-relaxed">
              Trilingue (français, anglais, italien), il accompagne personnellement ses clients
              sur les transactions les plus importantes.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-eden-border py-20 px-6 text-center">
        <h2 className="font-serif text-3xl text-eden-cream mb-6">Travaillons ensemble</h2>
        <Link
          href="/contact"
          className="inline-block px-10 py-4 bg-eden-gold text-eden-bg text-sm tracking-widest uppercase hover:bg-eden-cream transition-colors"
        >
          Prendre contact
        </Link>
      </section>
    </div>
  )
}
