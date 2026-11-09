/** Lean, public-safe shapes passed to client components. */
export type PublicImage = { url: string; alt: string; width?: number; height?: number }

export type PublicCategory = {
  id: number
  name: string
  slug: string
  description?: string | null
  icon: string
  image?: PublicImage | null
  showOnHome?: boolean | null
}

export type PublicItem = {
  id: number
  name: string
  slug: string
  description?: string | null
  ingredients?: string | null
  price?: number | null
  priceNote?: string | null
  image?: PublicImage | null
  largeImage?: PublicImage | null
  gallery: PublicImage[]
  categorySlug: string
  categoryName: string
  categoryIcon: string
  categoryNote?: string | null
  available: boolean
  featured: boolean
  dietaryTags: string[]
  doordashUrl?: string | null
  ubereatsUrl?: string | null
  searchText: string
}

export type OrderLinks = {
  doordashUrl?: string | null
  ubereatsUrl?: string | null
  pickupUrl?: string | null
  pickupLabel?: string | null
  phone?: string | null
}
