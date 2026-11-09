'use client'
import Link from 'next/link'
import { telHref } from '../../lib/format'
import { OrderButton, useOrder } from './OrderProvider'
import { BagIcon, PhoneIcon } from './icons'

/** Always-visible ordering bar on phones (where most QR-code visitors arrive). */
export function MobileActionBar() {
  const { links } = useOrder()
  const tel = telHref(links.phone)
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-ink/95 px-3 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur sm:hidden">
      <div className="flex gap-2">
        <Link href="/menu" className="btn-outline min-h-12 flex-1 px-3">Menu</Link>
        {tel && (
          <a href={tel} className="btn-outline min-h-12 w-14 shrink-0 px-0" aria-label="Call Primo Burgers">
            <PhoneIcon />
          </a>
        )}
        <OrderButton className="btn-primary min-h-12 flex-[1.4] px-3">
          <BagIcon /> Order Online
        </OrderButton>
      </div>
    </div>
  )
}
