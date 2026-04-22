import {orderRankField} from '@sanity/orderable-document-list'
import {defineField, defineType} from 'sanity'
import {BulbOutlineIcon} from '@sanity/icons'

export default defineType({
  name: 'faq',
  title: 'FAQ',
  type: 'document',
  icon: BulbOutlineIcon,
  fields: [
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{type: 'faqCategory'}],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'question',
      title: 'Question',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'answer',
      title: 'Answer',
      type: 'array',
      of: [{type: 'block'}],
      validation: (rule) => rule.required(),
    }),
    orderRankField({
      type: 'faq',
    }),
  ],
  preview: {
    select: {
      question: 'question',
      category: 'category.title',
    },
    prepare(selection) {
      const {question, category} = selection
      return {
        title: question,
        subtitle: category,
        media: BulbOutlineIcon,
      }
    },
  },
})
