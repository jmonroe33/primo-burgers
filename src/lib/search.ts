import type { PublicItem } from './types'

export const normalize = (s: string) =>
  s.normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()

/** Text that a menu item can be found by: name, description, ingredients, category, keywords, tags. */
export const buildSearchText = (parts: (string | null | undefined)[]) => {
  const base = normalize(parts.filter(Boolean).join(' '))
  // also index with spaces removed so "cheeseburger" matches "Cheese Burger"
  return `${base} ${base.replace(/ /g, '')}`
}

const variants = (token: string) => {
  const v = [token]
  if (token.length > 3 && token.endsWith('es')) v.push(token.slice(0, -2))
  if (token.length > 3 && token.endsWith('s')) v.push(token.slice(0, -1))
  return v
}

/** Every word typed must appear somewhere in the item's searchable text. */
export function matches(item: PublicItem, query: string): boolean {
  const tokens = normalize(query).split(' ').filter(Boolean)
  if (!tokens.length) return true
  return tokens.every((t) => variants(t).some((v) => item.searchText.includes(v)))
}
