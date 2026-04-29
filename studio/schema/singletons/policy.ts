import {DocumentTextIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'policy',
  title: 'Legal Policy',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'lastUpdated',
      title: 'Last Updated',
      type: 'date',
      options: {dateFormat: 'YYYY-MM-DD'},
      description: 'Shown above the policy body. Editors should bump this when content changes.',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'body',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      lastUpdated: 'lastUpdated',
    },
    prepare({title, lastUpdated}) {
      return {
        title: title || 'Policy',
        subtitle: lastUpdated ? `Last updated ${lastUpdated}` : undefined,
      }
    },
  },
})
