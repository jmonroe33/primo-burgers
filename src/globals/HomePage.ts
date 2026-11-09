import type { GlobalConfig } from 'payload'
import { anyone, staffOnly } from '../access'
import { revalidateGlobal } from '../hooks/revalidate'

export const HomePage: GlobalConfig = {
  slug: 'home-page',
  label: 'Home page',
  admin: { group: 'Website pages', description: 'Headlines, photos and text on the home page.' },
  versions: { drafts: true, max: 25 },
  access: { read: anyone, update: staffOnly },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    {
      name: 'hero',
      type: 'group',
      label: 'Top banner',
      fields: [
        { name: 'eyebrow', type: 'text', label: 'Small text above headline', defaultValue: 'Family-owned · Palmdale, CA' },
        { name: 'heading', type: 'text', required: true, label: 'Headline', defaultValue: 'Big Flavor. Fresh Favorites. Primo Burgers.' },
        {
          name: 'subheading',
          type: 'textarea',
          label: 'Supporting text',
          defaultValue:
            'Burgers, breakfast burritos, sandwiches and dinner plates made fresh — a friendly neighborhood diner for the whole family.',
        },
        { name: 'image', type: 'upload', relationTo: 'media', label: 'Banner photo', admin: { description: 'A large, wide food photo (at least 1600px wide).' } },
      ],
    },
    {
      name: 'featured',
      type: 'group',
      label: 'Featured items section',
      admin: { description: 'Which items appear here is set by ticking "Feature on home page" on each menu item.' },
      fields: [
        { name: 'heading', type: 'text', defaultValue: 'Fan favorites' },
        { name: 'subheading', type: 'text', defaultValue: 'A few of the dishes our guests keep coming back for.' },
      ],
    },
    {
      name: 'about',
      type: 'group',
      label: 'About section',
      fields: [
        { name: 'heading', type: 'text', defaultValue: 'Your neighborhood diner' },
        {
          name: 'text',
          type: 'textarea',
          defaultValue:
            'Primo Burgers is a family-owned American diner in Palmdale. From pancakes and breakfast burritos in the morning to burgers, sandwiches and dinner plates later in the day, we have something for the whole family.',
        },
        { name: 'image', type: 'upload', relationTo: 'media', label: 'Photo' },
      ],
    },
  ],
}
