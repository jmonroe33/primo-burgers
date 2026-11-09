import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ItemDetail } from '../../../../components/site/ItemDetail'
import { MenuCard } from '../../../../components/site/MenuCard'
import { ArrowIcon } from '../../../../components/site/icons'
import { getItemBySlug, getMenuItems, getSettings } from '../../../../lib/data'

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return (await getMenuItems()).map((i) => ({ slug: i.slug }))
}

export const dynamicParams = true

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const item = await getItemBySlug((await params).slug)
  if (!item) return { title: 'Item not found', robots: { index: false } }
  return {
    title: `${item.name} — ${item.categoryName}`,
    description: item.description || `${item.name} from the ${item.categoryName} menu at Primo Burgers in Palmdale, CA.`,
    alternates: { canonical: `/menu/${item.slug}` },
    openGraph: item.largeImage ? { images: [{ url: item.largeImage.url, alt: item.largeImage.alt }] } : undefined,
  }
}

export default async function ItemPage({ params }: Props) {
  const { slug } = await params
  const [item, items, settings] = await Promise.all([getItemBySlug(slug), getMenuItems(), getSettings()])
  if (!item) notFound()
  const showPrices = Boolean(settings.showPrices)
  const related = items.filter((i) => i.categorySlug === item.categorySlug && i.id !== item.id).slice(0, 4)
  return (
    <div className="container-x py-8 pb-20 sm:py-12">
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted">
        <ol className="flex flex-wrap items-center gap-2">
          <li><Link href="/menu" className="hover:text-white">Menu</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link href={`/menu?category=${item.categorySlug}`} className="hover:text-white">{item.categoryName}</Link></li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-white">{item.name}</li>
        </ol>
      </nav>
      <div className="card overflow-hidden">
        <ItemDetail item={item} showPrices={showPrices} headingLevel="h1" />
      </div>
      {related.length > 0 && (
        <section className="mt-16" aria-labelledby="related-title">
          <div className="mb-6 flex items-end justify-between gap-4">
            <h2 id="related-title" className="text-2xl font-bold">More {item.categoryName}</h2>
            <Link href={`/menu?category=${item.categorySlug}`} className="inline-flex items-center gap-2 text-sm font-semibold text-rose hover:underline">
              View all <ArrowIcon className="h-4 w-4" />
            </Link>
          </div>
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((r) => (<li key={r.id}><MenuCard item={r} showPrices={showPrices} /></li>))}
          </ul>
        </section>
      )}
    </div>
  )
}
