export type HoursRow = { day: string; open?: string | null; close?: string | null; closed?: boolean | null }

export const DAY_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const SHORT: Record<string, string> = {
  Monday: 'Mon', Tuesday: 'Tue', Wednesday: 'Wed', Thursday: 'Thu', Friday: 'Fri', Saturday: 'Sat', Sunday: 'Sun',
}

/** "7:00 AM" → minutes after midnight (420). Returns null for bad input. */
export function toMinutes(t?: string | null): number | null {
  const m = t?.trim().match(/^(\d{1,2}):(\d{2})\s?(AM|PM)$/i)
  if (!m) return null
  let h = Number(m[1]) % 12
  if (m[3].toUpperCase() === 'PM') h += 12
  return h * 60 + Number(m[2])
}

/** "9:00 PM" → "21:00" (Schema.org format). */
export function to24h(t?: string | null): string | null {
  const mins = toMinutes(t)
  if (mins === null) return null
  return `${String(Math.floor(mins / 60) % 24).padStart(2, '0')}:${String(mins % 60).padStart(2, '0')}`
}

export const normalizeTime = (t?: string | null) =>
  (t ?? '').trim().replace(/\s?(am|pm)$/i, (_, p: string) => ` ${p.toUpperCase()}`)

export function sortHours(rows: HoursRow[] = []): HoursRow[] {
  return [...rows].sort((a, b) => DAY_ORDER.indexOf(a.day) - DAY_ORDER.indexOf(b.day))
}

/** Collapse consecutive days with identical hours: "Mon – Thu: 7:00 AM – 9:00 PM". */
export function groupHours(rows: HoursRow[] = []): { days: string; hours: string }[] {
  const sorted = sortHours(rows)
  const label = (r: HoursRow) => (r.closed ? 'Closed' : `${normalizeTime(r.open)} – ${normalizeTime(r.close)}`)
  const groups: { start: string; end: string; hours: string }[] = []
  for (const r of sorted) {
    const h = label(r)
    const last = groups[groups.length - 1]
    if (last && last.hours === h && DAY_ORDER.indexOf(r.day) === DAY_ORDER.indexOf(last.end) + 1) last.end = r.day
    else groups.push({ start: r.day, end: r.day, hours: h })
  }
  return groups.map((g) => ({
    days: g.start === g.end ? SHORT[g.start] : `${SHORT[g.start]} – ${SHORT[g.end]}`,
    hours: g.hours,
  }))
}

/** Is the restaurant open at `now` (evaluated in Pacific time)? */
export function openStatus(rows: HoursRow[] = [], now = new Date()): { open: boolean; text: string } | null {
  if (!rows.length) return null
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Los_Angeles', weekday: 'long', hour: 'numeric', minute: 'numeric', hourCycle: 'h23',
  }).formatToParts(now)
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? ''
  const day = get('weekday')
  const mins = Number(get('hour')) * 60 + Number(get('minute'))
  const today = rows.find((r) => r.day === day)
  if (today && !today.closed) {
    const o = toMinutes(today.open)
    const c = toMinutes(today.close)
    if (o !== null && c !== null) {
      const close = c <= o ? c + 1440 : c
      if (mins >= o && mins < close) return { open: true, text: `Open now · until ${normalizeTime(today.close)}` }
      if (mins < o) return { open: false, text: `Closed · opens ${normalizeTime(today.open)} today` }
    }
  }
  // find next opening day
  const idx = DAY_ORDER.indexOf(day)
  for (let i = 1; i <= 7; i++) {
    const d = DAY_ORDER[(idx + i) % 7]
    const r = rows.find((x) => x.day === d)
    if (r && !r.closed && r.open) {
      return { open: false, text: `Closed · opens ${i === 1 ? 'tomorrow' : d} ${normalizeTime(r.open)}` }
    }
  }
  return { open: false, text: 'Closed' }
}
