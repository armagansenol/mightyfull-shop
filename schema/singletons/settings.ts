import {CogIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

const TITLE = 'Settings'

export default defineType({
  name: 'settings',
  title: TITLE,
  type: 'document',
  icon: CogIcon,
  groups: [
    {
      name: 'layout',
      title: 'Layout',
    },
    {
      name: 'seo',
      title: 'SEO',
    },
  ],
  fields: [
    // Shop Menu
    defineField({
      name: 'shopMenu',
      title: 'Shop Menu',
      type: 'array',
      group: 'layout',
      of: [
        {
          name: 'productCollection',
          title: 'Product Collection',
          type: 'reference',
          to: [{type: 'productCollection'}],
        },
      ],
    }),

    // SEO
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      group: 'seo',
      description: 'Defaults for every page',
      options: {
        collapsed: false,
        collapsible: true,
      },
      fields: [
        defineField({
          name: 'title',
          title: 'Site title',
          type: 'string',
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'description',
          title: 'Description',
          type: 'text',
          rows: 2,
          validation: (rule) =>
            rule.max(150).warning('Longer descriptions may be truncated by search engines'),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    prepare() {
      return {
        title: TITLE,
      }
    },
  },
})
