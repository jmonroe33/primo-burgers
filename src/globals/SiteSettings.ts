import type { GlobalConfig } from 'payload'
import { anyone, staffOnly } from '../access'
import { urlField } from '../fields/url'
import { revalidateGlobal } from '../hooks/revalidate'

const TIME_RE = /^(1[0-2]|0?[1-9]):[0-5]\d\s?(AM|PM)$/i
const timeValidate = (value: string | null | undefined, { siblingData }: { siblingData: { closed?: boolean } }) => {
  if (siblingData?.closed) return true
  if (!value) return 'Required (or tick "Closed")'
  return TIME_RE.test(value.trim()) || 'Use a time like 7:00 AM or 9:30 PM'
}

export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Restaurant info & links',
  admin: {
    group: 'Settings',
    description: 'Address, phone, hours, ordering links, social media and the menu QR code.',
  },
  versions: { drafts: false, max: 25 },
  access: { read: anyone, update: staffOnly },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Contact & location',
          fields: [
            { name: 'restaurantName', type: 'text', required: true, defaultValue: 'Primo Burgers' },
            {
              name: 'phone',
              type: 'text',
              label: 'Phone number',
              admin: { description: 'Shown with a tap-to-call button, e.g. (661) 533-6806' },
              validate: (v: string | null | undefined) =>
                !v || (v.replace(/\D/g, '').length >= 10 ? true : 'Please enter a full 10-digit phone number'),
            },
            { name: 'email', type: 'email', label: 'Public email (optional)' },
            {
              name: 'address',
              type: 'group',
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'street', type: 'text', label: 'Street address', admin: { width: '60%' } },
                    { name: 'unit', type: 'text', label: 'Suite / unit', admin: { width: '40%' } },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    { name: 'city', type: 'text', defaultValue: 'Palmdale', admin: { width: '40%' } },
                    { name: 'state', type: 'text', defaultValue: 'CA', admin: { width: '20%' } },
                    { name: 'zip', type: 'text', label: 'ZIP', admin: { width: '40%' } },
                  ],
                },
              ],
            },
            {
              name: 'geo',
              type: 'group',
              label: 'Map pin (optional)',
              admin: { description: 'Latitude/longitude used for Google search results. Leave blank if unsure.' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'lat', type: 'number', label: 'Latitude', admin: { width: '50%', step: 0.000001 } },
                    { name: 'lng', type: 'number', label: 'Longitude', admin: { width: '50%', step: 0.000001 } },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Hours',
          fields: [
            {
              name: 'hours',
              type: 'array',
              label: 'Business hours',
              labels: { singular: 'Day', plural: 'Days' },
              maxRows: 7,
              admin: {
                description: 'One row per day. Tick "Closed" for days you are closed.',
                components: { RowLabel: '/components/admin/HoursRowLabel#HoursRowLabel' },
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'day',
                      type: 'select',
                      required: true,
                      options: DAYS.map((d) => ({ label: d, value: d })),
                      admin: { width: '30%' },
                    },
                    { name: 'open', type: 'text', label: 'Opens', validate: timeValidate, admin: { width: '25%', placeholder: '7:00 AM' } },
                    { name: 'close', type: 'text', label: 'Closes', validate: timeValidate, admin: { width: '25%', placeholder: '9:00 PM' } },
                    { name: 'closed', type: 'checkbox', label: 'Closed', admin: { width: '20%', style: { alignSelf: 'center' } } },
                  ],
                },
              ],
            },
            {
              name: 'hoursNote',
              type: 'text',
              label: 'Hours note (optional)',
              admin: { description: 'e.g. "Closed Thanksgiving Day"' },
            },
          ],
        },
        {
          label: 'Ordering',
          fields: [
            {
              name: 'showPrices',
              type: 'checkbox',
              label: 'Show prices on the website',
              defaultValue: false,
              admin: { description: 'Turn this on when your prices are confirmed. Prices stay saved either way.' },
            },
            urlField('doordashUrl', 'DoorDash store link', { hosts: ['doordash.com'] }),
            urlField('ubereatsUrl', 'Uber Eats store link', { hosts: ['ubereats.com'] }),
            urlField('pickupUrl', 'Online pickup ordering link (optional)', {
              allowHttp: true,
              description: 'Your own pickup ordering page, if you have one. Leave blank to hide.',
            }),
            {
              name: 'pickupLabel',
              type: 'text',
              label: 'Pickup button text',
              defaultValue: 'Order for pickup',
            },
          ],
        },
        {
          label: 'Social media',
          fields: [
            urlField('instagramUrl', 'Instagram', { hosts: ['instagram.com'] }),
            urlField('facebookUrl', 'Facebook', { hosts: ['facebook.com', 'fb.com'] }),
            urlField('tiktokUrl', 'TikTok', { hosts: ['tiktok.com'] }),
            urlField('youtubeUrl', 'YouTube', { hosts: ['youtube.com', 'youtu.be'] }),
          ],
        },
        {
          label: 'Announcement bar',
          fields: [
            {
              name: 'announcement',
              type: 'group',
              label: false,
              fields: [
                { name: 'enabled', type: 'checkbox', label: 'Show announcement bar at the top of every page', defaultValue: false },
                { name: 'message', type: 'text', label: 'Message', maxLength: 140, admin: { placeholder: 'Now open on Sundays!' } },
                urlField('link', 'Link (optional)', { allowHttp: true }),
                { name: 'linkLabel', type: 'text', label: 'Link text', admin: { placeholder: 'Learn more' } },
              ],
            },
          ],
        },
        {
          label: 'QR code',
          fields: [
            {
              name: 'qrCode',
              type: 'ui',
              admin: { components: { Field: '/components/admin/QrCodeField#QrCodeField' } },
            },
          ],
        },
        {
          label: 'Search engines',
          fields: [
            {
              name: 'metaDescription',
              type: 'textarea',
              label: 'Google description',
              maxLength: 170,
              admin: { description: 'The short summary Google may show under your site name (about 150 characters).' },
            },
          ],
        },
      ],
    },
  ],
}
