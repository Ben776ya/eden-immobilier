interface SpecsGridProps {
  bedrooms: number
  bathrooms: number
  area: number
  amenities: string[]
}

export default function SpecsGrid({ bedrooms, bathrooms, area, amenities }: SpecsGridProps) {
  const specs = [
    { label: 'Chambres', value: bedrooms, unit: '' },
    { label: 'Salles de bain', value: bathrooms, unit: '' },
    { label: 'Surface', value: area, unit: ' m²' },
  ]

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-eden-border mb-8">
        {specs.map((s) => (
          <div key={s.label} className="bg-eden-surface px-6 py-6 text-center">
            <p className="font-serif text-3xl text-eden-gold mb-1">
              {s.value}{s.unit}
            </p>
            <p className="text-eden-muted text-xs tracking-label uppercase">{s.label}</p>
          </div>
        ))}
      </div>

      {amenities.length > 0 && (
        <div>
          <p className="text-xs tracking-label uppercase text-eden-gold mb-4">Prestations</p>
          <div className="flex flex-wrap gap-2">
            {amenities.map((amenity) => (
              <span
                key={amenity}
                className="px-4 py-1.5 border border-eden-border text-eden-muted text-sm tracking-wide hover:border-eden-gold/40 hover:text-eden-cream transition-colors duration-300"
              >
                {amenity}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
