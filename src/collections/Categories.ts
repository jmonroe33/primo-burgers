import type { CollectionConfig } from 'payload'
import { publishedAndVisible, staffOnly } from '../access'
import { slugField } from '../fields/slug'
import { revalidateAfterChange, revalidateAfterDelete } from '../hooks/revalidate'

export const CATEGORY_ICONS = [
  { label: 'Burger', value: 'burger' },
  { label: 'Pancakes / breakfast', value: 'pancakes' },
  { label: 'Eggs', value: 'egg' },
  { label: 'Burrito', value: 'burrito' },
  { label: 'Sandwich', value: 'sandwich' },
  { label: 'Dinner plate', value: 'plate' },
  { label: 'Taco / Mexican', value: 'taco' },
  { label: 'Basket / fried', value: 'basket' },
  { label: 'Salad', value: 'salad' },
  { label: 'Fries / sides', value: 'fries' },
  { label: 'Kids', value: 'kids' },
  { label: 'Star / specials', value: 'star' },
  { label: 'Drink', value: 'drink' },
  { label: 'Coffee / hot drink', value: 'coffee' },
] as const

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: { singular: 'Menu category', plural: 'Menu categories' },
  orderable: true,
  defaultSort: '_order',
  admin: {
    useAsTitle: 'name',
    group: 'Menu',
    defaultColumns: ['name', 'description', 'hidden', '_status'],
    description: 'Sections of the menu (Burgers, Breakfast, ...). Drag rows to change the order on the website.',
  },
  versions: { drafts: true, maxPerDoc: 25 },
  access: { read: publishedAndVisible, create: staffOnly, update: staffOnly, delete: staffOnly },
  hooks: { afterChange: [revalidateAfterChange], afterDelete: [revalidateAfterDelete] },
  fields: [
    { name: 'name', type: 'text', required: true, label: 'Category name' },
    {
      name: 'description',
      type: 'textarea',
      label: 'Short note',
      admin: { description: 'Optional. Shown under the category title, e.g. "Served with fries or small salad and soft drink."' },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Category photo',
      admin: { description: 'Optional. Used on the home page category tiles.' },
    },
    {
      name: 'icon',
      type: 'select',
      label: 'Icon (used when there is no photo)',
      defaultValue: 'burger',
      options: CATEGORY_ICONS.map((o) => ({ ...o })),
    },
    slugField('name'),
    {
      name: 'showOnHome',
      type: 'checkbox',
      label: 'Show as a tile on the home page',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
    {
      name: 'hidden',
      type: 'checkbox',
      label: 'Hide this whole category from the website',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
  ],
}
