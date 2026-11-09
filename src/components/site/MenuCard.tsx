import Image from 'next/image'
import type { MouseEvent } from 'react'
import { formatPrice } from '../../lib/format'
import type { PublicItem } from '../../lib/types'
import { FoodArt } from './FoodArt'

export const TAG_LABEL: Record<string, string> = {
  vegetarian: 'Vegetarian', vegan: 'Vegan', spicy: 'Spicy', 'gluten-free': 'Gluten-free',
}

export function PriceTag({ item, show }: { item: PublicItem; show: boolean }) {
  if (!show) return null
  const p = formatPrice(item.price)
  if (!p && !item.priceNote) return null
  return <span className="font-display font-semibold whitespace-nowrap text-white">{p ?? item.priceNote}</span>
}

export function MenuCard({
  item,
  showPrices,
  onOpen,
  headingLevel: H = 'h3',
  priority = false,
  compactOnMobile = false,
}: {
  item: PublicItem
  showPrices: boolean
  onOpen?: (item: PublicItem, e: MouseEvent<HTMLAnchorElement>) => void
  headingLevel?: 'h2' | 'h3' | 'h4'
  priority?: boolean
  /** Phones: show a compact row (thumbnail + text) so long menus scroll quickly. */
  compactOnMobile?: boolean
}) {
  const c = compactOnMobile
  return (
    <article className={`card group relative flex h-full overflow-hidden ${c ? 'flex-row sm:flex-col' : 'flex-col'} transition duration-200 hover:-translate-y-0.5 hover:border-white/15 ${item.available ? '' : 'opacity-80'}`}>
      <div className={`relative overflow-hidden ${c ? 'aspect-square w-28 shrink-0 sm:aspect-[4/3] sm:w-auto' : 'aspect-[4/3]'}`}>
        {item.image ? (
          <Image
            src={item.image.url}
            alt={item.image.alt || item.name}
            fill
            priority={priority}
            sizes="(min-width: 1280px) 22rem, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <FoodArt icon={item.categoryIcon} className={`h-full w-full ${c ? '[&>span]:hidden sm:[&>span]:block' : ''}`} />
        )}
        {!item.available && (
          <span className={`absolute rounded-full bg-ink/90 font-semibold ${c ? 'inset-x-1.5 bottom-1.5 px-1.5 py-0.5 text-center text-[10px] sm:inset-x-auto sm:top-3 sm:bottom-auto sm:left-3 sm:px-3 sm:py-1 sm:text-xs' : 'top-3 left-3 px-3 py-1 text-xs'}`}>{c ? <><span className="sm:hidden">Unavailable</span><span className="hidden sm:inline">Temporarily unavailable</span></> : 'Temporarily unavailable'}</span>
        )}
      </div>
      <div className={`flex min-w-0 flex-1 flex-col gap-2 ${c ? 'p-4 sm:p-5' : 'p-5'}`}>
        <div className="flex items-start justify-between gap-3">
          <H className={`leading-snug font-semibold ${c ? 'text-base sm:text-lg' : 'text-lg'}`}>
            <a
              href={`/menu/${item.slug}`}
              onClick={onOpen ? (e) => onOpen(item, e) : undefined}
              className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
            >
              {item.name}
            </a>
          </H>
          <PriceTag item={item} show={showPrices} />
        </div>
        {item.description && <p className="line-clamp-2 text-sm leading-relaxed text-muted">{item.description}</p>}
        <div className="mt-auto flex flex-wrap gap-1.5 pt-1">
          <span className="rounded-full bg-white/[0.06] px-2.5 py-1 text-xs text-white/70">{item.categoryName}</span>
          {item.dietaryTags.map((t) => (
            <span key={t} className="rounded-full bg-ok/10 px-2.5 py-1 text-xs text-ok">{TAG_LABEL[t] ?? t}</span>
          ))}
        </div>
      </div>
      {/* keyboard focus ring for the whole card */}
      <span className="pointer-events-none absolute inset-0 rounded-[var(--radius-card)] ring-rose group-has-[a:focus-visible]:ring-[3px]" aria-hidden="true" />
    </article>
  )
}
