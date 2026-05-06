import {EarthGlobeIcon} from '@sanity/icons'
import {ImageIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

const TITLE = 'Layout'

export default defineType({
  name: 'layouts',
  title: TITLE,
  type: 'document',
  groups: [
    {
      name: 'homePage',
      title: 'HOME PAGE',
    },
    {
      name: 'productPage',
      title: 'PRODUCT PAGE',
    },
    {
      name: 'popup',
      title: 'WELCOME POPUP',
    },
  ],
  fields: [
    // Noticebar
    defineField({
      name: 'noticebar',
      title: 'Noticebar',
      type: 'noticebar',
    }),
    // Product Highlight
    defineField({
      name: 'productHighlight',
      title: 'Product Highlight Section',
      type: 'object',
      group: 'homePage',
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
    // Image Carousel
    defineField({
      name: 'imageCarousel',
      title: 'Image Carousel',
      type: 'array',
      icon: ImageIcon,
      group: 'productPage',
      of: [
        {
          type: 'image',
          name: 'image',
          title: 'Image',
        },
      ],
    }),
    // Social Links
    defineField({
      name: 'socialLinks',
      title: 'Social Media Links',
      type: 'array',
      icon: EarthGlobeIcon,
      of: [
        {
          type: 'object',
          name: 'socialLink',
          title: 'Social Link',
          fields: [
            defineField({
              name: 'platform',
              title: 'Platform',
              type: 'string',
              options: {
                list: [
                  {title: 'Facebook', value: 'facebook'},
                  {title: 'Twitter', value: 'twitter'},
                  {title: 'Instagram', value: 'instagram'},
                  {title: 'LinkedIn', value: 'linkedin'},
                  {title: 'YouTube', value: 'youtube'},
                  {title: 'TikTok', value: 'tiktok'},
                  {title: 'Other', value: 'other'},
                ],
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'url',
              title: 'URL',
              type: 'url',
              validation: (Rule) =>
                Rule.required().uri({
                  scheme: ['http', 'https'],
                }),
            }),
          ],
          preview: {
            select: {
              title: 'platform',
              subtitle: 'url',
            },
            prepare({title, subtitle}) {
              return {
                title: title === 'other' ? 'Other' : title.charAt(0).toUpperCase() + title.slice(1),
                subtitle: subtitle,
              }
            },
          },
        },
      ],
    }),
    // Welcome Popup Image
    defineField({
      name: 'welcomePopupImage',
      title: 'Welcome Popup Image',
      description: 'Lifestyle photo shown on the right side of the welcome popup.',
      type: 'image',
      group: 'popup',
      options: {hotspot: true},
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
