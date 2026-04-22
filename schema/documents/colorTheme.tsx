import {IceCreamIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

import ColorTheme from '../../components/media/ColorTheme'

export default defineType({
  name: 'colorTheme',
  title: 'Color theme',
  type: 'document',
  icon: IceCreamIcon,
  groups: [
    {
      name: 'shopifySync',
      title: 'Shopify sync',
    },
  ],
  fields: [
    // Text color
    defineField({
      name: 'primary',
      title: 'Primary',
      type: 'color',
      options: {disableAlpha: true},
      validation: (rule) => rule.required(),
    }),
    // Background color
    defineField({
      name: 'secondary',
      title: 'Secondary',
      type: 'color',
      options: {disableAlpha: true},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'tertiary',
      title: 'Tertiary',
      type: 'color',
      options: {disableAlpha: true},
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      secondaryColor: 'secondary.hex',
      primaryColor: 'primary.hex',
      tertiaryColor: 'tertiary.hex',
      title: 'title',
    },
    prepare(selection) {
      const {secondaryColor, primaryColor, tertiaryColor} = selection

      return {
        media: <ColorTheme background={secondaryColor} text={primaryColor} />,
        title: `${primaryColor || '(No color)'} / ${secondaryColor || '(No color)'} / ${tertiaryColor || '(No color)'}`,
      }
    },
  },
})
