import type { Provider } from '../../lib/providers'
import { ExternalIcon } from './icons'

export function ProviderButtons({ providers, compact = false }: { providers: Provider[]; compact?: boolean }) {
  return (
    <ul className={`grid gap-3 ${compact ? 'sm:grid-cols-2' : ''}`}>
      {providers.map((p) => (
        <li key={p.key}>
          <a
            href={p.href}
            target="_blank"
            rel="noopener noreferrer external"
            className="group flex min-h-16 items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 transition hover:border-white/30 hover:bg-white/[0.08]"
          >
            <span className="h-10 w-1.5 shrink-0 rounded-full" style={{ background: p.color }} aria-hidden="true" />
            <span className="flex-1">
              <span className="block font-display font-semibold">
                {p.key === 'pickup' ? p.name : `Order with ${p.name}`}
              </span>
              <span className="block text-sm text-muted">{p.tagline}</span>
            </span>
            <ExternalIcon className="h-5 w-5 text-white/50 transition group-hover:text-white" />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </li>
      ))}
    </ul>
  )
}
