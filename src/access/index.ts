import type { Access, FieldAccess, PayloadRequest, Where } from 'payload'

type Role = 'admin' | 'editor'

const roles = (req: PayloadRequest): Role[] =>
  ((req.user as { roles?: Role[] } | null | undefined)?.roles ?? []) as Role[]

export const isAdmin = (req: PayloadRequest) => roles(req).includes('admin')
export const isStaff = (req: PayloadRequest) =>
  Boolean(req.user) && (isAdmin(req) || roles(req).includes('editor'))

/** Logged-in owner/staff only. */
export const staffOnly: Access = ({ req }) => isStaff(req)
export const adminOnly: Access = ({ req }) => isAdmin(req)
export const adminOnlyField: FieldAccess = ({ req }) => isAdmin(req)
export const anyone: Access = () => true

/**
 * Public visitors may only read published, non-hidden documents.
 * Staff can read everything (including drafts and hidden items).
 */
export const publishedAndVisible: Access = ({ req }) => {
  if (isStaff(req)) return true
  const where: Where = {
    and: [{ hidden: { not_equals: true } }, { _status: { equals: 'published' } }],
  }
  return where
}

/** Admins manage every account; everyone else may only see/update themselves. */
export const adminOrSelf: Access = ({ req }) => {
  if (isAdmin(req)) return true
  if (req.user) return { id: { equals: req.user.id } }
  return false
}
