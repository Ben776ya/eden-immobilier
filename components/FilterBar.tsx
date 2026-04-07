'use client'

export interface Filters {
  type: string
  status: string
  maxPrice: string
}

interface FilterBarProps {
  filters: Filters
  onChange: (filters: Filters) => void
  totalCount: number
}

export default function FilterBar({ filters, onChange, totalCount }: FilterBarProps) {
  const selectClass =
    'bg-eden-surface border border-eden-border text-eden-cream text-sm px-4 py-2.5 focus:outline-none focus:border-eden-gold appearance-none cursor-pointer'

  return (
    <div className="sticky top-20 z-40 bg-eden-bg/95 backdrop-blur-sm border-b border-eden-border">
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap items-center gap-4">
        <select
          value={filters.type}
          onChange={(e) => onChange({ ...filters, type: e.target.value })}
          className={selectClass}
        >
          <option value="">Tous les types</option>
          <option value="Villa">Villa</option>
          <option value="Appartement">Appartement</option>
          <option value="Penthouse">Penthouse</option>
          <option value="Maison">Maison</option>
        </select>

        <select
          value={filters.status}
          onChange={(e) => onChange({ ...filters, status: e.target.value })}
          className={selectClass}
        >
          <option value="">Tous les statuts</option>
          <option value="À vendre">À vendre</option>
          <option value="À louer">À louer</option>
          <option value="Vendu">Vendu</option>
        </select>

        <select
          value={filters.maxPrice}
          onChange={(e) => onChange({ ...filters, maxPrice: e.target.value })}
          className={selectClass}
        >
          <option value="">Budget max</option>
          <option value="2000000">jusqu&apos;à 2 M€</option>
          <option value="4000000">jusqu&apos;à 4 M€</option>
          <option value="6000000">jusqu&apos;à 6 M€</option>
          <option value="10000000">jusqu&apos;à 10 M€</option>
        </select>

        {(filters.type || filters.status || filters.maxPrice) && (
          <button
            onClick={() => onChange({ type: '', status: '', maxPrice: '' })}
            className="text-eden-muted text-sm hover:text-eden-gold transition-colors underline"
          >
            Réinitialiser
          </button>
        )}

        <span className="ml-auto text-eden-muted text-sm">
          {totalCount} propriété{totalCount !== 1 ? 's' : ''}
        </span>
      </div>
    </div>
  )
}
