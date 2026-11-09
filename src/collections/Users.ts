import type { CollectionConfig } from 'payload'
import { adminOnly, adminOnlyField, adminOrSelf } from '../access'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Staff account', plural: 'Staff accounts' },
  admin: {
    useAsTitle: 'email',
    group: 'Settings',
    defaultColumns: ['name', 'email', 'roles'],
    description: 'People who can log in to this dashboard. Only Owners/Admins can add or remove accounts.',
  },
  auth: {
    maxLoginAttempts: 5,
    lockTime: 10 * 60 * 1000, // 10 minutes after 5 failed attempts
    tokenExpiration: 60 * 60 * 8, // 8-hour sessions
    cookies: { sameSite: 'Lax', secure: process.env.NODE_ENV === 'production' },
  },
  access: {
    read: adminOrSelf,
    create: adminOnly,
    update: adminOrSelf,
    delete: adminOnly,
    admin: ({ req }) => Boolean(req.user),
  },
  hooks: {
    beforeChange: [
      // The very first account created (on /admin/create-first-user) is always an Owner/Admin.
      async ({ data, operation, req }) => {
        if (operation === 'create') {
          const { totalDocs } = await req.payload.count({ collection: 'users', req })
          if (totalDocs === 0) data.roles = ['admin']
        }
        return data
      },
    ],
  },
  fields: [
    { name: 'name', type: 'text', label: 'Name' },
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      required: true,
      defaultValue: ['editor'],
      saveToJWT: true,
      access: { create: adminOnlyField, update: adminOnlyField },
      options: [
        { label: 'Owner / Admin (everything, including staff accounts)', value: 'admin' },
        { label: 'Staff editor (menu, hours, website content)', value: 'editor' },
      ],
    },
  ],
}
