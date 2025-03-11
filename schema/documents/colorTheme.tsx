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
      name: 'text',
      title: 'Text',
      type: 'color',
      options: {disableAlpha: true},
      validation: (rule) => rule.required(),
    }),
    // Background color
    defineField({
      name: 'background',
      title: 'Background',
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
      backgroundColor: 'background.hex',
      textColor: 'text.hex',
      tertiary: 'tertiary.hex',
      title: 'title',
    },
    prepare(selection) {
      const {backgroundColor, textColor, tertiary} = selection

      return {
        media: <ColorTheme background={backgroundColor} text={textColor} />,
        title: `${textColor || '(No color)'} / ${backgroundColor || '(No color)'} / ${tertiary || '(No color)'}`,
      }
    },
  },
})
