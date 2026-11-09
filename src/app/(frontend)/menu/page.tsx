import type { Metadata } from 'next'
import { MenuBrowser } from '../../../components/site/MenuBrowser'
import { getCategories, getMenuItems, getSettings } from '../../../lib/data'
import { jsonLdScript } from '../../../lib/jsonld'
import { getSiteUrl } from '../../../lib/siteUrl'

export const metadata: Metadata = {
  title: 'Menu',
  description:
    'The full Primo Burgers menu: burgers, breakfast burritos, pancakes, omelettes, sandwiches, dinner plates, sides and drinks in Palmdale, CA. Search and order online.',
  alternates: { canonical: '/menu' },
}

export default async function MenuPage() {
  const [categories, items, settings] = await Promise.all([getCategories(), getMenuItems(), getSettings()])
  const showPrices = Boolean(settings.showPrices)
  const site = getSiteUrl()
  const menuLd = {
    '@context': 'https://schema.org',
    '@type': 'Menu',
    name: 'Primo Burgers Menu',
    url: `${site}/menu`,
    hasMenuSection: categories.map((c) => ({
      '@type': 'MenuSection',
      name: c.name,
      ...(c.description ? { description: c.description } : {}),
      hasMenuItem: items
        .filter((i) => i.categorySlug === c.slug)
        .map((i) => ({
          '@type': 'MenuItem',
          name: i.name,
          url: `${site}/menu/${i.slug}`,
          ...(i.description ? { description: i.description } : {}),
          ...(showPrices && typeof i.price === 'number'
            ? { offers: { '@type': 'Offer', price: i.price.toFixed(2), priceCurrency: 'USD' } }
            : {}),
        })),
    })),
  }

  return (
    <div className="container-x pb-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(menuLd)} />
      <header className="pt-10 pb-6 sm:pt-14">
        <p className="eyebrow">Primo Burgers · Palmdale</p>
        <h1 className="mt-2 text-4xl font-extrabold sm:text-5xl lg:text-6xl">Explore Our Menu</h1>
        <p className="mt-3 max-w-2xl text-muted sm:text-lg">
          Breakfast, burgers, burritos, sandwiches, dinner plates and more. Tap any item for details and ordering options.
        </p>
      </header>
      {items.length ? (
        <MenuBrowser categories={categories} items={items} showPrices={showPrices} />
      ) : (
        <p className="py-20 text-center text-muted">Our menu is being updated — please check back soon.</p>
      )}
    </div>
  )
}
