'use client'

import { useAdmin } from '@/components/admin/AdminProvider'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

function PasswordGate() {
  const { login } = useAdmin()
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const ok = login(password)
    if (!ok) setError(true)
  }

  return (
    <div className="min-h-screen bg-eden-bg flex items-center justify-center px-6">
      <div className="w-full max-w-sm bg-eden-surface border border-eden-border p-10">
        <p className="font-serif text-xl text-eden-gold text-center mb-2">Eden Immobilier</p>
        <p className="text-eden-muted text-sm text-center mb-8 tracking-wider">Administration</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(false) }}
            placeholder="Mot de passe"
            className="w-full bg-eden-bg border border-eden-border text-eden-cream px-4 py-3 focus:outline-none focus:border-eden-gold transition-colors"
          />
          {error && <p className="text-red-400 text-xs tracking-wide">Mot de passe incorrect.</p>}
          <button type="submit" className="w-full py-3 bg-eden-gold text-eden-bg text-sm tracking-widest uppercase hover:bg-eden-cream transition-colors">
            Acc&eacute;der
          </button>
        </form>
      </div>
    </div>
  )
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, logout } = useAdmin()
  const pathname = usePathname()

  if (!isAuthenticated) return <PasswordGate />

  const navItems = [
    { href: '/admin', label: 'Propri\u00e9t\u00e9s' },
    { href: '/admin/listings/new', label: 'Ajouter' },
  ]

  return (
    <div className="min-h-screen bg-eden-bg flex flex-col md:flex-row">
      {/* Mobile top bar */}
      <div className="md:hidden flex items-center justify-between px-6 py-4 bg-eden-surface border-b border-eden-border">
        <p className="font-serif text-eden-gold tracking-widest text-sm uppercase">Eden Admin</p>
        <div className="flex items-center gap-4">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className={`text-xs tracking-wide uppercase transition-colors ${pathname === item.href ? 'text-eden-gold' : 'text-eden-muted'}`}>
              {item.label}
            </Link>
          ))}
          <button onClick={logout} className="text-xs text-eden-muted hover:text-eden-cream transition-colors">
            Quitter
          </button>
        </div>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-56 bg-eden-surface border-r border-eden-border flex-col">
        <div className="p-6 border-b border-eden-border">
          <p className="font-serif text-eden-gold tracking-widest text-sm uppercase">Eden</p>
          <p className="text-eden-muted text-xs tracking-wider">Administration</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-4 py-2.5 text-sm tracking-wide transition-colors ${
                pathname === item.href ? 'bg-eden-burgundy text-eden-cream' : 'text-eden-muted hover:text-eden-cream hover:bg-eden-bg'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-eden-border">
          <button onClick={logout} className="w-full text-left px-4 py-2.5 text-sm text-eden-muted hover:text-eden-cream transition-colors">
            Déconnexion
          </button>
        </div>
      </aside>

      <main className="flex-1 p-4 md:p-8 overflow-auto">{children}</main>
    </div>
  )
}
