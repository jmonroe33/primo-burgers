import Image from 'next/image'
import Link from 'next/link'
import { FoodArt } from '../../components/site/FoodArt'
import { HeroBurger } from '../../components/site/HeroBurger'
import { HoursList } from '../../components/site/HoursList'
import { MenuCard } from '../../components/site/MenuCard'
import { OpenStatus } from '../../components/site/OpenStatus'
import { OrderButton } from '../../components/site/OrderProvider'
import { ProviderButtons } from '../../components/site/ProviderButtons'
import { providersFor } from '../../lib/providers'
import { SocialLinks, socialList } from '../../components/site/SocialLinks'
import { ArrowIcon, ClockIcon, PhoneIcon, PinIcon } from '../../components/site/icons'
import { getCategories, getHome, getMenuItems, getOrderLinks, getSettings, toImage } from '../../lib/data'
import { addressLines, directionsUrl, formatPhone, mapEmbedUrl, telHref } from '../../lib/format'

export default async function HomePage() {
  const [home, settings, categories, items, links] = await Promise.all([
    getHome(), getSettings(), getCategories(), getMenuItems(), getOrderLinks(),
  ])
  const featured = items.filter((i) => i.featured).slice(0, 6)
  const tiles = (categories.some((c) => c.showOnHome) ? categories.filter((c) => c.showOnHome) : categories).slice(0, 8)
  const heroImg = toImage(home.hero?.image, 'large')
  const aboutImg = toImage(home.about?.image, 'card')
  const providers = providersFor(links)
  const lines = addressLines(settings.address)
  const dir = directionsUrl(settings.address)
  const map = mapEmbedUrl(settings.address)
  const tel = telHref(settings.phone)
  const showPrices = Boolean(settings.showPrices)

  return (
    <>
      {/* HERO */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(60%_80%_at_85%_40%,rgb(128_0_32/0.35),transparent_70%),radial-gradient(40%_50%_at_10%_0%,rgb(255_255_255/0.05),transparent_70%)]" />
        {heroImg && (
          <>
            <Image src={heroImg.url} alt={heroImg.alt} fill priority sizes="100vw" className="-z-20 object-cover" />
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/85 to-ink/20" />
          </>
        )}
        <div className="container-x grid items-center gap-10 pt-12 pb-16 sm:pt-16 lg:min-h-[min(44rem,calc(100dvh-4.5rem))] lg:grid-cols-[1.05fr_1fr] lg:py-20">
          <div className="animate-rise max-w-2xl">
            {home.hero?.eyebrow && <p className="eyebrow mb-4">{home.hero.eyebrow}</p>}
            <h1 className="text-[2.6rem] leading-[1.05] font-extrabold sm:text-6xl lg:text-7xl">
              {home.hero?.heading || 'Big Flavor. Fresh Favorites. Primo Burgers.'}
            </h1>
            {home.hero?.subheading && <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/80 sm:text-xl">{home.hero.subheading}</p>}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/menu" className="btn-primary px-8">
                Explore Our Menu <ArrowIcon className="h-5 w-5" />
              </Link>
              <OrderButton className="btn-outline px-8" />
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/70">
              <OpenStatus hours={settings.hours ?? []} />
              {lines[0] && (
                <span className="inline-flex items-center gap-2"><PinIcon className="h-4 w-4" />{lines[0]}, {settings.address?.city}</span>
              )}
            </div>
          </div>
          {!heroImg && <HeroBurger className="mx-auto w-full max-w-md lg:max-w-xl" />}
        </div>
      </section>

      {/* FEATURED */}
      {featured.length > 0 && (
        <section className="section border-t border-white/[0.05]" aria-labelledby="featured-title">
          <div className="container-x">
            <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="eyebrow">Popular picks</p>
                <h2 id="featured-title" className="mt-2 text-3xl font-bold sm:text-4xl">{home.featured?.heading || 'Fan favorites'}</h2>
                {home.featured?.subheading && <p className="mt-2 max-w-xl text-muted">{home.featured.subheading}</p>}
              </div>
              <Link href="/menu" className="inline-flex items-center gap-2 font-semibold text-rose hover:underline">
                See the full menu <ArrowIcon className="h-4 w-4" />
              </Link>
            </div>
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((item) => (
                <li key={item.id}><MenuCard item={item} showPrices={showPrices} /></li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* CATEGORIES */}
      {tiles.length > 0 && (
        <section className="section bg-char-2" aria-labelledby="cats-title">
          <div className="container-x">
            <p className="eyebrow">Something for everyone</p>
            <h2 id="cats-title" className="mt-2 mb-10 text-3xl font-bold sm:text-4xl">Breakfast to dinner</h2>
            <ul className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {tiles.map((c) => {
                const n = items.filter((i) => i.categorySlug === c.slug).length
                return (
                  <li key={c.slug}>
                    <Link href={`/menu?category=${c.slug}`} className="group relative block aspect-[4/3] overflow-hidden rounded-2xl border border-white/[0.06] sm:aspect-[5/4]">
                      {c.image ? (
                        <Image src={c.image.url} alt="" fill sizes="(min-width: 768px) 25vw, 50vw" className="object-cover transition duration-500 group-hover:scale-105" />
                      ) : (
                        <FoodArt icon={c.icon} className="h-full w-full [&>span]:hidden" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 p-4">
                        <span className="block font-display text-lg leading-tight font-semibold sm:text-xl">{c.name}</span>
                        <span className="text-sm text-white/60">{n} item{n === 1 ? '' : 's'}</span>
                      </div>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        </section>
      )}

      {/* ORDER ONLINE */}
      <section className="section" aria-labelledby="order-title-home">
        <div className="container-x">
          <div className="relative overflow-hidden rounded-[2rem] border border-white/[0.07] bg-[linear-gradient(135deg,#5a0016_0%,#800020_45%,#2a0a12_100%)] p-8 sm:p-12 lg:grid lg:grid-cols-2 lg:items-center lg:gap-12">
            <div>
              <p className="text-xs font-semibold tracking-[0.18em] text-white/75 uppercase">Hungry now?</p>
              <h2 id="order-title-home" className="mt-2 text-3xl font-bold sm:text-4xl">Order online for delivery or pickup</h2>
              <p className="mt-3 max-w-md text-white/80">Browse our menu here, then check out with your favorite delivery app.</p>
            </div>
            <div className="mt-8 lg:mt-0">
              {providers.length ? (
                <ProviderButtons providers={providers} />
              ) : (
                <div className="rounded-2xl bg-ink/40 p-6">
                  <p className="font-semibold">Online ordering links are coming soon.</p>
                  {tel && (
                    <a href={tel} className="btn-light mt-4"><PhoneIcon className="h-4 w-4" /> Call {formatPhone(settings.phone)} to order</a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="section bg-mist text-ink" aria-labelledby="about-title">
        <div className="container-x grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-ink">
            {aboutImg ? (
              <Image src={aboutImg.url} alt={aboutImg.alt} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
            ) : (
              <FoodArt icon="plate" className="h-full w-full" />
            )}
          </div>
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-burgundy uppercase">About Primo Burgers</p>
            <h2 id="about-title" className="mt-2 text-3xl font-bold sm:text-4xl">{home.about?.heading || 'Your neighborhood diner'}</h2>
            {home.about?.text?.split(/\n\s*\n/).map((p, i) => (
              <p key={i} className="mt-4 text-lg leading-relaxed text-ink/80">{p}</p>
            ))}
            <Link href="/about" className="mt-8 inline-flex items-center gap-2 font-semibold text-burgundy hover:underline">
              More about us <ArrowIcon className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* LOCATION & HOURS */}
      <section className="section" aria-labelledby="visit-title">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <p className="eyebrow">Come hungry</p>
            <h2 id="visit-title" className="mt-2 text-3xl font-bold sm:text-4xl">Location &amp; hours</h2>
            <div className="mt-8 grid gap-6">
              {lines.length > 0 && (
                <div className="flex gap-4">
                  <PinIcon className="mt-1 h-5 w-5 shrink-0 text-rose" />
                  <address className="not-italic">{lines.map((l) => (<span key={l} className="block">{l}</span>))}</address>
                </div>
              )}
              {tel && (
                <div className="flex gap-4">
                  <PhoneIcon className="mt-1 h-5 w-5 shrink-0 text-rose" />
                  <a href={tel} className="hover:text-rose">{formatPhone(settings.phone)}</a>
                </div>
              )}
              <div className="flex gap-4">
                <ClockIcon className="mt-1 h-5 w-5 shrink-0 text-rose" />
                <div className="flex-1">
                  <OpenStatus hours={settings.hours ?? []} className="mb-3" />
                  <HoursList hours={settings.hours} note={settings.hoursNote} />
                </div>
              </div>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              {dir && <a href={dir} target="_blank" rel="noopener noreferrer" className="btn-primary">Get directions</a>}
              {tel && <a href={tel} className="btn-outline">Call us</a>}
            </div>
          </div>
          {map && (
            <div className="min-h-80 overflow-hidden rounded-[1.5rem] border border-white/[0.07] bg-char">
              <iframe
                title="Map showing Primo Burgers location"
                src={map}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-full min-h-80 w-full grayscale-[35%] invert-[90%] hue-rotate-180"
              />
            </div>
          )}
        </div>
      </section>

      {/* SOCIAL */}
      {socialList(settings).length > 0 && (
        <section className="border-t border-white/[0.05] py-14" aria-labelledby="social-title">
          <div className="container-x flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <h2 id="social-title" className="text-2xl font-bold">Follow Primo Burgers</h2>
              <p className="mt-1 text-muted">Specials, new items and behind-the-grill moments.</p>
            </div>
            <SocialLinks settings={settings} />
          </div>
        </section>
      )}
    </>
  )
}
