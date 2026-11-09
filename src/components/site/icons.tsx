import type { SVGProps } from 'react'

type P = SVGProps<SVGSVGElement>
const base = (p: P) => ({ width: 20, height: 20, 'aria-hidden': true as const, focusable: false as const, ...p })
const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }

export const SearchIcon = (p: P) => (<svg viewBox="0 0 24 24" {...base(p)} {...stroke}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>)
export const CloseIcon = (p: P) => (<svg viewBox="0 0 24 24" {...base(p)} {...stroke}><path d="M18 6 6 18M6 6l12 12" /></svg>)
export const MenuIcon = (p: P) => (<svg viewBox="0 0 24 24" {...base(p)} {...stroke}><path d="M4 7h16M4 12h16M4 17h16" /></svg>)
export const PhoneIcon = (p: P) => (<svg viewBox="0 0 24 24" {...base(p)} {...stroke}><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" /></svg>)
export const PinIcon = (p: P) => (<svg viewBox="0 0 24 24" {...base(p)} {...stroke}><path d="M12 22s7-6.1 7-12a7 7 0 1 0-14 0c0 5.9 7 12 7 12z" /><circle cx="12" cy="10" r="2.5" /></svg>)
export const ClockIcon = (p: P) => (<svg viewBox="0 0 24 24" {...base(p)} {...stroke}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>)
export const BagIcon = (p: P) => (<svg viewBox="0 0 24 24" {...base(p)} {...stroke}><path d="M6 7h12l1 14H5L6 7z" /><path d="M9 7V6a3 3 0 0 1 6 0v1" /></svg>)
export const ArrowIcon = (p: P) => (<svg viewBox="0 0 24 24" {...base(p)} {...stroke}><path d="M5 12h14M13 6l6 6-6 6" /></svg>)
export const ExternalIcon = (p: P) => (<svg viewBox="0 0 24 24" {...base(p)} {...stroke}><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" /></svg>)

export const InstagramIcon = (p: P) => (<svg viewBox="0 0 24 24" {...base(p)} {...stroke}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" /></svg>)
export const FacebookIcon = (p: P) => (<svg viewBox="0 0 24 24" {...base(p)} fill="currentColor"><path d="M13.5 22v-8h2.7l.4-3.2h-3.1V8.8c0-.9.3-1.5 1.6-1.5h1.7V4.4c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.4-4 4.1v2.4H7.7V14h2.7v8z" /></svg>)
export const TikTokIcon = (p: P) => (<svg viewBox="0 0 24 24" {...base(p)} fill="currentColor"><path d="M16.6 5.8A4.3 4.3 0 0 1 15.5 3h-3.1v12.4a2.6 2.6 0 1 1-2.6-2.6c.3 0 .5 0 .8.1V9.7a5.7 5.7 0 1 0 4.9 5.7V9.1a7.3 7.3 0 0 0 4.3 1.4V7.4a4.3 4.3 0 0 1-3.2-1.6z" /></svg>)
export const YouTubeIcon = (p: P) => (<svg viewBox="0 0 24 24" {...base(p)} fill="currentColor"><path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4a2.5 2.5 0 0 0-1.8 1.8C2 8.8 2 12 2 12s0 3.2.4 4.8a2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8c.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8zM10 15V9l5.2 3z" /></svg>)
