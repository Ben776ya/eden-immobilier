'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const navLinks = [
  { href: '/', label: 'Accueil' },
  { href: '/listings', label: 'Propriétés' },
  { href: '/about', label: 'À propos' },
  { href: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-eden-bg/95 backdrop-blur-sm border-b border-eden-border">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="font-serif text-xl tracking-widest text-eden-gold uppercase">
          Eden Immobilier
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm tracking-wider uppercase transition-colors duration-200 ${
                pathname === link.href
                  ? 'text-eden-gold'
                  : 'text-eden-muted hover:text-eden-cream'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/listings"
            className="ml-4 px-5 py-2 border border-eden-gold text-eden-gold text-sm tracking-wider uppercase hover:bg-eden-gold hover:text-eden-bg transition-colors duration-200"
          >
            Voir les propriétés
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-eden-cream"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <div className="space-y-1.5">
            <span className={`block w-6 h-px bg-eden-cream transition-all ${menuOpen ? 'rotate-45 translate-y-2.5' : ''}`} />
            <span className={`block w-6 h-px bg-eden-cream transition-all ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-px bg-eden-cream transition-all ${menuOpen ? '-rotate-45 -translate-y-2.5' : ''}`} />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-eden-surface border-t border-eden-border px-6 py-6 flex flex-col gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`text-sm tracking-wider uppercase ${
                pathname === link.href ? 'text-eden-gold' : 'text-eden-muted'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/listings"
            onClick={() => setMenuOpen(false)}
            className="px-5 py-2 border border-eden-gold text-eden-gold text-sm tracking-wider uppercase text-center"
          >
            Voir les propriétés
          </Link>
        </div>
      )}
    </nav>
  )
}
