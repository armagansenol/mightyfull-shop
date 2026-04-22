import {defineType} from 'sanity'

export default defineType({
  name: 'animatedCard',
  title: 'Animated Card',
  type: 'document',
  fields: [
    {
      name: 'displayTitle',
      title: 'Display Title',
      type: 'array',
      of: [{type: 'block'}],
    },
    {
      name: 'imgPackage',
      title: 'Package Image',
      type: 'image',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'imgCookie',
      title: 'Cookie Image',
      type: 'image',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'product',
      title: 'Shopify Product',
      type: 'reference',
      to: [{type: 'product'}],
      description: 'Select the Shopify product this card is associated with',
      validation: (Rule) => Rule.required(),
    },
  ],
  preview: {
    select: {
      title: 'product.title',
      imgPackage: 'imgPackage',
      imgCookie: 'imgCookie',
    },
    prepare(selection) {
      const {title, imgPackage, imgCookie} = selection
      return {
        title: title || 'No product selected',
        subtitle: 'Animated Card',
        media: imgPackage || imgCookie,
      }
    },
  },
})
