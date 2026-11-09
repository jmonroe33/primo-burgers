import React from 'react'

export const Logo = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
    <svg width="44" height="44" viewBox="0 0 64 64" aria-hidden="true">
      <circle cx="32" cy="32" r="32" fill="#800020" />
      <path d="M14 30c0-9 8-15 18-15s18 6 18 15z" fill="#F2F2F2" />
      <rect x="12" y="33" width="40" height="5" rx="2.5" fill="#F2F2F2" />
      <path d="M14 41h36c0 5-4 8-9 8H23c-5 0-9-3-9-8z" fill="#F2F2F2" />
    </svg>
    <span style={{ fontWeight: 800, fontSize: 26, letterSpacing: '-0.02em' }}>
      Primo Burgers <span style={{ fontWeight: 400, opacity: 0.6, fontSize: 18 }}>Dashboard</span>
    </span>
  </div>
)
