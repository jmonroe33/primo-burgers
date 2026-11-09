import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
} from 'payload'

/**
 * Refresh the cached public website whenever content is saved.
 * The site is small, so we simply purge every page (layout-level revalidation).
 * Seeds / scripts set `context.disableRevalidate` because they run outside Next.js.
 */
async function purge(payload: { logger: { info: (m: string) => void; warn: (m: string) => void } }) {
  try {
    const { revalidatePath } = await import('next/cache')
    revalidatePath('/', 'layout')
    payload.logger.info('Public site cache refreshed')
  } catch {
    payload.logger.warn('Could not refresh site cache (running outside Next.js?)')
  }
}

export const revalidateAfterChange: CollectionAfterChangeHook = async ({ doc, req, context }) => {
  if (!context?.disableRevalidate) await purge(req.payload)
  return doc
}

export const revalidateAfterDelete: CollectionAfterDeleteHook = async ({ doc, req, context }) => {
  if (!context?.disableRevalidate) await purge(req.payload)
  return doc
}

export const revalidateGlobal: GlobalAfterChangeHook = async ({ doc, req, context }) => {
  if (!context?.disableRevalidate) await purge(req.payload)
  return doc
}
