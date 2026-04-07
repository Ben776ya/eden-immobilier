export interface Listing {
  id: string
  title: string
  type: 'Villa' | 'Appartement' | 'Penthouse' | 'Maison'
  status: 'À vendre' | 'À louer' | 'Vendu'
  price: number
  location: string
  bedrooms: number
  bathrooms: number
  area: number
  description: string
  images: string[]
  featured: boolean
  amenities: string[]
}
