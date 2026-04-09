import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-eden-ink border-t border-eden-white/10">
      <div className="max-w-7xl mx-auto px-6 pt-20 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-10">
          <div>
            <p className="text-lg tracking-widest text-eden-gold uppercase mb-5 font-semibold">
              Eden Immobilier
            </p>
            <p className="text-eden-white/60 text-sm leading-relaxed mb-6">
              L&apos;excellence au service de votre patrimoine immobilier. Propriétés de prestige
              à Casablanca et dans les plus belles villes du Maroc.
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
                    className="text-eden-white/60 text-sm hover:text-eden-gold transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs tracking-label uppercase text-eden-gold mb-5">Contact</p>
            <ul className="space-y-3 text-eden-white/60 text-sm">
              <li>Quartier Maarif, Casablanca</li>
              <li>+212 5 22 00 00 00</li>
              <li>contact@eden-immobilier.ma</li>
            </ul>
          </div>

          <div>
            <p className="text-xs tracking-label uppercase text-eden-gold mb-5">Notre siège</p>
            <div className="rounded-lg overflow-hidden border border-eden-white/10">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3323.846!2d-7.6322!3d33.5883!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda7d2e9deb0b0b5%3A0x0!2sMaarif%2C+Casablanca!5e0!3m2!1sfr!2sma!4v1700000000000!5m2!1sfr!2sma"
                width="100%"
                height="180"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Eden Immobilier — Maarif, Casablanca"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-eden-white/10 mt-14 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-eden-white/40 text-xs tracking-wider">
          <span>&copy; {new Date().getFullYear()} Eden Immobilier. Tous droits réservés.</span>
          <span>Propriétés de prestige au Maroc</span>
        </div>
      </div>
    </footer>
  )
}
