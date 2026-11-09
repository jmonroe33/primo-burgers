import { qrPng } from '../../../../lib/qr'

export const dynamic = 'force-dynamic'

export async function GET() {
  const png = await qrPng()
  return new Response(new Uint8Array(png), {
    headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=3600' },
  })
}
