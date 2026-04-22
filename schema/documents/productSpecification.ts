import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'productSpecification',
  title: 'Product Specification',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
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
        },
      ],
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      description: 'description',
    },
    prepare(selection) {
      const {title, description} = selection
      const descriptionText = description?.[0]?.children
        ? description[0].children.map((child: any) => child.text).join(' ')
        : 'No description'
      return {
        title: title,
        subtitle: descriptionText,
      }
    },
  },
})
