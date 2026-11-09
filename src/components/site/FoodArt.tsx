/**
 * Brand illustration used when a menu item or category has no photo yet.
 * Simple flat line-art on charcoal — clearly an icon, never pretending to be a real photo.
 */
import type { ReactNode } from 'react'

const art: Record<string, ReactNode> = {
  burger: (<g><path d="M14 30c0-9.5 8-16 18-16s18 6.5 18 16z" /><path d="M11 36c4-3 7 3 11 0s7 3 11 0 7 3 11 0 7 3 9 0" /><rect x="12" y="40" width="40" height="5" rx="2.5" /><path d="M14 49h36c0 4-3 6-7 6H21c-4 0-7-2-7-6z" /><circle cx="25" cy="22" r=".9" /><circle cx="32" cy="19" r=".9" /><circle cx="39" cy="22" r=".9" /></g>),
  pancakes: (<g><ellipse cx="32" cy="24" rx="20" ry="5" /><path d="M12 24v6c0 3 9 5 20 5s20-2 20-5v-6" /><path d="M12 30v6c0 3 9 5 20 5s20-2 20-5v-6" /><path d="M12 36v6c0 3 9 5 20 5s20-2 20-5v-6" /><rect x="28" y="16" width="8" height="5" rx="1" /><path d="M30 29v6M40 28v4" /></g>),
  egg: (<g><path d="M32 12c10 0 22 9 20 22-2 12-12 18-20 18s-18-6-20-18C10 21 22 12 32 12z" /><circle cx="32" cy="34" r="8" /></g>),
  burrito: (<g><path d="M14 44 40 14c4-4 10 2 6 6L20 50c-3 3-9-3-6-6z" /><path d="M22 36l8 8M28 29l8 8M34 22l7 7" /></g>),
  sandwich: (<g><path d="M10 30 32 14l22 16z" /><path d="M10 34c5 3 9-2 14 1s9-2 14 1 9-2 16 0" /><path d="M10 40h44v6H10z" /></g>),
  plate: (<g><circle cx="32" cy="34" r="20" /><circle cx="32" cy="34" r="13" /><path d="M8 12v12M5 12v6a3 3 0 0 0 6 0v-6M56 12c-3 0-5 4-5 10h5v24" /></g>),
  taco: (<g><path d="M8 44c0-13 11-24 24-24s24 11 24 24z" /><path d="M14 40c3-4 6 0 9-4s6 0 9-4 6 0 9-4 6 0 9 4" /></g>),
  basket: (<g><path d="M8 30h48l-6 22H14z" /><path d="M14 30l4 22M50 30l-4 22M24 30l1 22M40 30l-1 22" /><path d="M18 30c-2-8 4-14 8-10M30 30c-1-9 6-13 9-8M42 30c0-7 6-9 7-4" /></g>),
  salad: (<g><path d="M8 32h48c0 12-10 20-24 20S8 44 8 32z" /><path d="M16 32c-2-7 5-12 10-7M27 32c0-8 8-11 12-5M38 32c1-6 9-8 12-2" /></g>),
  fries: (<g><path d="M18 30h28l-4 24H22z" /><path d="M22 30 20 12M27 30l-1-16M32 30V10M37 30l1-16M42 30l2-18" /><path d="M18 30c4 5 24 5 28 0" /></g>),
  kids: (<g><circle cx="32" cy="32" r="20" /><circle cx="25" cy="28" r="1.5" /><circle cx="39" cy="28" r="1.5" /><path d="M24 38c4 5 12 5 16 0" /></g>),
  star: (<g><path d="m32 10 6.5 13.5 14.5 2-10.5 10 2.5 14.5L32 43l-13 7 2.5-14.5L11 25.5l14.5-2z" /></g>),
  drink: (<g><path d="M18 18h28l-4 36H22z" /><path d="M36 18l6-10M20 30h24" /></g>),
  coffee: (<g><path d="M12 24h34v14a12 12 0 0 1-12 12H24a12 12 0 0 1-12-12z" /><path d="M46 28h3a5 5 0 0 1 0 10h-4M22 10c-2 3 2 5 0 8M30 10c-2 3 2 5 0 8M38 10c-2 3 2 5 0 8" /></g>),
}

export function FoodArt({ icon, label, className = '' }: { icon?: string; label?: string; className?: string }) {
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden bg-[radial-gradient(120%_90%_at_30%_20%,#3a0a17_0%,#1d1d1d_55%,#141414_100%)] ${className}`}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <svg viewBox="0 0 64 64" className="h-2/5 max-h-28 w-auto text-rose/80" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {art[icon ?? 'burger'] ?? art.burger}
      </svg>
      <span className="pointer-events-none absolute right-3 bottom-2 text-[10px] font-medium tracking-[0.2em] text-white/25 uppercase">Photo coming soon</span>
    </div>
  )
}
