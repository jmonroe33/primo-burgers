'use client'
import Image from 'next/image'
import { formatPhone, formatPrice, telHref } from '../../lib/format'
import type { PublicItem } from '../../lib/types'
import { FoodArt } from './FoodArt'
import { TAG_LABEL } from './MenuCard'
import { providersFor } from '../../lib/providers'
import { useOrder } from './OrderProvider'
import { ProviderButtons } from './ProviderButtons'

/** Full item details — used inside the menu modal and on /menu/[slug]. */
export function ItemDetail({ item, showPrices, titleId, headingLevel: H = 'h2' }: { item: PublicItem; showPrices: boolean; titleId?: string; headingLevel?: 'h1' | 'h2' }) {
  const { links } = useOrder()
  const providers = providersFor(links, item)
  const price = formatPrice(item.price) ?? item.priceNote
  const tel = telHref(links.phone)
  const img = item.largeImage ?? item.image
  return (
    <div className="grid md:grid-cols-[1.1fr_1fr]">
      <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[26rem]">
        {img ? (
          <Image src={img.url} alt={img.alt || item.name} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" priority />
        ) : (
          <FoodArt icon={item.categoryIcon} className="h-full w-full" />
        )}
      </div>
      <div className="flex flex-col gap-4 p-6 sm:p-8">
        <p className="eyebrow">{item.categoryName}</p>
        <div className="flex items-start justify-between gap-4">
          <H id={titleId} className="text-3xl leading-tight font-bold">{item.name}</H>
          {showPrices && price && <span className="mt-1 font-display text-2xl font-semibold">{price}</span>}
        </div>
        {!item.available && (
          <p className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm">
            <strong>Temporarily unavailable.</strong> Please check back soon.
          </p>
        )}
        {item.description && <p className="leading-relaxed text-white/85">{item.description}</p>}
        {item.categoryNote && <p className="text-sm leading-relaxed text-muted">{item.categoryNote}</p>}
        {item.ingredients && (
          <div>
            <h3 className="mb-1 text-sm font-semibold text-white/70">Ingredients</h3>
            <p className="text-sm leading-relaxed text-muted">{item.ingredients}</p>
          </div>
        )}
        {item.dietaryTags.length > 0 && (
          <ul className="flex flex-wrap gap-2" aria-label="Dietary information">
            {item.dietaryTags.map((t) => (
              <li key={t} className="rounded-full bg-ok/10 px-3 py-1 text-sm text-ok">{TAG_LABEL[t] ?? t}</li>
            ))}
          </ul>
        )}
        {item.gallery.length > 0 && (
          <ul className="grid grid-cols-3 gap-2" aria-label="More photos">
            {item.gallery.map((g) => (
              <li key={g.url} className="relative aspect-square overflow-hidden rounded-lg">
                <Image src={g.url} alt={g.alt || item.name} fill sizes="10rem" className="object-cover" />
              </li>
            ))}
          </ul>
        )}
        <div className="mt-auto space-y-3 pt-4">
          {item.available && providers.length > 0 && (
            <>
              <h3 className="text-sm font-semibold text-white/70">Order this online</h3>
              <ProviderButtons providers={providers} />
            </>
          )}
          {tel && (
            <a href={tel} className="btn-outline w-full">Call {formatPhone(links.phone)}</a>
          )}
        </div>
      </div>
    </div>
  )
}
