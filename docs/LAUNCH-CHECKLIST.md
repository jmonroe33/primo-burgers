# Launch checklist

## A. Business information still needed

Everything below is editable in the dashboard. Items marked ⚠ are blank or unverified, and the website hides them until they're filled in.

| Item | Status | Where to set it |
|---|---|---|
| DoorDash store URL | ⚠ **Missing**: no verifiable listing found | Restaurant info & links → Ordering |
| Uber Eats store URL | ⚠ **Missing**: Uber Eats lists several "Primo Burgers" in Palmdale (#6, 7, 10, 11, 12) and none could be confirmed as 4654 E Ave S | Restaurant info & links → Ordering |
| Facebook page URL | ⚠ **Missing**: not verified | Restaurant info & links → Social media |
| Instagram | ⚠ Prefilled as `instagram.com/primoburger7palmdale` from the handle provided. **Open it and confirm it's the right account** | Restaurant info & links → Social media |
| Pickup ordering link | Optional. The existing MenuStar site (orderprimoburgers.mobile-webview8.com) could be used. Note: it only loads over http (not https), and its page loads an obfuscated script from themenustar.com. Ask MenuStar about both before linking customers to it | Restaurant info & links → Ordering |
| Suite / unit number | ⚠ The old site shows "SF, 4654 E Ave S". Confirm whether "SF" means a suite (e.g. Suite F) | Contact & location |
| Phone (661) 533-6806 | From the existing ordering site. Confirm it's current | Contact & location |
| Hours | From the existing ordering site (Mon–Thu & Sun 7 AM–9 PM, Fri–Sat 7 AM–10 PM). Confirm | Hours |
| Menu prices | 167 prices imported from the existing ordering site on 2026-11-06. **Check them**, then turn on *Show prices* | Menu items; Ordering → Show prices |
| Menu descriptions / ingredients | Most items have none (the old menu didn't either). Add short descriptions for popular items | Menu items |
| Food photos | ⚠ **None yet**. The old site had no photos, and no stock or fake photos were used. Photograph at least the 6 featured items + home banner | Menu items, Home page |
| Our story (About page) | ⚠ Blank, so the section is hidden. Owner should write it (how it started, the family, what makes it special) | About Us page → Our story |
| Public email | Optional | Contact & location |
| Domain name | ⚠ Needed for the QR code (`NEXT_PUBLIC_SITE_URL`) | Developer / hosting |
| Owner dashboard account | Create at `/admin` after deploy | — |

## B. Pre-launch technical steps
- [ ] Turso database created; `DATABASE_URL` + `DATABASE_AUTH_TOKEN` set in Vercel
- [ ] Vercel Blob store added (`BLOB_READ_WRITE_TOKEN`)
- [ ] `PAYLOAD_SECRET` set (new random value, not the local one)
- [ ] `NEXT_PUBLIC_SITE_URL` = real domain; custom domain attached; HTTPS working
- [ ] Starter menu seeded into production
- [ ] Owner account created; test staff-editor account created and checked
- [ ] Google Business Profile: website link → domain, menu link → `/menu`
- [ ] Submit `https://<domain>/sitemap.xml` in Google Search Console
- [ ] QR code downloaded **after** the domain is live; test-scan the printed copy with iPhone and Android

## C. Final testing checklist

✅ = verified during development (local dev + production build). ☐ = check again on the live site.

**Menu & search**
- ✅ All 167 items / 18 categories display; grouped by category with category notes
- ✅ Search: "bacon" → 10 items, "chorizo" → Chorizo Burrito + Chorizo Plate, "cheeseburger" → 10 items (incl. "Cheese Burger" spellings)
- ✅ Search + category filter combine (`bacon` + Burgers → 3 items)
- ✅ Empty results show a message + "Clear search"
- ✅ Item modal opens from a `?item=` link; `/menu/<item>` pages exist for every item
- ☐ Clicking a menu card opens the modal; featured cards open the item page
- ✅ Hidden items: not on the menu, item page returns 404, not returned by the public API
- ✅ Unavailable items show "Temporarily unavailable"
- ✅ Prices hidden by default; showing them is one switch

**Dashboard**
- ✅ Login works; anonymous users get 403 on edits, can't list or create accounts
- ✅ Price edit (5.99 → 6.49) → Publish → visible on the site; in a production build the cached page refreshed immediately
- ✅ Saved-but-unpublished drafts don't appear publicly
- ✅ Photo upload → resized WebP versions → shown on the menu card; non-image uploads (SVG) rejected
- ✅ Wrong-site ordering link (example.com in the DoorDash field) rejected with a clear message
- ✅ Revision history records each publish
- ☐ Staff editor role: can edit content, cannot manage accounts (built in, not yet tested)
- ☐ First account created at `/admin` becomes Owner/Admin (built in, not yet tested)
- ☐ Real photo uploaded from a phone (HEIC) on the live site

**Ordering, social, contact**
- ✅ Order dialog lists only configured providers; with none configured it shows "coming soon" + tap-to-call
- ☐ DoorDash / Uber Eats links open the correct store in a new tab (after URLs are added)
- ☐ Instagram / Facebook links open the right accounts
- ✅ Embedded map displays
- ☐ Tap-to-call and Get Directions open correctly on a phone

**QR**
- ✅ `/qr/menu.png` (2400 px) and `/qr/menu.svg` generated: high error correction, 4-module quiet zone, black on white
- ✅ Printable 4×6" card; warns when the site isn't on its permanent domain
- ☐ Scan the printed code on the live domain

**Responsive & accessibility**
- ✅ 375 px phone: no horizontal overflow, hamburger menu, sticky Menu/Call/Order bar, compact menu rows, scrollable category chips
- ✅ Desktop 1280 px layout
- ☐ Keyboard: skip link, focus rings, Esc closes dialogs (built in, not yet tested)
- ☐ Screen reader announces search results; color contrast measured (built in, not yet tested)
- ☐ Run Lighthouse (Performance / Accessibility / SEO) on the live domain
- ☐ Spot-check on a real iPhone + Android, and on a tablet

**Production**
- ✅ `npm run build` succeeds; type-check clean; all public pages pre-rendered
- ✅ `sitemap.xml` (172 URLs), `robots.txt` (blocks /admin, /api), Restaurant + Menu JSON-LD, Open Graph image
- ✅ No secrets in client code; `.env` git-ignored
- ☐ Validate structured data with Google's Rich Results Test on the live domain
