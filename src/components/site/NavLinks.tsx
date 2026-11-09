'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function NavLinks({ links }: { links: { href: string; label: string }[] }) {
  const pathname = usePathname()
  return (
    <ul className="hidden items-center gap-1 lg:flex">
      {links.map((l) => {
        const active = l.href === '/' ? pathname === '/' : pathname.startsWith(l.href)
        return (
          <li key={l.href}>
            <Link
              href={l.href}
              aria-current={active ? 'page' : undefined}
              className="relative rounded-full px-4 py-2 text-[0.95rem] font-medium text-white/80 transition hover:text-white aria-[current=page]:text-white after:absolute after:inset-x-4 after:-bottom-0.5 after:h-0.5 after:scale-x-0 after:rounded-full after:bg-rose after:transition aria-[current=page]:after:scale-x-100"
            >
              {l.label}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
