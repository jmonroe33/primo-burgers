import type { Field } from 'payload'
import { slugify } from '../lib/slugify'

/** URL-friendly name, generated automatically from another field when left blank. */
export const slugField = (from = 'name'): Field => ({
  name: 'slug',
  type: 'text',
  unique: true,
  index: true,
  label: 'Web address (slug)',
  admin: {
    position: 'sidebar',
    description: 'Filled in automatically. Only change this if you know you need to.',
  },
  hooks: {
    beforeValidate: [
      ({ value, data }) => {
        if (typeof value === 'string' && value.trim()) return slugify(value)
        const source = data?.[from]
        return typeof source === 'string' ? slugify(source) : value
      },
    ],
  },
})
