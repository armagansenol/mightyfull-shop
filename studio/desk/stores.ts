import {ListItemBuilder} from 'sanity/structure'

import defineStructure from '../utils/defineStructure'

export default defineStructure<ListItemBuilder>((S) =>
  S.listItem()
    .title('Stores')
    .schemaType('store')
    .child(S.documentTypeList('store').title('Stores')),
)
