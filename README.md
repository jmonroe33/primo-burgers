# Primo Burgers — website & menu dashboard

Public website for **Primo Burgers** (4654 E Avenue S, Palmdale, CA) with a built-in admin dashboard
where the owner and staff edit the menu, prices, photos, hours and links — no code required.

| Audience | Read this |
|---|---|
| Owner / staff | [docs/OWNER-GUIDE.md](docs/OWNER-GUIDE.md) — logging in, prices, photos, hours, links, publishing |
| Before launch | [docs/LAUNCH-CHECKLIST.md](docs/LAUNCH-CHECKLIST.md) — missing business info + final testing checklist |
| Developer | this file |

---

## What's included

**Public site** (`src/app/(frontend)`)
- `/` home — hero, featured items, category tiles, DoorDash/Uber Eats ordering, about, location & hours with live "Open now", map, social links
- `/menu` — the QR-code destination. Instant search (name, description, ingredients, category, keywords; debounced; "cheeseburger" also matches "Cheese Burger"), horizontally scrolling category filters that combine with search, empty-results state, item detail modal, shareable URLs (`?q=`, `?category=`, `?item=`)
- `/menu/[slug]` — a static, indexable page for every item (167 pre-rendered)
- `/about`, `/contact` (tap-to-call, directions, embedded map), `/privacy`, 404 page
- Phones: sticky **Menu / Call / Order Online** bar, compact menu rows, hamburger navigation
- SEO: per-page titles/descriptions, canonical URLs, Open Graph image, `sitemap.xml`, `robots.txt`, Schema.org `Restaurant` (address, geo, hours, phone, social) + `Menu` structured data
- Accessibility: skip link, semantic landmarks/headings, visible focus rings, native `<dialog>` modals (focus trap + Esc), `aria-live` search results, labelled controls, reduced-motion support, AA contrast palette

**Dashboard** (`/admin`, Payload CMS 3)
- Menu items: name, category, price (+ optional price note), description, ingredients, main photo + gallery, dietary labels, extra search keywords, item-specific DoorDash/Uber Eats links, *Available right now*, *Feature on home page*, *Hide from website* (archive)
- Categories: name, note, photo, fallback icon, show on home, hide; drag-to-reorder for categories and items
- Restaurant info: phone, address, map pin, hours (validated), **Show prices** switch, DoorDash / Uber Eats / pickup links (validated per domain), Instagram / Facebook / TikTok / YouTube, announcement bar, SEO description, **QR code** download (PNG/SVG/printable card)
- Home page & About page text and photos
- Drafts + **Publish changes**, revision history (last 25 versions per item), delete confirmations, success/error toasts
- Roles: **Owner/Admin** (everything incl. staff accounts) and **Staff editor** (content only). First account created is always Admin. 5 failed logins → 10-minute lockout; 8-hour sessions
- Uploads: images only (JPG/PNG/WebP/AVIF/HEIC), 10 MB max, auto-converted to WebP in 3 sizes

**Unconfigured integrations are hidden, never faked.** If no DoorDash/Uber Eats link is set, the order dialog says ordering is coming soon and shows the phone number. Social icons only appear for accounts that have a URL.

## Architecture & tradeoffs

| Choice | Why | Tradeoff |
|---|---|---|
| **Next.js 16 + Payload CMS 3 in one app** | The dashboard lives at `/admin` on the same site — one deployment, one login, nothing extra to pay for. Payload's admin is clean enough for non-technical staff and is open source (no per-seat fees). | Sanity/Contentful offer a hosted editor with zero DB ops, but add a separate vendor account and paid tiers beyond free limits. |
| **SQLite (libSQL) → Turso in production** | Same database engine locally and in production; Turso's free tier is far more than a restaurant needs. | A single-region DB. Fine at this scale; switch to `@payloadcms/db-postgres` if multi-location needs grow. |
| **Vercel Blob for photos** | Vercel's filesystem is read-only, so uploads must live in object storage; Blob is built-in and cheap. | Locally, photos are stored in `./media` instead. |
| **Static pages + on-save revalidation** | Every public page is pre-rendered (fast LCP, cheap hosting). When staff save or publish, a Payload hook calls `revalidatePath('/', 'layout')`, so changes are live in seconds with **no redeploy**. A 1-hour revalidate is a safety net. | The whole (small) site is re-rendered on each save, which is intentional and cheap. |
| **Client-side search** | ~170 items is a tiny payload; searching in the browser is instant and works on spotty restaurant Wi-Fi. | Would move to server search if the menu grew to thousands of items. |
| **External ordering only** | DoorDash/Uber Eats handle checkout, payment and delivery. | No native cart — the data model (`MenuItems`, per-item provider URLs) leaves room for one later. |

