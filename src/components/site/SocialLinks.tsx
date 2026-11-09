import { FacebookIcon, InstagramIcon, TikTokIcon, YouTubeIcon } from './icons'

type Settings = { instagramUrl?: string | null; facebookUrl?: string | null; tiktokUrl?: string | null; youtubeUrl?: string | null }

export const socialList = (s: Settings) =>
  [
    { key: 'instagram', label: 'Instagram', href: s.instagramUrl, Icon: InstagramIcon },
    { key: 'facebook', label: 'Facebook', href: s.facebookUrl, Icon: FacebookIcon },
    { key: 'tiktok', label: 'TikTok', href: s.tiktokUrl, Icon: TikTokIcon },
    { key: 'youtube', label: 'YouTube', href: s.youtubeUrl, Icon: YouTubeIcon },
  ].filter((x): x is typeof x & { href: string } => Boolean(x.href))

/** Only renders links that are actually configured — never decorative dead buttons. */
export function SocialLinks({ settings, size = 'md' }: { settings: Settings; size?: 'sm' | 'md' }) {
  const list = socialList(settings)
  if (!list.length) return null
  const box = size === 'sm' ? 'h-10 w-10' : 'h-12 w-12'
  return (
    <ul className="flex flex-wrap gap-2">
      {list.map(({ key, label, href, Icon }) => (
        <li key={key}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`grid ${box} place-items-center rounded-full border border-white/15 text-white/85 transition hover:border-rose hover:bg-burgundy hover:text-white`}
            aria-label={`Primo Burgers on ${label} (opens in a new tab)`}
          >
            <Icon className="h-5 w-5" />
          </a>
        </li>
      ))}
    </ul>
  )
}
