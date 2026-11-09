import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { Categories } from './collections/Categories'
import { Media } from './collections/Media'
import { MenuItems } from './collections/MenuItems'
import { Users } from './collections/Users'
import { AboutPage } from './globals/AboutPage'
import { HomePage } from './globals/HomePage'
import { SiteSettings } from './globals/SiteSettings'
import { getSiteUrl } from './lib/siteUrl'
import { migrations } from './migrations'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

if (!process.env.PAYLOAD_SECRET && process.env.NODE_ENV === 'production') {
  throw new Error('PAYLOAD_SECRET must be set in production')
}

export default buildConfig({
  serverURL: getSiteUrl(),
  admin: {
    user: Users.slug,
    theme: 'dark',
    importMap: { baseDir: path.resolve(dirname) },
    meta: {
      titleSuffix: ' · Primo Burgers Dashboard',
      robots: 'noindex, nofollow',
    },
    components: {
      graphics: {
        Logo: '/components/admin/Logo#Logo',
        Icon: '/components/admin/Icon#Icon',
      },
      beforeDashboard: ['/components/admin/Welcome#Welcome'],
    },
  },
  collections: [MenuItems, Categories, Media, Users],
  globals: [SiteSettings, HomePage, AboutPage],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || 'dev-only-insecure-secret',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  graphQL: { disable: true },
  upload: { limits: { fileSize: 10_000_000 } }, // 10 MB per photo
  csrf: [getSiteUrl()],
  cors: [getSiteUrl()],
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URL || 'file:./primo.db',
      authToken: process.env.DATABASE_AUTH_TOKEN,
    },
    prodMigrations: migrations,
  }),
  sharp,
  plugins: [
    // In production on Vercel, photos are stored in Vercel Blob. Locally they go to ./media.
    vercelBlobStorage({
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      collections: { media: true },
      token: process.env.BLOB_READ_WRITE_TOKEN,
    }),
  ],
})
