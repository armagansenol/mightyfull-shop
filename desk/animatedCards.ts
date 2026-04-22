import {ListItemBuilder} from 'sanity/structure'

import defineStructure from '../utils/defineStructure'

export default defineStructure<ListItemBuilder>((S) =>
  S.listItem()
    .title('AnimatedCards')
    .schemaType('animatedCard')
    .child(S.documentTypeList('animatedCard')),
)
