import type { TextField } from 'payload'

/**
 * A link field that only accepts full https:// links, optionally restricted to certain websites
 * (e.g. a DoorDash link must actually point at doordash.com).
 */
export const urlField = (
  name: string,
  label: string,
  opts: { hosts?: string[]; description?: string; allowHttp?: boolean } = {},
): TextField => ({
  name,
  label,
  type: 'text',
  admin: {
    description:
      opts.description ??
      (opts.hosts ? `Paste the full link (must be on ${opts.hosts.join(' or ')}). Leave blank to hide.` : 'Paste the full link. Leave blank to hide.'),
    placeholder: 'https://',
  },
  validate: (value: string | null | undefined) => {
    if (!value) return true
    let url: URL
    try {
      url = new URL(value.trim())
    } catch {
      return 'Please paste a complete link starting with https://'
    }
    if (url.protocol !== 'https:' && !(opts.allowHttp && url.protocol === 'http:')) {
      return 'Links must start with https://'
    }
    if (opts.hosts && !opts.hosts.some((h) => url.hostname === h || url.hostname.endsWith(`.${h}`))) {
      return `This link should be on ${opts.hosts.join(' or ')}.`
    }
    return true
  },
})
