import { qrSvg } from '../../../../lib/qr'

export const dynamic = 'force-dynamic'

export async function GET() {
  return new Response(await qrSvg(), {
    headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'public, max-age=3600' },
  })
}
