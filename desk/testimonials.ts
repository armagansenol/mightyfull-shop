import {ListItemBuilder} from 'sanity/structure'

import defineStructure from '../utils/defineStructure'

export default defineStructure<ListItemBuilder>((S) =>
  S.listItem()
    .title('Testimonials')
    .schemaType('testimonial')
    .child(S.documentTypeList('testimonial').title('Testimonials')),
)
