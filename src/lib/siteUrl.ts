/** The public, permanent address of the website (e.g. https://primoburgers.com). */
export const getSiteUrl = (): string => {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : '') ||
    'http://localhost:3000'
  return raw.replace(/\/+$/, '')
}

export const isLocalUrl = (url: string) => /localhost|127\.0\.0\.1|\.local\b|vercel\.app/.test(url)
