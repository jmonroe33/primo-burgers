/**
 * Loads the starter menu and restaurant details into the CMS.
 *
 *   npm run seed            → only fills an EMPTY database (safe to run anytime)
 *   SEED_FORCE=1 npm run seed → deletes all menu items/categories first, then re-imports
 *
 * Optional: set SEED_ADMIN_EMAIL + SEED_ADMIN_PASSWORD to also create an Owner/Admin login
 * (handy for local testing; in production create the first account at /admin instead).
 */
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config'
import { slugify } from '../lib/slugify'
import data from './menu-data.json' with { type: 'json' }

type SeedItem = { name: string; price?: number; description?: string; featured?: boolean; dietaryTags?: string[] }
type SeedCategory = { name: string; icon: string; showOnHome: boolean; description?: string; items: SeedItem[] }

const ctx = { disableRevalidate: true }

const run = async () => {
  const payload = await getPayload({ config })
  const force = process.argv.includes('--force') || process.env.SEED_FORCE === '1'

  const existing = await payload.count({ collection: 'categories', overrideAccess: true })
  if (existing.totalDocs > 0 && !force) {
    payload.logger.info('Menu already has content — skipping menu import (set SEED_FORCE=1 to re-import).')
  } else {
    if (force) {
      await payload.delete({ collection: 'menu-items', where: { id: { exists: true } }, context: ctx })
      await payload.delete({ collection: 'categories', where: { id: { exists: true } }, context: ctx })
    }
    const usedSlugs = new Set<string>()
    let count = 0
    for (const c of (data as { categories: SeedCategory[] }).categories) {
      const cat = await payload.create({
        collection: 'categories',
        context: ctx,
        data: {
          name: c.name,
          description: c.description || undefined,
          icon: c.icon as never,
          showOnHome: c.showOnHome,
          _status: 'published',
        },
      })
      for (const i of c.items) {
        let slug = slugify(i.name)
        if (usedSlugs.has(slug)) slug = `${slug}-${cat.slug}`
        usedSlugs.add(slug)
        await payload.create({
          collection: 'menu-items',
          context: ctx,
          data: {
            name: i.name,
            slug,
            category: cat.id,
            price: i.price,
            description: i.description,
            featured: Boolean(i.featured),
            dietaryTags: (i.dietaryTags ?? []) as never,
            available: true,
            hidden: false,
            _status: 'published',
          },
        })
        count++
      }
    }
    payload.logger.info(`Imported ${count} menu items.`)
  }

  const settings = await payload.findGlobal({ slug: 'site-settings' })
  if (!settings.phone || force) {
    await payload.updateGlobal({
      slug: 'site-settings',
      context: ctx,
      data: {
        restaurantName: 'Primo Burgers',
        phone: '(661) 533-6806',
        address: { street: '4654 E Avenue S', unit: '', city: 'Palmdale', state: 'CA', zip: '93552' },
        geo: { lat: 34.556703, lng: -118.0458604 },
        hours: [
          { day: 'Monday', open: '7:00 AM', close: '9:00 PM' },
          { day: 'Tuesday', open: '7:00 AM', close: '9:00 PM' },
          { day: 'Wednesday', open: '7:00 AM', close: '9:00 PM' },
          { day: 'Thursday', open: '7:00 AM', close: '9:00 PM' },
          { day: 'Friday', open: '7:00 AM', close: '10:00 PM' },
          { day: 'Saturday', open: '7:00 AM', close: '10:00 PM' },
          { day: 'Sunday', open: '7:00 AM', close: '9:00 PM' },
        ],
        showPrices: false,
        // Not verified yet — fill these in from the dashboard (buttons stay hidden while blank).
        doordashUrl: '',
        ubereatsUrl: '',
        pickupUrl: '',
        pickupLabel: 'Order for pickup',
        instagramUrl: 'https://www.instagram.com/primoburger7palmdale/',
        facebookUrl: '',
        metaDescription:
          'Primo Burgers is a family-owned diner in Palmdale, CA serving burgers, breakfast burritos, pancakes, sandwiches and dinner plates. View the menu and order online.',
      },
    })
    payload.logger.info('Restaurant settings saved.')
  }

  await payload.updateGlobal({ slug: 'home-page', context: ctx, data: { _status: 'published' } })
  const about = await payload.findGlobal({ slug: 'about-page' })
  await payload.updateGlobal({
    slug: 'about-page',
    context: ctx,
    data: {
      _status: 'published',
      highlights: about.highlights?.length
        ? about.highlights
        : [
            { title: 'Family-owned', text: 'A family-run American diner in Palmdale.' },
            { title: 'Breakfast through dinner', text: 'Pancakes, omelettes and breakfast burritos in the morning; burgers, sandwiches and dinner plates all day.' },
            { title: 'Right here in Palmdale', text: 'Stop in, call ahead, or order online for delivery.' },
          ],
    },
  })

  const email = process.env.SEED_ADMIN_EMAIL
  const password = process.env.SEED_ADMIN_PASSWORD
  // Test logins never belong in production, even if a local .env is present.
  if (email && password && process.env.NODE_ENV !== 'production') {
    const { totalDocs } = await payload.count({ collection: 'users', where: { email: { equals: email } } })
    if (!totalDocs) {
      await payload.create({ collection: 'users', data: { email, password, name: 'Owner', roles: ['admin'] } })
      payload.logger.info(`Created admin login ${email}`)
    }
  }
  payload.logger.info('Seed complete.')
  process.exit(0)
}

// `payload run` exits as soon as this module finishes loading, so await at the top level.
try {
  await run()
} catch (e) {
  console.error(e)
  process.exit(1)
}
