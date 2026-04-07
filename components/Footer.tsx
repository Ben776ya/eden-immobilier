import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-eden-surface border-t border-eden-border">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <p className="font-serif text-lg tracking-widest text-eden-gold uppercase mb-4">
              Eden Immobilier
            </p>
            <p className="text-eden-muted text-sm leading-relaxed">
              L&apos;excellence au service de votre patrimoine immobilier. Propriétés de prestige
              sur la Côte d&apos;Azur, à Paris et dans les plus beaux domaines de France.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-xs tracking-widest uppercase text-eden-gold mb-4">Navigation</p>
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
                    className="text-eden-muted text-sm hover:text-eden-cream transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs tracking-widest uppercase text-eden-gold mb-4">Contact</p>
            <ul className="space-y-3 text-eden-muted text-sm">
              <li>12 Avenue Montaigne, Paris 8e</li>
              <li>+33 1 42 00 00 00</li>
              <li>contact@eden-immobilier.fr</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-eden-border mt-12 pt-8 text-center text-eden-muted text-xs tracking-wider">
          © {new Date().getFullYear()} Eden Immobilier. Tous droits réservés.
        </div>
      </div>
    </footer>
  )
}
