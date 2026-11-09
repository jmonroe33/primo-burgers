'use client'
import { useEffect, useState } from 'react'
import { openStatus, type HoursRow } from '../../lib/hours'

/** "Open now · until 9:00 PM" — computed in the visitor's browser (Pacific time) so it is always current. */
export function OpenStatus({ hours, className = '' }: { hours: HoursRow[]; className?: string }) {
  const [status, setStatus] = useState<ReturnType<typeof openStatus>>(null)
  useEffect(() => {
    const tick = () => setStatus(openStatus(hours))
    tick()
    const id = setInterval(tick, 60_000)
    return () => clearInterval(id)
  }, [hours])
  if (!status) return null
  return (
    <span className={`inline-flex items-center gap-2 text-sm font-medium ${className}`}>
      <span className={`h-2.5 w-2.5 rounded-full ${status.open ? 'bg-ok shadow-[0_0_0_4px_rgb(111_211_154/0.18)]' : 'bg-white/40'}`} aria-hidden="true" />
      {status.text}
    </span>
  )
}
