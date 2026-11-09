import { qrSvg, qrTarget } from '../../../../lib/qr'
import { getSiteUrl, isLocalUrl } from '../../../../lib/siteUrl'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Printable menu QR card · Primo Burgers' }

/** A 4×6-inch table tent card. Print from the browser (File → Print). */
export default async function PrintQr() {
  const svg = await qrSvg()
  const site = getSiteUrl()
  return (
    <main style={{ display: 'grid', placeItems: 'center', minHeight: '100vh', padding: 24 }}>
      <style>{`@page { size: 4in 6in; margin: 0 } @media print { .noprint { display: none } main { padding: 0 !important } }`}</style>
      {isLocalUrl(site) && (
        <p className="noprint" style={{ background: '#800020', color: '#fff', padding: 12, borderRadius: 8, maxWidth: 420 }}>
          Warning: this code points to a temporary address ({site}). Set your real domain before printing.
        </p>
      )}
      <section
        style={{
          width: '4in', height: '6in', boxSizing: 'border-box', border: '1px solid #ddd', borderRadius: 16,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between',
          padding: '0.35in', textAlign: 'center', background: '#fff',
        }}
      >
        <div>
          <div style={{ fontWeight: 900, fontSize: 30, letterSpacing: '-0.02em' }}>
            PRIMO <span style={{ color: '#800020' }}>BURGERS</span>
          </div>
          <div style={{ marginTop: 6, fontSize: 15, color: '#444' }}>Scan to view our menu</div>
        </div>
        <div style={{ width: '2.9in', height: '2.9in' }} dangerouslySetInnerHTML={{ __html: svg.replace('<svg', '<svg width="100%" height="100%"') }} />
        <div style={{ fontSize: 12, color: '#555', lineHeight: 1.5 }}>
          Browse the full menu &amp; order online
          <br />
          <strong style={{ color: '#101010' }}>{qrTarget().replace(/^https?:\/\//, '').replace('?src=qr', '')}</strong>
        </div>
      </section>
      <p className="noprint" style={{ color: '#666', fontSize: 14 }}>Use your browser&apos;s Print command. Card size: 4 × 6 in.</p>
    </main>
  )
}
