'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { Listing } from '@/types/listing'
import { listings as mockListings } from '@/data/listings'

interface AdminContextValue {
  listings: Listing[]
  updateListing: (updated: Listing) => void
  deleteListing: (id: string) => void
  addListing: (listing: Listing) => void
  isAuthenticated: boolean
  login: (password: string) => boolean
  logout: () => void
}

const AdminContext = createContext<AdminContextValue | null>(null)

const ADMIN_PASSWORD = 'eden2024'

export function useAdmin() {
  const ctx = useContext(AdminContext)
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider')
  return ctx
}

export default function AdminProvider({ children }: { children: ReactNode }) {
  const [listings, setListings] = useState<Listing[]>(mockListings)
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('eden_admin') === 'true'
    }
    return false
  })

  function login(password: string): boolean {
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem('eden_admin', 'true')
      setIsAuthenticated(true)
      return true
    }
    return false
  }

  function logout() {
    sessionStorage.removeItem('eden_admin')
    setIsAuthenticated(false)
  }

  function updateListing(updated: Listing) {
    setListings((prev) => prev.map((l) => (l.id === updated.id ? updated : l)))
  }

  function deleteListing(id: string) {
    setListings((prev) => prev.filter((l) => l.id !== id))
  }

  function addListing(listing: Listing) {
    setListings((prev) => [...prev, listing])
  }

  return (
    <AdminContext.Provider value={{ listings, updateListing, deleteListing, addListing, isAuthenticated, login, logout }}>
      {children}
    </AdminContext.Provider>
  )
}
