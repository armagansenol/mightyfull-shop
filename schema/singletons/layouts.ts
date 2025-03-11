import {defineField, defineType} from 'sanity'

const TITLE = 'Layout'

export default defineType({
  name: 'layouts',
  title: TITLE,
  type: 'document',
  groups: [
    {
      name: 'home',
      title: 'HOME',
    },
  ],
  fields: [
    defineField({
      name: 'productHighlight',
      title: 'Product Highlight Section',
      type: 'object',
      group: 'home',
      fields: [
        {
          name: 'items',
          type: 'array',
          of: [
            {
              type: 'reference',
              to: [{type: 'animatedCard'}],
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'featureHighlight',
      title: 'Feature Highlight Section',
      type: 'object',
      group: 'home',
      fields: [
        {
          name: 'items',
          type: 'array',
          of: [
            {
              name: 'card',
              title: 'Card',
              type: 'object',
              fields: [
                {
                  name: 'title',
                  title: 'Title',
                  type: 'string',
                },
                {
                  name: 'description',
                  title: 'Description',
                  type: 'string',
                },
                {
                  name: 'icon',
                  title: 'Card Icon',
                  type: 'image',
                },
                {
                  name: 'colorTheme',
                  title: 'Color Theme',
                  type: 'reference',
                  to: [{type: 'colorTheme'}],
                },
              ],
            },
          ],
        },
      ],
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
