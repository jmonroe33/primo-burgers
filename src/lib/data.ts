import config from '@payload-config'
import { getPayload, type Where } from 'payload'
import { cache } from 'react'
import type { Category, Media, MenuItem } from '../payload-types'
import { buildSearchText } from './search'
import { getSiteUrl } from './siteUrl'
import type { OrderLinks, PublicCategory, PublicImage, PublicItem } from './types'

export const getClient = cache(() => getPayload({ config }))

export const getSettings = cache(async () => (await getClient()).findGlobal({ slug: 'site-settings', depth: 0 }))
export const getHome = cache(async () => (await getClient()).findGlobal({ slug: 'home-page', depth: 1 }))
export const getAbout = cache(async () => (await getClient()).findGlobal({ slug: 'about-page', depth: 1 }))

export const toImage = (m: unknown, size?: 'thumb' | 'card' | 'large'): PublicImage | null => {
  if (!m || typeof m !== 'object') return null
  const media = m as Media
  const s = size ? media.sizes?.[size] : undefined
  const raw = s?.url || media.url
  if (!raw) return null
  // Payload returns absolute URLs on our own domain; keep them relative so next/image treats them as local.
  const url = raw.startsWith(getSiteUrl()) ? raw.slice(getSiteUrl().length) || '/' : raw
  return {
    url,
    alt: media.alt || '',
    width: (s?.url ? s.width : media.width) ?? undefined,
    height: (s?.url ? s.height : media.height) ?? undefined,
  }
}

const visible: Where = { and: [{ hidden: { not_equals: true } }, { _status: { equals: 'published' } }] }

export const getCategories = cache(async (): Promise<PublicCategory[]> => {
  const payload = await getClient()
  const { docs } = await payload.find({
    collection: 'categories',
    where: visible,
    sort: '_order',
    limit: 200,
    depth: 1,
  })
  return docs.map((c: Category) => ({
    id: c.id,
    name: c.name,
    slug: c.slug ?? String(c.id),
    description: c.description,
    icon: c.icon ?? 'burger',
    image: toImage(c.image, 'card'),
    showOnHome: c.showOnHome,
  }))
})

export const getMenuItems = cache(async (): Promise<PublicItem[]> => {
  const payload = await getClient()
  const categories = await getCategories()
  const catById = new Map(categories.map((c) => [c.id, c]))
  const { docs } = await payload.find({
    collection: 'menu-items',
    where: visible,
    sort: '_order',
    limit: 2000,
    depth: 1,
  })
  return docs
    .map((d: MenuItem) => {
      const catId = typeof d.category === 'object' ? d.category?.id : d.category
      const cat = catId != null ? catById.get(catId) : undefined
      if (!cat) return null // category hidden, unpublished or deleted → item not shown
      const item: PublicItem = {
        id: d.id,
        name: d.name,
        slug: d.slug ?? String(d.id),
        description: d.description,
        ingredients: d.ingredients,
        price: d.price,
        priceNote: d.priceNote,
        image: toImage(d.image, 'card'),
        largeImage: toImage(d.image, 'large'),
        gallery: (d.additionalImages ?? []).map((m) => toImage(m, 'card')).filter(Boolean) as PublicImage[],
        categorySlug: cat.slug,
        categoryName: cat.name,
        categoryIcon: cat.icon,
        categoryNote: cat.description,
        available: d.available !== false,
        featured: Boolean(d.featured),
        dietaryTags: d.dietaryTags ?? [],
        doordashUrl: d.doordashUrl,
        ubereatsUrl: d.ubereatsUrl,
        searchText: buildSearchText([
          d.name, d.description, d.ingredients, cat.name, cat.description, d.searchKeywords, (d.dietaryTags ?? []).join(' '),
        ]),
      }
      return item
    })
    .filter((x): x is PublicItem => Boolean(x))
})

export const getItemBySlug = cache(async (slug: string) => (await getMenuItems()).find((i) => i.slug === slug) ?? null)

export const getOrderLinks = cache(async (): Promise<OrderLinks> => {
  const s = await getSettings()
  return {
    doordashUrl: s.doordashUrl,
    ubereatsUrl: s.ubereatsUrl,
    pickupUrl: s.pickupUrl,
    pickupLabel: s.pickupLabel,
    phone: s.phone,
  }
})
