import QRCode from 'qrcode'
import { getSiteUrl } from './siteUrl'

/** Permanent menu URL encoded in the QR code. `?src=qr` lets you count scans in analytics later. */
export const qrTarget = () => `${getSiteUrl()}/menu?src=qr`

// Error correction "Q" (25%) survives smudges/creases on tables; margin 4 = the standard quiet zone.
const opts = { errorCorrectionLevel: 'Q' as const, margin: 4, color: { dark: '#000000', light: '#ffffff' } }

export const qrSvg = () => QRCode.toString(qrTarget(), { ...opts, type: 'svg' })
export const qrPng = () => QRCode.toBuffer(qrTarget(), { ...opts, type: 'png', width: 2400 })
