import type { Metadata, Viewport } from 'next'
import { Inter, Poppins } from 'next/font/google'
import type { ReactNode } from 'react'
import { Footer } from '../../components/site/Footer'
import { Header } from '../../components/site/Header'
import { MobileActionBar } from '../../components/site/MobileActionBar'
import { OrderProvider } from '../../components/site/OrderProvider'
import { getOrderLinks, getSettings } from '../../lib/data'
import { jsonLdScript, restaurantJsonLd } from '../../lib/jsonld'
import { getSiteUrl } from '../../lib/siteUrl'
import './styles.css'

const poppins = Poppins({ subsets: ['latin'], weight: ['600', '700', '800'], variable: '--font-poppins', display: 'swap' })
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })

export const revalidate = 3600 // safety net; content edits refresh the site immediately via CMS hooks

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings()
  const description =
    s.metaDescription ||
    'Primo Burgers is a family-owned diner in Palmdale, CA serving burgers, breakfast burritos, pancakes, sandwiches and dinner plates. View the menu and order online.'
  return {
    metadataBase: new URL(getSiteUrl()),
    title: { default: 'Primo Burgers | Burgers & Breakfast in Palmdale, CA', template: '%s | Primo Burgers Palmdale' },
    description,
    applicationName: 'Primo Burgers',
    alternates: { canonical: '/' },
    openGraph: { type: 'website', siteName: 'Primo Burgers', locale: 'en_US', description },
    twitter: { card: 'summary_large_image' },
    formatDetection: { telephone: false },
  }
}

export const viewport: Viewport = { themeColor: '#101010', width: 'device-width', initialScale: 1 }

export default async function RootLayout({ children }: { children: ReactNode }) {
  const [settings, links] = await Promise.all([getSettings(), getOrderLinks()])
  return (
    <html lang="en" className={`${poppins.variable} ${inter.variable}`}>
      <body className="min-h-dvh">
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(restaurantJsonLd(settings, getSiteUrl()))} />
        <OrderProvider links={links}>
          <Header settings={settings} />
          <main id="main" tabIndex={-1} className="focus:outline-none">{children}</main>
          <Footer settings={settings} />
          <MobileActionBar />
        </OrderProvider>
      </body>
    </html>
  )
}
