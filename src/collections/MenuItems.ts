import type { CollectionConfig } from 'payload'
import { publishedAndVisible, staffOnly } from '../access'
import { slugField } from '../fields/slug'
import { urlField } from '../fields/url'
import { revalidateAfterChange, revalidateAfterDelete } from '../hooks/revalidate'

export const DIETARY_TAGS = [
  { label: 'Vegetarian', value: 'vegetarian' },
  { label: 'Vegan', value: 'vegan' },
  { label: 'Spicy', value: 'spicy' },
  { label: 'Gluten-free', value: 'gluten-free' },
] as const

export const MenuItems: CollectionConfig = {
  slug: 'menu-items',
  labels: { singular: 'Menu item', plural: 'Menu items' },
  orderable: true,
  defaultSort: '_order',
  admin: {
    useAsTitle: 'name',
    group: 'Menu',
    defaultColumns: ['name', 'category', 'price', 'available', 'featured', 'hidden', '_status'],
    listSearchableFields: ['name', 'description', 'ingredients'],
    pagination: { defaultLimit: 50 },
    description:
      'Every dish on the menu. Click a name to edit it, then press "Publish changes". Drag rows to reorder.',
  },
  versions: { drafts: true, maxPerDoc: 25 },
  access: { read: publishedAndVisible, create: staffOnly, update: staffOnly, delete: staffOnly },
  hooks: { afterChange: [revalidateAfterChange], afterDelete: [revalidateAfterDelete] },
  fields: [
    { name: 'name', type: 'text', required: true, label: 'Item name' },
    {
      type: 'row',
      fields: [
        {
          name: 'category',
          type: 'relationship',
          relationTo: 'categories',
          required: true,
          label: 'Category',
          admin: { width: '50%' },
        },
        {
          name: 'price',
          type: 'number',
          label: 'Price ($)',
          min: 0,
          max: 1000,
          admin: {
            width: '25%',
            step: 0.01,
            description: 'e.g. 10.99 — leave blank if there is no fixed price',
          },
        },
        {
          name: 'priceNote',
          type: 'text',
          label: 'Price note',
          admin: { width: '25%', description: 'Optional, e.g. "Market price"' },
        },
      ],
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      maxLength: 400,
      admin: { description: 'One or two appetizing sentences.' },
    },
    {
      name: 'ingredients',
      type: 'textarea',
      label: 'Ingredients',
      maxLength: 600,
      admin: { description: 'Optional. Only list ingredients you have confirmed. Customers can search these.' },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Main photo',
      admin: { description: 'Landscape photos (4:3) look best. Leave blank to show the category icon.' },
    },
    {
      name: 'additionalImages',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      maxRows: 6,
      label: 'More photos (optional)',
    },
    {
      name: 'dietaryTags',
      type: 'select',
      hasMany: true,
      label: 'Dietary labels',
      options: DIETARY_TAGS.map((o) => ({ ...o })),
      admin: { description: 'Only choose labels you have verified.' },
    },
    {
      name: 'searchKeywords',
      type: 'text',
      label: 'Extra search words',
      admin: { description: 'Optional words customers might search for, e.g. "breakfast, chorizo, egg".' },
    },
    {
      type: 'collapsible',
      label: 'Item-specific delivery links (optional)',
      admin: { initCollapsed: true },
      fields: [
        urlField('doordashUrl', 'DoorDash link for this item', {
          hosts: ['doordash.com'],
          description: 'Only if DoorDash gives this item its own link. Otherwise leave blank — the main store link is used.',
        }),
        urlField('ubereatsUrl', 'Uber Eats link for this item', {
          hosts: ['ubereats.com'],
          description: 'Only if Uber Eats gives this item its own link. Otherwise leave blank — the main store link is used.',
        }),
      ],
    },
    slugField('name'),
    {
      name: 'available',
      type: 'checkbox',
      label: 'Available right now',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description: 'Uncheck to show "Temporarily unavailable" (item stays on the menu).',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Feature on home page',
      defaultValue: false,
      admin: { position: 'sidebar', description: 'Up to 6 featured items are shown.' },
    },
    {
      name: 'hidden',
      type: 'checkbox',
      label: 'Hide from website',
      defaultValue: false,
      admin: { position: 'sidebar', description: 'Hides the item without deleting it (archive).' },
    },
  ],
}