```
src/
  app/(frontend)/      public pages, layout, styles (Tailwind v4 tokens in styles.css)
  app/(payload)/       Payload admin + REST API (generated — don't edit)
  app/(print)/qr/      /qr/menu.svg, /qr/menu.png, /qr/print table card
  app/sitemap.ts, robots.ts
  collections/         MenuItems, Categories, Media, Users
  globals/             SiteSettings, HomePage, AboutPage
  access/ hooks/ fields/   access control, cache revalidation, slug + URL validators
  components/site/     public UI (MenuBrowser, OrderProvider, MenuCard, ...)
  components/admin/    dashboard logo, welcome shortcuts, QR panel, hours row label
  lib/                 data access, search, hours/"open now", formatting, JSON-LD, QR
  migrations/          production DB migrations
  seed/                starter data (menu-data.json) + seed script
```

## Local development

Requires Node 22.23+ or 24.22+.

```bash
cp .env.example .env        # then set PAYLOAD_SECRET (openssl rand -hex 32)
npm install
npm run seed                # loads the 167-item starter menu + restaurant info (only into an empty DB)
npm run dev                 # http://localhost:3000  ·  dashboard: http://localhost:3000/admin
```

On first visit to `/admin` you'll be asked to create the first account (it becomes Owner/Admin).
To create one automatically for testing, set `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` before seeding.
`SEED_FORCE=1 npm run seed` wipes menu items/categories and re-imports the starter data.

After changing collection/global fields:

```bash
npm run generate:types && npm run generate:importmap
npm run migrate:create -- describe-change   # creates a migration for production
```

## Deploying (Vercel + Turso + Vercel Blob)

1. **Database** — create a Turso database (`turso db create primo-burgers`), then get its URL (`turso db show --url primo-burgers`) and a token (`turso db tokens create primo-burgers`).
2. **Create the tables and load the starter menu, before the first deploy.** The build pre-renders pages from the database, so it must already be populated. From your machine:
   ```bash
   DATABASE_URL=libsql://... DATABASE_AUTH_TOKEN=... NODE_ENV=production npm run seed
   ```
   Test logins from `SEED_ADMIN_*` are ignored when `NODE_ENV=production`.
3. **Vercel project** — import this repository. Add a **Blob** store under *Storage* (this sets `BLOB_READ_WRITE_TOKEN`).
4. **Environment variables** (Production): `PAYLOAD_SECRET` (a new value, not your local one), `NEXT_PUBLIC_SITE_URL` (the real domain), `DATABASE_URL`, `DATABASE_AUTH_TOKEN`. Do **not** set the `SEED_*` variables.
5. **Deploy.**
6. Visit `https://<domain>/admin`, create the Owner account, then follow [docs/LAUNCH-CHECKLIST.md](docs/LAUNCH-CHECKLIST.md).
7. **Domain** — add it under Vercel → Settings → Domains (HTTPS is automatic). `NEXT_PUBLIC_SITE_URL` must match the address staff use for `/admin`, because logins are restricted to that origin. Redeploy after changing it.

**Rollback:** Vercel → Deployments → pick the previous deployment → *Promote to Production*. Content is separate from code, so rolling back code never loses menu edits; individual menu items can be restored from their *Versions* tab.

**Backups:** check what your Turso plan includes; for your own copy, run `turso db shell primo-burgers .dump > backup.sql`.

**Cost:** Turso's free tier and Blob's free allowance should cover a single restaurant. Vercel's free Hobby plan is for non-commercial use, so a business site should expect to need Vercel Pro; check current terms and pricing.

## Security notes
- All write endpoints require a logged-in staff account; anonymous API reads only return published, non-hidden content; staff accounts are invisible to the public.
- No secrets are sent to the browser (only `NEXT_PUBLIC_SITE_URL` is public). `.env` is git-ignored.
- External links open with `rel="noopener noreferrer"`; ordering/social URLs are validated against the expected domains.
- `/admin` is `noindex` and excluded in `robots.txt`.

## Future features the structure supports
Per-item provider links are already in place for deep-linking. Spanish content (Payload `localization`), multiple locations (a `locations` collection + location reference on settings), seasonal items (date fields on menu items), promotions/coupons (a new collection rendered like the announcement bar), newsletter signup, and native online ordering can all be added without restructuring.
