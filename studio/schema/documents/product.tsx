import {TagIcon} from '@sanity/icons'
import pluralize from 'pluralize-esm'
import {defineField, defineType} from 'sanity'

import ShopifyIcon from '../../components/icons/Shopify'
import ShopifyDocumentStatus from '../../components/media/ShopifyDocumentStatus'

const GROUPS = [
  {
    name: 'editorial',
    title: 'Editorial',
    default: true,
  },
  {
    name: 'shopifySync',
    title: 'Shopify sync',
    icon: ShopifyIcon,
  },
  {
    name: 'seo',
    title: 'SEO',
  },
]

export default defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  icon: TagIcon,
  groups: GROUPS,
  fields: [
    defineField({
      name: 'titleProxy',
      title: 'Title',
      type: 'proxyString',
      options: {field: 'store.title'},
    }),
    // defineField({
    //   name: 'displayTitle',
    //   title: 'Display Title',
    //   type: 'array',
    //   of: [{type: 'block'}],
    //   group: 'editorial',
    // }),
    defineField({
      name: 'featuredImageProxy',
      title: 'Featured Image',
      type: 'proxyString',
      options: {field: 'store.featuredImage'},
    }),
    defineField({
      name: 'sellingPlansProxy',
      title: 'Selling Plans',
      type: 'proxyString',
      options: {field: 'store.sellingPlans'},
    }),
    defineField({
      name: 'slugProxy',
      title: 'Slug',
      type: 'proxyString',
      options: {field: 'store.slug'},
    }),
    defineField({
      name: 'colorTheme',
      title: 'Color Theme',
      type: 'reference',
      to: [{type: 'colorTheme'}],
      group: 'editorial',
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [{type: 'image'}],
      group: 'editorial',
    }),
    defineField({
      name: 'productPageFaq',
      title: 'Product Page FAQ (legacy)',
      type: 'productPageFaq',
      group: 'editorial',
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: 'faqs',
      title: 'FAQs',
      description: 'Product-specific FAQs shown on the product detail page.',
      type: 'array',
      group: 'editorial',
      of: [
        {
          type: 'reference',
          to: [{type: 'faq'}],
        },
      ],
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      group: 'editorial',
      of: [
        {
          type: 'block',
          styles: [{title: 'Normal', value: 'normal'}],
          marks: {
            decorators: [
              {title: 'Strong', value: 'strong'},
              {title: 'Emphasis', value: 'em'},
              {title: 'Underline', value: 'underline'},
            ],
            annotations: [],
          },
          lists: [],
        },
      ],
    }),
    defineField({
      name: 'productSpecifications',
      title: 'Product Specifications',
      type: 'array',
      of: [{type: 'productSpecification'}],
      group: 'editorial',
    }),
    defineField({
      name: 'store',
      title: 'Shopify',
      type: 'shopifyProduct',
      description: 'Product data from Shopify (read-only)',
      group: 'shopifySync',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo.shopify',
      group: 'seo',
    }),
  ],
  orderings: [
    {
      name: 'titleAsc',
      title: 'Title (A-Z)',
      by: [{field: 'store.title', direction: 'asc'}],
    },
    {
      name: 'titleDesc',
      title: 'Title (Z-A)',
      by: [{field: 'store.title', direction: 'desc'}],
    },
    {
      name: 'priceDesc',
      title: 'Price (Highest first)',
      by: [{field: 'store.priceRange.minVariantPrice', direction: 'desc'}],
    },
    {
      name: 'priceAsc',
      title: 'Title (Lowest first)',
      by: [{field: 'store.priceRange.minVariantPrice', direction: 'asc'}],
    },
  ],
  preview: {
    select: {
      isDeleted: 'store.isDeleted',
      options: 'store.options',
      previewImageUrl: 'store.previewImageUrl',
      priceRange: 'store.priceRange',
      status: 'store.status',
      title: 'store.title',
      variants: 'store.variants',
    },
    prepare(selection) {
      const {isDeleted, options, previewImageUrl, status, title, variants} = selection

      const optionCount = options?.length
      const variantCount = variants?.length

      const description = [
        variantCount ? pluralize('variant', variantCount, true) : 'No variants',
        optionCount ? pluralize('option', optionCount, true) : 'No options',
      ]

      let subtitle = ''
      if (status !== 'active') {
        subtitle = '(Unavailable in Shopify)'
      }
      if (isDeleted) {
        subtitle = '(Deleted from Shopify)'
      }

      return {
        description: description.join(' / '),
        subtitle,
        title,
        media: (
          <ShopifyDocumentStatus
            isActive={status === 'active'}
            isDeleted={isDeleted}
            type="product"
            url={previewImageUrl}
            title={title}
          />
        ),
      }
    },
  },
})
