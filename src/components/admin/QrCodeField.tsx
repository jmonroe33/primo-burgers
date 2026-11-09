import React from 'react'
import { getSiteUrl, isLocalUrl } from '../../lib/siteUrl'

/** Shown in Settings → QR code. Server component: no client JS needed. */
export const QrCodeField: React.FC = () => {
  const site = getSiteUrl()
  const target = `${site}/menu`
  const temporary = isLocalUrl(site)
  return (
    <div style={{ display: 'grid', gap: 16, maxWidth: 640, marginBottom: 32 }}>
      <h3 style={{ margin: 0 }}>Menu QR code</h3>
      <p style={{ margin: 0 }}>
        Customers who scan this code are taken to <strong>{target}</strong>. The link never changes, so the
        printed code keeps working when you edit menu items or prices.
      </p>
      {temporary && (
        <div
          role="alert"
          style={{ padding: 12, borderRadius: 6, background: '#5c1a1a', color: '#fff', lineHeight: 1.45 }}
        >
          <strong>Don&apos;t print this yet.</strong> The website is not using its permanent address. Ask your developer to set
          NEXT_PUBLIC_SITE_URL to your real domain (for example https://primoburgers.com), then download the code again.
        </div>
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/qr/menu.svg"
        alt={`QR code linking to ${target}`}
        width={240}
        height={240}
        style={{ background: '#fff', padding: 8, borderRadius: 8, border: '1px solid #ccc' }}
      />
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <a className="btn btn--style-primary btn--size-medium" href="/qr/menu.png" download="primo-burgers-menu-qr.png">
          Download PNG (for printing)
        </a>
        <a className="btn btn--style-secondary btn--size-medium" href="/qr/menu.svg" download="primo-burgers-menu-qr.svg">
          Download SVG (for print shops)
        </a>
        <a className="btn btn--style-secondary btn--size-medium" href="/qr/print" target="_blank" rel="noopener">
          Open printable table card
        </a>
      </div>
    </div>
  )
}
