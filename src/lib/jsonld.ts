import type { SiteSetting } from '../payload-types'
import { to24h, DAY_ORDER } from './hours'
import { socialList } from '../components/site/SocialLinks'

/** Schema.org Restaurant data for Google. Only verified, configured details are included. */
export function restaurantJsonLd(s: SiteSetting, siteUrl: string) {
  const a = s.address
  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    '@id': `${siteUrl}/#restaurant`,
    name: s.restaurantName || 'Primo Burgers',
    url: siteUrl,
    servesCuisine: ['American', 'Burgers', 'Breakfast'],
    hasMenu: `${siteUrl}/menu`,
    acceptsReservations: false,
  }
  if (s.phone) data.telephone = s.phone
  if (s.email) data.email = s.email
  if (a?.street) {
    data.address = {
      '@type': 'PostalAddress',
      streetAddress: [a.street, a.unit].filter(Boolean).join(', '),
      addressLocality: a.city,
      addressRegion: a.state,
      postalCode: a.zip,
      addressCountry: 'US',
    }
  }
  if (s.geo?.lat && s.geo?.lng) data.geo = { '@type': 'GeoCoordinates', latitude: s.geo.lat, longitude: s.geo.lng }
  const hours = (s.hours ?? [])
    .filter((h) => !h.closed && to24h(h.open) && to24h(h.close))
    .sort((x, y) => DAY_ORDER.indexOf(x.day) - DAY_ORDER.indexOf(y.day))
    .map((h) => ({ '@type': 'OpeningHoursSpecification', dayOfWeek: `https://schema.org/${h.day}`, opens: to24h(h.open), closes: to24h(h.close) }))
  if (hours.length) data.openingHoursSpecification = hours
  const same = socialList(s).map((x) => x.href)
  if (same.length) data.sameAs = same
  return data
}

export const jsonLdScript = (data: unknown) => ({ __html: JSON.stringify(data).replace(/</g, '\\u003c') })
