import type { GlobalConfig } from 'payload'
import { anyone, staffOnly } from '../access'
import { revalidateGlobal } from '../hooks/revalidate'

export const AboutPage: GlobalConfig = {
  slug: 'about-page',
  label: 'About Us page',
  admin: { group: 'Website pages' },
  versions: { drafts: true, max: 25 },
  access: { read: anyone, update: staffOnly },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    { name: 'heading', type: 'text', required: true, defaultValue: 'About Primo Burgers' },
    {
      name: 'intro',
      type: 'textarea',
      label: 'Introduction',
      defaultValue:
        'Primo Burgers is a family-owned American diner in Palmdale, California, serving breakfast, burgers, breakfast burritos, sandwiches and dinner plates.',
    },
    { name: 'heroImage', type: 'upload', relationTo: 'media', label: 'Top photo' },
    {
      name: 'storyHeading',
      type: 'text',
      label: 'Story heading',
      defaultValue: 'Our story',
    },
    {
      name: 'story',
      type: 'textarea',
      label: 'Our story',
      admin: {
        description:
          'Tell customers how Primo Burgers started, who runs it, and what makes it special. Leave blank to hide this section. Separate paragraphs with an empty line.',
      },
    },
    {
      name: 'highlights',
      type: 'array',
      label: 'Highlights',
      maxRows: 6,
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'text', type: 'textarea' },
      ],
    },
    {
      name: 'gallery',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      maxRows: 9,
      label: 'Restaurant photos',
    },
  ],
}
