import {ListItemBuilder} from 'sanity/structure'

import defineStructure from '../utils/defineStructure'

export default defineStructure<ListItemBuilder>((S) =>
  S.listItem().title('FAQ').schemaType('faq').child(S.documentTypeList('faq').title('FAQ')),
)
