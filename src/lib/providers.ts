import type { OrderLinks } from './types'

export type OpenArgs = { itemName?: string; doordashUrl?: string | null; ubereatsUrl?: string | null }

export type Provider = { key: string; name: string; href: string; tagline: string; color: string }

/** Build the list of configured ordering providers. Unconfigured ones are simply left out. */
export function providersFor(links: OrderLinks, item?: OpenArgs): Provider[] {
  const list: Provider[] = []
  const dd = item?.doordashUrl || links.doordashUrl
  const ue = item?.ubereatsUrl || links.ubereatsUrl
  if (dd) list.push({ key: 'doordash', name: 'DoorDash', href: dd, tagline: 'Delivery or pickup through DoorDash', color: '#EB1700' })
  if (ue) list.push({ key: 'ubereats', name: 'Uber Eats', href: ue, tagline: 'Delivery or pickup through Uber Eats', color: '#06C167' })
  if (links.pickupUrl)
    list.push({ key: 'pickup', name: links.pickupLabel || 'Order for pickup', href: links.pickupUrl, tagline: 'Order ahead directly from the restaurant', color: '#800020' })
  return list
}
