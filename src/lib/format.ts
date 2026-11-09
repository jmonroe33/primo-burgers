export const formatPrice = (n?: number | null) =>
  typeof n === 'number' ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n) : null

export const telHref = (phone?: string | null) => {
  const digits = (phone ?? '').replace(/\D/g, '')
  if (!digits) return null
  return `tel:+${digits.length === 10 ? `1${digits}` : digits}`
}

export const formatPhone = (phone?: string | null) => {
  const d = (phone ?? '').replace(/\D/g, '').replace(/^1(?=\d{10}$)/, '')
  return d.length === 10 ? `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}` : (phone ?? '')
}

export type Address = { street?: string | null; unit?: string | null; city?: string | null; state?: string | null; zip?: string | null }

export const addressLines = (a?: Address | null): string[] => {
  if (!a?.street) return []
  return [
    [a.street, a.unit].filter(Boolean).join(', '),
    [a.city, [a.state, a.zip].filter(Boolean).join(' ')].filter(Boolean).join(', '),
  ].filter(Boolean)
}

export const directionsUrl = (a?: Address | null) => {
  const lines = addressLines(a)
  return lines.length ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`Primo Burgers, ${lines.join(', ')}`)}` : null
}

export const mapEmbedUrl = (a?: Address | null) => {
  const lines = addressLines(a)
  return lines.length ? `https://www.google.com/maps?q=${encodeURIComponent(`Primo Burgers, ${lines.join(', ')}`)}&output=embed` : null
}
