import Link from 'next/link'
import type { SiteSetting } from '../../payload-types'
import { formatPhone, telHref } from '../../lib/format'
import { Logo } from './Logo'
import { MobileNav } from './MobileNav'
import { NavLinks } from './NavLinks'
import { OrderButton } from './OrderProvider'
import { PhoneIcon } from './icons'

export const NAV = [
  { href: '/', label: 'Home' },
  { href: '/menu', label: 'Menu' },
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contact & Location' },
]

export function Header({ settings }: { settings: SiteSetting }) {
  const tel = telHref(settings.phone)
  const a = settings.announcement
  return (
    <>
      <a href="#main" className="sr-only z-[60] rounded-full bg-white px-4 py-2 text-ink focus:not-sr-only focus:fixed focus:top-3 focus:left-3">
        Skip to content
      </a>
      {a?.enabled && a.message && (
        <div className="bg-burgundy text-center text-sm font-medium">
          <p className="container-x py-2">
            {a.message}{' '}
            {a.link && (
              <a href={a.link} className="ml-1 underline underline-offset-2 hover:no-underline">
                {a.linkLabel || 'Learn more'}
              </a>
            )}
          </p>
        </div>
      )}
      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-ink/85 backdrop-blur-md supports-[backdrop-filter]:bg-ink/70">
        <div className="container-x flex h-[4.5rem] items-center justify-between gap-4">
          <Link href="/" className="rounded-lg" aria-label="Primo Burgers — home">
            <Logo />
          </Link>
          <nav aria-label="Main" className="flex items-center gap-2">
            <NavLinks links={NAV} />
            {tel && (
              <a href={tel} className="hidden items-center gap-2 rounded-full px-3 py-2 text-sm text-white/80 hover:text-white xl:inline-flex">
                <PhoneIcon className="h-4 w-4" /> {formatPhone(settings.phone)}
              </a>
            )}
            <OrderButton className="btn-primary hidden min-h-11 px-5 sm:inline-flex" />
            <MobileNav links={NAV} />
          </nav>
        </div>
      </header>
    </>
  )
}
