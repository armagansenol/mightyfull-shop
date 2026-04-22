import {DocumentTextIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export default defineType({
  title: 'Product Page FAQs',
  name: 'productPageFaq',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    defineField({
      title: 'FAQ Items',
      name: 'items',
      type: 'array',
      description: 'List of FAQs',
      of: [
        {
          type: 'reference',
          to: [{type: 'faq'}],
        },
      ],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      itemsCount: 'items.length',
    },
    prepare(selection) {
      const {title, itemsCount = 0} = selection
      return {
        title: title || 'Product FAQs',
        subtitle: `${itemsCount} ${itemsCount === 1 ? 'FAQ' : 'FAQs'}`,
      }
    },
  },
})
