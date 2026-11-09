import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { FoodArt } from '../../../components/site/FoodArt'
import { OrderButton } from '../../../components/site/OrderProvider'
import { getAbout, toImage } from '../../../lib/data'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Primo Burgers is a family-owned American diner in Palmdale, California serving breakfast, burgers, burritos, sandwiches and dinner.',
  alternates: { canonical: '/about' },
}

const paragraphs = (t?: string | null) => (t ?? '').split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)

export default async function AboutPage() {
  const about = await getAbout()
  const hero = toImage(about.heroImage, 'large')
  const gallery = (about.gallery ?? []).map((g) => toImage(g, 'card')).filter((x): x is NonNullable<typeof x> => Boolean(x))
  const story = paragraphs(about.story)
  return (
    <>
      <section className="container-x grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-2 lg:gap-16">
        <div>
          <p className="eyebrow">Family-owned in Palmdale</p>
          <h1 className="mt-2 text-4xl font-extrabold sm:text-5xl lg:text-6xl">{about.heading}</h1>
          {paragraphs(about.intro).map((p, i) => (
            <p key={i} className="mt-5 text-lg leading-relaxed text-white/80">{p}</p>
          ))}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/menu" className="btn-primary">See the menu</Link>
            <OrderButton className="btn-outline" />
          </div>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem]">
          {hero ? <Image src={hero.url} alt={hero.alt} fill priority sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" /> : <FoodArt icon="plate" className="h-full w-full" />}
        </div>
      </section>

      {story.length > 0 && (
        <section className="bg-mist py-16 text-ink sm:py-24" aria-labelledby="story-title">
          <div className="container-x max-w-3xl">
            <h2 id="story-title" className="text-3xl font-bold sm:text-4xl">{about.storyHeading || 'Our story'}</h2>
            {story.map((p, i) => (<p key={i} className="mt-5 text-lg leading-relaxed text-ink/80">{p}</p>))}
          </div>
        </section>
      )}

      {(about.highlights?.length ?? 0) > 0 && (
        <section className="section" aria-label="What we're about">
          <ul className="container-x grid gap-5 md:grid-cols-3">
            {about.highlights!.map((h) => (
              <li key={h.id ?? h.title} className="card p-7">
                <span className="mb-4 block h-1 w-10 rounded-full bg-burgundy" aria-hidden="true" />
                <h2 className="text-xl font-semibold">{h.title}</h2>
                {h.text && <p className="mt-2 leading-relaxed text-muted">{h.text}</p>}
              </li>
            ))}
          </ul>
        </section>
      )}

      {gallery.length > 0 && (
        <section className="container-x pb-20" aria-label="Restaurant photos">
          <ul className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {gallery.map((g) => (
              <li key={g.url} className="relative aspect-[4/3] overflow-hidden rounded-xl">
                <Image src={g.url} alt={g.alt} fill sizes="(min-width: 768px) 33vw, 50vw" className="object-cover" />
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  )
}
