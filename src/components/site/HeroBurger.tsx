/** Stylized brand illustration shown in the hero until a real food photo is uploaded in the dashboard. */
export function HeroBurger({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 520 460" className={className} role="img" aria-label="Illustration of a stacked cheeseburger">
      <defs>
        <radialGradient id="glow" cx="50%" cy="55%" r="55%">
          <stop offset="0%" stopColor="#800020" stopOpacity="0.55" />
          <stop offset="70%" stopColor="#800020" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#800020" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="bunTop" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f2a65a" />
          <stop offset="60%" stopColor="#d9822b" />
          <stop offset="100%" stopColor="#a85d1a" />
        </linearGradient>
        <linearGradient id="bunBottom" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e39445" />
          <stop offset="100%" stopColor="#9b5517" />
        </linearGradient>
        <linearGradient id="patty" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6b3a22" />
          <stop offset="100%" stopColor="#3b1d10" />
        </linearGradient>
        <linearGradient id="cheese" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffd54a" />
          <stop offset="100%" stopColor="#f2a900" />
        </linearGradient>
      </defs>
      <circle cx="260" cy="250" r="230" fill="url(#glow)" />
      <ellipse cx="260" cy="408" rx="190" ry="18" fill="#000" opacity="0.45" />
      {/* bottom bun */}
      <path d="M92 340h336c0 38-30 62-70 62H162c-40 0-70-24-70-62z" fill="url(#bunBottom)" />
      {/* patty 2 */}
      <rect x="84" y="300" width="352" height="46" rx="23" fill="url(#patty)" />
      <path d="M110 312h40M190 316h50M280 312h46M360 316h40" stroke="#2a130a" strokeWidth="5" strokeLinecap="round" opacity=".6" />
      {/* cheese 2 */}
      <path d="M96 294h328l-24 22-20-6-26 30-18-26-40 18-22-20-36 30-20-28-36 14-26-20-30 18z" fill="url(#cheese)" />
      {/* patty 1 */}
      <rect x="88" y="248" width="344" height="48" rx="24" fill="url(#patty)" />
      <path d="M116 262h44M200 266h46M286 262h40M362 266h44" stroke="#2a130a" strokeWidth="5" strokeLinecap="round" opacity=".6" />
      {/* cheese 1 */}
      <path d="M100 242h320l-20 26-26-10-20 34-22-30-34 22-24-24-30 32-22-30-32 18-24-28-30 18z" fill="url(#cheese)" />
      {/* tomato */}
      <rect x="104" y="222" width="312" height="24" rx="12" fill="#d7263d" />
      <rect x="120" y="226" width="80" height="6" rx="3" fill="#fff" opacity=".18" />
      {/* lettuce */}
      <path d="M86 222c18-16 30 10 48-4s28 12 46-2 30 12 48-2 30 12 48-2 30 12 48-2 30 12 48-2 28 10 42 6l-6 16H92z" fill="#5cb85c" />
      <path d="M86 222c18-16 30 10 48-4s28 12 46-2 30 12 48-2 30 12 48-2 30 12 48-2 30 12 48-2 28 10 42 6" fill="none" stroke="#3e8e3e" strokeWidth="4" />
      {/* top bun */}
      <path d="M96 214C96 128 170 72 260 72s164 56 164 142z" fill="url(#bunTop)" />
      <path d="M140 150c22-40 66-62 120-62" stroke="#fff" strokeOpacity=".28" strokeWidth="10" strokeLinecap="round" fill="none" />
      {[[190, 120], [240, 104], [300, 112], [340, 140], [210, 160], [270, 146], [160, 170], [320, 176], [370, 184]].map(([x, y], i) => (
        <ellipse key={i} cx={x} cy={y} rx="7" ry="4" transform={`rotate(${(i * 37) % 60 - 30} ${x} ${y})`} fill="#fff4d6" />
      ))}
    </svg>
  )
}
