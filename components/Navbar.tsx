'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

const navLinks = [
  { href: '/', label: 'Accueil' },
  { href: '/listings', label: 'Propriétés' },
  { href: '/about', label: 'À propos' },
  { href: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-eden-bg/98 backdrop-blur-md border-b border-eden-border shadow-lg shadow-black/20'
          : 'bg-eden-bg/80 backdrop-blur-sm border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="font-serif text-xl tracking-widest text-eden-gold uppercase">
          Eden Immobilier
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm tracking-wider uppercase transition-colors duration-300 ${
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
            className="ml-4 px-6 py-2.5 border border-eden-gold/60 text-eden-gold text-sm tracking-wider uppercase hover:bg-eden-gold hover:text-eden-bg transition-all duration-300"
          >
            Voir les biens
          </Link>
        </div>

        <button
          className="md:hidden text-eden-cream"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <div className="space-y-1.5">
            <span className={`block w-6 h-px bg-eden-cream transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
            <span className={`block w-6 h-px bg-eden-cream transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-px bg-eden-cream transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
          </div>
        </button>
      </div>

      <div
        className={`md:hidden overflow-hidden transition-all duration-400 ease-in-out ${
          menuOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-eden-surface border-t border-eden-border px-6 py-8 flex flex-col gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`text-sm tracking-wider uppercase transition-colors duration-300 ${
                pathname === link.href ? 'text-eden-gold' : 'text-eden-muted hover:text-eden-cream'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/listings"
            onClick={() => setMenuOpen(false)}
            className="px-5 py-3 border border-eden-gold/60 text-eden-gold text-sm tracking-wider uppercase text-center hover:bg-eden-gold hover:text-eden-bg transition-all duration-300"
          >
            Voir les biens
          </Link>
        </div>
      </div>
    </nav>
  )
}
