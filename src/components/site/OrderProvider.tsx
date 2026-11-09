'use client'

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { formatPhone, telHref } from '../../lib/format'
import type { OrderLinks } from '../../lib/types'
import { providersFor, type OpenArgs } from '../../lib/providers'
import { ProviderButtons } from './ProviderButtons'
import { CloseIcon, PhoneIcon } from './icons'


const Ctx = createContext<{ open: (args?: OpenArgs) => void; links: OrderLinks } | null>(null)

export const useOrder = () => {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useOrder must be used inside <OrderProvider>')
  return ctx
}

export function OrderProvider({ links, children }: { links: OrderLinks; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null)
  const [args, setArgs] = useState<OpenArgs | undefined>()

  const open = useCallback((a?: OpenArgs) => {
    setArgs(a)
    ref.current?.showModal()
  }, [])

  useEffect(() => {
    const d = ref.current
    if (!d) return
    // close when the dimmed backdrop is clicked
    const onClick = (e: MouseEvent) => { if (e.target === d) d.close() }
    d.addEventListener('click', onClick)
    return () => d.removeEventListener('click', onClick)
  }, [])

  const providers = providersFor(links, args)
  const tel = telHref(links.phone)

  return (
    <Ctx.Provider value={{ open, links }}>
      {children}
      <dialog
        ref={ref}
        aria-labelledby="order-title"
        className="m-auto w-[min(32rem,calc(100%-2rem))] rounded-3xl border border-white/10 bg-char p-0 text-white shadow-2xl"
      >
        <div className="p-6 sm:p-8">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <p className="eyebrow">Order online</p>
              <h2 id="order-title" className="mt-1 text-2xl font-bold">
                {args?.itemName ? `Craving the ${args.itemName}?` : 'How would you like to order?'}
              </h2>
              <p className="mt-1 text-sm text-muted">
                {providers.length ? 'Pick a service — it opens in a new tab.' : 'Online ordering is coming soon.'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => ref.current?.close()}
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/5 hover:bg-white/10"
              aria-label="Close"
            >
              <CloseIcon />
            </button>
          </div>
          {providers.length > 0 && <ProviderButtons providers={providers} />}
          {tel && (
            <a href={tel} className="mt-4 flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm text-muted hover:text-white">
              <PhoneIcon className="h-4 w-4" />
              {providers.length ? 'Prefer to call? ' : 'Call to order: '}
              <span className="font-semibold text-white">{formatPhone(links.phone)}</span>
            </a>
          )}
        </div>
      </dialog>
    </Ctx.Provider>
  )
}

export function OrderButton({
  className = 'btn-primary',
  children = 'Order Online',
  item,
}: {
  className?: string
  children?: ReactNode
  item?: OpenArgs
}) {
  const { open } = useOrder()
  return (
    <button type="button" className={className} onClick={() => open(item)} aria-haspopup="dialog">
      {children}
    </button>
  )
}
