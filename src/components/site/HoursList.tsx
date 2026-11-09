import { groupHours, type HoursRow } from '../../lib/hours'

export function HoursList({ hours, note, className = '' }: { hours?: HoursRow[] | null; note?: string | null; className?: string }) {
  const groups = groupHours(hours ?? [])
  if (!groups.length) return <p className="text-muted">Hours coming soon — please call ahead.</p>
  return (
    <div className={className}>
      <dl className="grid gap-2">
        {groups.map((g) => (
          <div key={g.days} className="flex justify-between gap-6 border-b border-white/[0.07] pb-2 last:border-0">
            <dt className="text-muted">{g.days}</dt>
            <dd className="font-medium tabular-nums">{g.hours}</dd>
          </div>
        ))}
      </dl>
      {note && <p className="mt-3 text-sm text-muted">{note}</p>}
    </div>
  )
}
