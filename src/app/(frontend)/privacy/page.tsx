import type { Metadata } from 'next'
import { getSettings } from '../../../lib/data'
import { formatPhone } from '../../../lib/format'

export const metadata: Metadata = { title: 'Privacy Policy', alternates: { canonical: '/privacy' } }

export default async function PrivacyPage() {
  const s = await getSettings()
  return (
    <article className="container-x max-w-3xl py-12 pb-20 sm:py-16 [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:text-2xl [&_h2]:font-bold [&_p]:leading-relaxed [&_p]:text-white/80">
      <h1 className="text-4xl font-extrabold sm:text-5xl">Privacy Policy</h1>
      <p className="mt-4 text-sm text-muted">This page explains what information this website handles.</p>
      <h2>Information we collect</h2>
      <p>This website does not ask you to create an account and does not collect your name, email address, or payment details. We do not use advertising trackers.</p>
      <h2>Online ordering</h2>
      <p>When you choose to order through DoorDash, Uber Eats, or another ordering service, you leave this website and that company&apos;s own privacy policy applies to your order and payment.</p>
      <h2>Maps</h2>
      <p>Our location pages show an embedded Google Map. Google may collect information when the map loads, as described in Google&apos;s privacy policy.</p>
      <h2>Contact</h2>
      <p>Questions about this policy? Contact {s.restaurantName || 'Primo Burgers'}{s.phone ? ` at ${formatPhone(s.phone)}` : ''}{s.email ? ` or ${s.email}` : ''}.</p>
    </article>
  )
}
