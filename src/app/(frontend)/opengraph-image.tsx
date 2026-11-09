import { ImageResponse } from 'next/og'

export const alt = 'Primo Burgers — burgers, breakfast & more in Palmdale, CA'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center',
          padding: 80, background: 'radial-gradient(circle at 80% 40%, #800020 0%, #2a0a12 40%, #101010 75%)', color: '#fff',
        }}
      >
        <div style={{ fontSize: 30, letterSpacing: 6, color: '#ef7a92', textTransform: 'uppercase' }}>Palmdale, California</div>
        <div style={{ fontSize: 110, fontWeight: 900, lineHeight: 1, marginTop: 16 }}>PRIMO BURGERS</div>
        <div style={{ fontSize: 40, marginTop: 28, color: '#e6e6e6' }}>Burgers · Breakfast Burritos · Sandwiches · Dinner</div>
      </div>
    ),
    size,
  )
}
