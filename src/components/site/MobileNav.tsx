'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { CloseIcon, MenuIcon } from './icons'

export function MobileNav({ links }: { links: { href: string; label: string }[] }) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const btn = useRef<HTMLButtonElement>(null)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setOpen(false); btn.current?.focus() }
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [open])

  return (
    <div className="lg:hidden">
      <button
        ref={btn}
        type="button"
        className="grid h-12 w-12 place-items-center rounded-full hover:bg-white/10"
        aria-expanded={open}
        aria-controls="mobile-nav"
        aria-label={open ? 'Close menu' : 'Open menu'}
        onClick={() => setOpen((o) => !o)}
      >
        {open ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
      </button>
      {mounted && createPortal(
      <nav
        id="mobile-nav"
        aria-label="Mobile"
        hidden={!open}
        className="fixed inset-x-0 top-[4.5rem] bottom-0 z-[45] overflow-y-auto border-t border-white/10 bg-ink/98 px-4 py-6 backdrop-blur"
      >
        <ul className="grid gap-1">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                aria-current={pathname === l.href ? 'page' : undefined}
                className="block rounded-xl px-4 py-4 font-display text-2xl font-semibold hover:bg-white/5 aria-[current=page]:text-rose"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>,
      document.body,
      )}
    </div>
  )
}
