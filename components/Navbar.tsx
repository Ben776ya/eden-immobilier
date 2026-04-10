'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState, useEffect, useCallback } from 'react'

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

  const closeMenu = useCallback(() => setMenuOpen(false), [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && menuOpen) closeMenu()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [menuOpen, closeMenu])

  return (
    <nav
      className={`fixed z-50 transition-all duration-500 ${
        scrolled
          ? 'top-4 left-4 right-4 bg-eden-ink/90 backdrop-blur-xl rounded-2xl shadow-luxury-hover border border-eden-white/10'
          : 'top-0 left-0 right-0 bg-transparent'
      }`}
    >
      <div className={`max-w-7xl mx-auto px-6 flex items-center justify-between transition-all duration-500 ${
        scrolled ? 'h-16' : 'h-24'
      }`}>
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="Boy Pro Immobilier"
            width={scrolled ? 100 : 160}
            height={scrolled ? 50 : 80}
            className="object-contain transition-all duration-500"
            style={{ width: scrolled ? 100 : 160, height: 'auto' }}
            priority
          />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm tracking-wider uppercase transition-colors duration-300 ${
                pathname === link.href
                  ? 'text-eden-gold'
                  : 'text-eden-white/70 hover:text-eden-white'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/listings"
            className="ml-4 px-6 py-2.5 border border-eden-gold/60 text-eden-gold text-sm tracking-wider uppercase hover:bg-eden-gold hover:text-eden-ink active:scale-[0.97] transition-all duration-300"
          >
            Voir les biens
          </Link>
        </div>

        <button
          className="md:hidden text-eden-white"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <div className="space-y-1.5">
            <span className={`block w-6 h-px bg-eden-white transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
            <span className={`block w-6 h-px bg-eden-white transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-px bg-eden-white transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
          </div>
        </button>
      </div>

      <div
        className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${
          menuOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className={`px-6 py-8 flex flex-col gap-6 ${
          scrolled
            ? 'border-t border-eden-white/10'
            : 'bg-eden-ink/90 backdrop-blur-xl border-t border-eden-white/10'
        }`}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`text-sm tracking-wider uppercase transition-colors duration-300 ${
                pathname === link.href ? 'text-eden-gold' : 'text-eden-white/70 hover:text-eden-white'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/listings"
            onClick={() => setMenuOpen(false)}
            className="px-5 py-3 border border-eden-gold/60 text-eden-gold text-sm tracking-wider uppercase text-center hover:bg-eden-gold hover:text-eden-ink transition-all duration-300"
          >
            Voir les biens
          </Link>
        </div>
      </div>
    </nav>
  )
}
