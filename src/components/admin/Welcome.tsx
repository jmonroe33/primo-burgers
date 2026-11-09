import React from 'react'

const links: { href: string; title: string; text: string }[] = [
  { href: '/admin/collections/menu-items', title: 'Edit menu & prices', text: 'Change prices, descriptions, photos, or mark items unavailable.' },
  { href: '/admin/collections/menu-items/create', title: 'Add a menu item', text: 'Create a new dish and choose its category.' },
  { href: '/admin/globals/site-settings', title: 'Hours, phone & links', text: 'Business hours, DoorDash / Uber Eats links, social media, QR code.' },
  { href: '/admin/globals/home-page', title: 'Home page text & photos', text: 'Headline, banner photo and about blurb.' },
]

/** Friendly shortcuts shown at the top of the dashboard. */
export const Welcome = () => (
  <section style={{ marginBottom: 32 }}>
    <h2 style={{ marginBottom: 4 }}>Welcome back 👋</h2>
    <p style={{ marginTop: 0, opacity: 0.75 }}>
      What would you like to update? Changes appear on the website a few seconds after you press <strong>Publish changes</strong> or <strong>Save</strong>.{' '}
      <a href="/" target="_blank" rel="noopener">View the website ↗</a>
    </p>
    <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
      {links.map((l) => (
        <a
          key={l.href}
          href={l.href}
          style={{
            display: 'block',
            padding: 16,
            borderRadius: 8,
            border: '1px solid var(--theme-elevation-150)',
            background: 'var(--theme-elevation-50)',
            textDecoration: 'none',
            color: 'inherit',
          }}
        >
          <strong style={{ display: 'block', marginBottom: 4, color: '#c2385a' }}>{l.title} →</strong>
          <span style={{ fontSize: 14, opacity: 0.8 }}>{l.text}</span>
        </a>
      ))}
    </div>
  </section>
)
