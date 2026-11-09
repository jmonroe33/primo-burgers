import type { MetadataRoute } from 'next'
import { getMenuItems } from '../lib/data'
import { getSiteUrl } from '../lib/siteUrl'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = getSiteUrl()
  const items = await getMenuItems()
  const pages = [
    { url: `${site}/`, priority: 1 },
    { url: `${site}/menu`, priority: 0.9 },
    { url: `${site}/about`, priority: 0.6 },
    { url: `${site}/contact`, priority: 0.8 },
    { url: `${site}/privacy`, priority: 0.2 },
  ]
  return [
    ...pages.map((p) => ({ ...p, changeFrequency: 'weekly' as const })),
    ...items.map((i) => ({ url: `${site}/menu/${i.slug}`, changeFrequency: 'monthly' as const, priority: 0.5 })),
  ]
}
