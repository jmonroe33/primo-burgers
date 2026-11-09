'use client'

import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState, type MouseEvent } from 'react'
import { matches } from '../../lib/search'
import type { PublicCategory, PublicItem } from '../../lib/types'
import { ItemDetail } from './ItemDetail'
import { MenuCard } from './MenuCard'
import { CloseIcon, SearchIcon } from './icons'

type Props = { categories: PublicCategory[]; items: PublicItem[]; showPrices: boolean }

const setParams = (next: Record<string, string | null>) => {
  const url = new URL(window.location.href)
  for (const [k, v] of Object.entries(next)) {
    if (v) url.searchParams.set(k, v)
    else url.searchParams.delete(k)
  }
  window.history.replaceState(window.history.state, '', url)
}

export function MenuBrowser({ categories, items, showPrices }: Props) {
  const [input, setInput] = useState('')
  const [query, setQuery] = useState('')
  const [active, setActive] = useState<string>('all')
  const [selected, setSelected] = useState<PublicItem | null>(null)
  const dialog = useRef<HTMLDialogElement>(null)
  const chipRow = useRef<HTMLDivElement>(null)
  const results = useRef<HTMLDivElement>(null)

  // Read ?q=, ?category=, ?item= on first load (shareable / QR-friendly URLs)
  useEffect(() => {
    const p = new URLSearchParams(window.location.search)
    const q = p.get('q') ?? ''
    const c = p.get('category')
    if (q) { setInput(q); setQuery(q) }
    if (c && categories.some((x) => x.slug === c)) setActive(c)
    const i = p.get('item')
    const found = i ? items.find((x) => x.slug === i) : null
    if (found) { setSelected(found); requestAnimationFrame(() => dialog.current?.showModal()) }
  }, [categories, items])

  // Debounce typing (150 ms) so results update smoothly as the customer types
  useEffect(() => {
    const t = setTimeout(() => {
      setQuery(input)
      setParams({ q: input.trim() || null })
    }, 150)
    return () => clearTimeout(t)
  }, [input])

  const deferredQuery = useDeferredValue(query)

  const filtered = useMemo(
    () => items.filter((i) => (active === 'all' || i.categorySlug === active) && matches(i, deferredQuery)),
    [items, active, deferredQuery],
  )

  const groups = useMemo(
    () =>
      categories
        .map((c) => ({ category: c, items: filtered.filter((i) => i.categorySlug === c.slug) }))
        .filter((g) => g.items.length),
    [categories, filtered],
  )

  const counts = useMemo(() => {
    const m = new Map<string, number>()
    for (const i of items) if (matches(i, deferredQuery)) m.set(i.categorySlug, (m.get(i.categorySlug) ?? 0) + 1)
    return m
  }, [items, deferredQuery])

  const chooseCategory = (slug: string) => {
    setActive(slug)
    setParams({ category: slug === 'all' ? null : slug })
    results.current?.scrollIntoView({ block: 'start', behavior: 'smooth' })
  }

  // keep the active chip visible in the horizontal scroller (without scrolling the page itself)
  useEffect(() => {
    const row = chipRow.current
    const chip = row?.querySelector<HTMLElement>('[aria-pressed="true"]')
    if (!row || !chip) return
    const target = chip.offsetLeft - row.clientWidth / 2 + chip.clientWidth / 2
    row.scrollTo({ left: Math.max(0, target), behavior: 'smooth' })
  }, [active])

  const openItem = useCallback((item: PublicItem, e: MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return // allow open-in-new-tab
    e.preventDefault()
    setSelected(item)
    setParams({ item: item.slug })
    dialog.current?.showModal()
  }, [])

  const closeItem = () => dialog.current?.close()

  useEffect(() => {
    const d = dialog.current
    if (!d) return
    const onClose = () => { setParams({ item: null }) }
    const onClick = (e: globalThis.MouseEvent) => { if (e.target === d) d.close() }
    d.addEventListener('close', onClose)
    d.addEventListener('click', onClick)
    return () => { d.removeEventListener('close', onClose); d.removeEventListener('click', onClick) }
  }, [])

  const clear = () => { setInput(''); setQuery(''); setParams({ q: null }) }
  const total = filtered.length
  const activeName = active === 'all' ? null : categories.find((c) => c.slug === active)?.name

  return (
    <>
      {/* Search + category filters (sticky under the header) */}
      <div className="sticky top-[4.5rem] z-30 -mx-4 border-b border-white/[0.06] bg-ink/90 px-4 pt-3 pb-3 backdrop-blur-md sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <form role="search" onSubmit={(e) => { e.preventDefault(); (document.activeElement as HTMLElement | null)?.blur() }} className="relative">
          <label htmlFor="menu-search" className="sr-only">Search the menu</label>
          <SearchIcon className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-white/50" />
          <input
            id="menu-search"
            type="search"
            inputMode="search"
            enterKeyHint="search"
            autoComplete="off"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search burgers, bacon, chorizo, pancakes…"
            className="h-13 w-full rounded-full border border-white/10 bg-char pr-12 pl-12 text-base text-white placeholder:text-white/40 focus:border-rose focus:outline-none [&::-webkit-search-cancel-button]:hidden"
          />
          {input && (
            <button type="button" onClick={clear} className="absolute top-1/2 right-2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full hover:bg-white/10" aria-label="Clear search">
              <CloseIcon className="h-5 w-5" />
            </button>
          )}
        </form>
        <div ref={chipRow} className="no-scrollbar relative -mx-4 mt-3 flex snap-x gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0" role="group" aria-label="Filter by category">
          {[{ slug: 'all', name: 'All' }, ...categories].map((c) => {
            const n = c.slug === 'all' ? [...counts.values()].reduce((a, b) => a + b, 0) : counts.get(c.slug) ?? 0
            const isActive = active === c.slug
            return (
              <button
                key={c.slug}
                type="button"
                aria-pressed={isActive}
                onClick={() => chooseCategory(c.slug)}
                className={`min-h-11 shrink-0 snap-start rounded-full border px-4 text-sm font-medium whitespace-nowrap transition ${
                  isActive ? 'border-burgundy bg-burgundy text-white' : 'border-white/12 bg-char text-white/80 hover:border-white/30 hover:text-white'
                } ${n === 0 && !isActive ? 'opacity-45' : ''}`}
              >
                {c.name}
                {deferredQuery && <span className="ml-1.5 text-xs opacity-70">{n}</span>}
              </button>
            )
          })}
        </div>
      </div>

      <p className="sr-only" role="status" aria-live="polite">
        {total === 0 ? 'No menu items found.' : `${total} menu item${total === 1 ? '' : 's'} shown${activeName ? ` in ${activeName}` : ''}.`}
      </p>

      <div ref={results} className="scroll-mt-48 pt-8">
        {total === 0 ? (
          <div className="mx-auto max-w-md py-20 text-center">
            <SearchIcon className="mx-auto mb-4 h-10 w-10 text-white/30" />
            <h2 className="text-2xl font-bold">No matches{query ? ` for “${query}”` : ''}</h2>
            <p className="mt-2 text-muted">
              Try a different word, like &ldquo;burger&rdquo;, &ldquo;burrito&rdquo; or &ldquo;pancakes&rdquo;
              {activeName ? `, or search all categories instead of only ${activeName}` : ''}.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              {query && <button type="button" onClick={clear} className="btn-primary">Clear search</button>}
              {active !== 'all' && <button type="button" onClick={() => chooseCategory('all')} className="btn-outline">Show all categories</button>}
            </div>
          </div>
        ) : (
          <div className="space-y-14">
            {groups.map(({ category, items: list }) => (
              <section key={category.slug} aria-labelledby={`cat-${category.slug}`} className="scroll-mt-48">
                <div className="mb-5 flex flex-wrap items-end justify-between gap-2 border-b border-white/[0.07] pb-3">
                  <div>
                    <h2 id={`cat-${category.slug}`} className="text-2xl font-bold sm:text-3xl">{category.name}</h2>
                    {category.description && <p className="mt-1 text-sm text-muted">{category.description}</p>}
                  </div>
                  <span className="text-sm text-white/50">{list.length} item{list.length === 1 ? '' : 's'}</span>
                </div>
                <ul className="grid gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
                  {list.map((item) => (
                    <li key={item.id}>
                      <MenuCard item={item} showPrices={showPrices} onOpen={openItem} compactOnMobile />
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </div>

      <dialog
        ref={dialog}
        aria-labelledby="item-title"
        className="m-auto max-h-[calc(100dvh-2rem)] w-[min(60rem,calc(100%-1.5rem))] overflow-y-auto rounded-3xl border border-white/10 bg-char p-0 text-white shadow-2xl"
      >
        {selected && (
          <div className="relative">
            <button type="button" onClick={closeItem} className="absolute top-3 right-3 z-10 grid h-11 w-11 place-items-center rounded-full bg-ink/80 backdrop-blur hover:bg-ink" aria-label="Close">
              <CloseIcon />
            </button>
            <ItemDetail item={selected} showPrices={showPrices} titleId="item-title" />
          </div>
        )}
      </dialog>
    </>
  )
}
