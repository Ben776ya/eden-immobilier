import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-eden-surface border-t border-eden-border">
      <div className="max-w-7xl mx-auto px-6 pt-20 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
          <div>
            <p className="font-serif text-lg tracking-widest text-eden-gold uppercase mb-5">
              Eden Immobilier
            </p>
            <p className="text-eden-muted text-sm leading-relaxed mb-6">
              L&apos;excellence au service de votre patrimoine immobilier. Propriétés de prestige
              sur la Côte d&apos;Azur, à Paris et dans les plus beaux domaines de France.
            </p>
            <div className="w-10 h-px bg-eden-gold/40" />
          </div>

          <div>
            <p className="text-xs tracking-label uppercase text-eden-gold mb-5">Navigation</p>
            <ul className="space-y-3">
              {[
                { href: '/', label: 'Accueil' },
                { href: '/listings', label: 'Propriétés' },
                { href: '/about', label: 'À propos' },
                { href: '/contact', label: 'Contact' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-eden-muted text-sm hover:text-eden-gold transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs tracking-label uppercase text-eden-gold mb-5">Contact</p>
            <ul className="space-y-3 text-eden-muted text-sm">
              <li>12 Avenue Montaigne, Paris 8e</li>
              <li>+33 1 42 00 00 00</li>
              <li>contact@eden-immobilier.fr</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-eden-border mt-14 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-eden-muted text-xs tracking-wider">
          <span>&copy; {new Date().getFullYear()} Eden Immobilier. Tous droits réservés.</span>
          <span className="text-eden-muted/40">Propriétés de prestige en France</span>
        </div>
      </div>
    </footer>
  )
}
