export function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg viewBox="0 0 64 64" className="h-9 w-9 shrink-0" aria-hidden="true">
        <circle cx="32" cy="32" r="32" fill="#800020" />
        <path d="M14 30c0-9 8-15 18-15s18 6 18 15z" fill="#F2F2F2" />
        <rect x="12" y="33" width="40" height="5" rx="2.5" fill="#F2F2F2" />
        <path d="M14 41h36c0 5-4 8-9 8H23c-5 0-9-3-9-8z" fill="#F2F2F2" />
      </svg>
      <span className="font-display text-lg leading-none font-extrabold tracking-tight sm:text-xl">
        PRIMO <span className="text-rose">BURGERS</span>
      </span>
    </span>
  )
}
