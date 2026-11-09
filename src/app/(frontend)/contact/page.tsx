import type { Metadata } from 'next'
import { HoursList } from '../../../components/site/HoursList'
import { OpenStatus } from '../../../components/site/OpenStatus'
import { SocialLinks, socialList } from '../../../components/site/SocialLinks'
import { ClockIcon, PhoneIcon, PinIcon } from '../../../components/site/icons'
import { getSettings } from '../../../lib/data'
import { addressLines, directionsUrl, formatPhone, mapEmbedUrl, telHref } from '../../../lib/format'

export const metadata: Metadata = {
  title: 'Contact & Location',
  description: 'Find Primo Burgers in Palmdale, CA — address, hours, phone number and directions.',
  alternates: { canonical: '/contact' },
}

export default async function ContactPage() {
  const s = await getSettings()
  const lines = addressLines(s.address)
  const dir = directionsUrl(s.address)
  const map = mapEmbedUrl(s.address)
  const tel = telHref(s.phone)
  return (
    <div className="container-x py-12 pb-20 sm:py-16">
      <p className="eyebrow">Visit us</p>
      <h1 className="mt-2 text-4xl font-extrabold sm:text-5xl lg:text-6xl">Contact &amp; Location</h1>
      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1.3fr]">
        <div className="grid content-start gap-5">
          <div className="card p-6">
            <h2 className="flex items-center gap-3 text-lg font-semibold"><PinIcon className="text-rose" /> Address</h2>
            {lines.length ? (
              <address className="mt-3 text-lg not-italic">{lines.map((l) => (<span key={l} className="block">{l}</span>))}</address>
            ) : (
              <p className="mt-3 text-muted">Address coming soon.</p>
            )}
            {dir && <a href={dir} target="_blank" rel="noopener noreferrer" className="btn-primary mt-5 w-full sm:w-auto">Get directions</a>}
          </div>
          {tel && (
            <div className="card p-6">
              <h2 className="flex items-center gap-3 text-lg font-semibold"><PhoneIcon className="text-rose" /> Phone</h2>
              <a href={tel} className="mt-3 block font-display text-2xl font-semibold hover:text-rose">{formatPhone(s.phone)}</a>
              <a href={tel} className="btn-outline mt-5 w-full sm:w-auto">Tap to call</a>
            </div>
          )}
          <div className="card p-6">
            <h2 className="flex items-center gap-3 text-lg font-semibold"><ClockIcon className="text-rose" /> Hours</h2>
            <OpenStatus hours={s.hours ?? []} className="mt-3" />
            <HoursList hours={s.hours} note={s.hoursNote} className="mt-4" />
          </div>
          {socialList(s).length > 0 && (
            <div className="card p-6">
              <h2 className="mb-4 text-lg font-semibold">Follow us</h2>
              <SocialLinks settings={s} />
            </div>
          )}
        </div>
        {map && (
          <div className="min-h-96 overflow-hidden rounded-[var(--radius-card)] border border-white/[0.07] bg-char lg:min-h-0">
            <iframe
              title="Google Map of Primo Burgers"
              src={map}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-full min-h-96 w-full grayscale-[35%] invert-[90%] hue-rotate-180"
            />
          </div>
        )}
      </div>
    </div>
  )
}
