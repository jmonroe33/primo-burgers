import type { ReactNode } from 'react'

export const metadata = { robots: { index: false } }

export default function PrintLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: '#fff', color: '#101010', fontFamily: 'system-ui, sans-serif' }}>{children}</body>
    </html>
  )
}
