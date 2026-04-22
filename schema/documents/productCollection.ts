import {defineType} from 'sanity'

export default defineType({
  name: 'productCollection',
  title: 'Product Collection',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [
        {
          name: 'product',
          title: 'Product',
          type: 'reference',
          to: [{type: 'product'}],
        },
      ],
      validation: (Rule) => Rule.required(),
    },
  ],
})
