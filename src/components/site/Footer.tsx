import Link from 'next/link'
import type { SiteSetting } from '../../payload-types'
import { addressLines, directionsUrl, formatPhone, telHref } from '../../lib/format'
import { HoursList } from './HoursList'
import { Logo } from './Logo'
import { NAV } from './Header'
import { SocialLinks } from './SocialLinks'

export function Footer({ settings }: { settings: SiteSetting }) {
  const lines = addressLines(settings.address)
  const dir = directionsUrl(settings.address)
  const tel = telHref(settings.phone)
  return (
    <footer className="border-t border-white/[0.06] bg-[#0a0a0a] pb-28 sm:pb-0">
      <div className="container-x grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <Logo />
          <p className="max-w-xs text-sm leading-relaxed text-muted">
            A family-owned American diner in Palmdale, California — breakfast, burgers, burritos, sandwiches and dinner.
          </p>
          <SocialLinks settings={settings} size="sm" />
        </div>
        <nav aria-label="Footer">
          <h2 className="mb-4 text-sm font-semibold tracking-widest text-white/60 uppercase">Explore</h2>
          <ul className="grid gap-2.5">
            {NAV.map((l) => (
              <li key={l.href}><Link href={l.href} className="hover:text-rose">{l.label}</Link></li>
            ))}
          </ul>
        </nav>
        <div>
          <h2 className="mb-4 text-sm font-semibold tracking-widest text-white/60 uppercase">Visit</h2>
          <address className="grid gap-2.5 not-italic">
            {lines.length > 0 && (
              <span>{lines.map((l) => (<span key={l} className="block">{l}</span>))}</span>
            )}
            {dir && <a href={dir} target="_blank" rel="noopener noreferrer" className="text-rose hover:underline">Get directions</a>}
            {tel && <a href={tel} className="hover:text-rose">{formatPhone(settings.phone)}</a>}
            {settings.email && <a href={`mailto:${settings.email}`} className="hover:text-rose">{settings.email}</a>}
          </address>
        </div>
        <div>
          <h2 className="mb-4 text-sm font-semibold tracking-widest text-white/60 uppercase">Hours</h2>
          <HoursList hours={settings.hours} note={settings.hoursNote} className="text-sm" />
        </div>
      </div>
      <div className="border-t border-white/[0.06]">
        <div className="container-x flex flex-col gap-2 py-6 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {settings.restaurantName || 'Primo Burgers'}. All rights reserved.</p>
          <p className="flex gap-4">
            <Link href="/privacy" className="hover:text-white">Privacy policy</Link>
            <Link href="/admin" className="hover:text-white" rel="nofollow">Staff login</Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
