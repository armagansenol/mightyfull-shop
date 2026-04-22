import {ListItemBuilder} from 'sanity/structure'

import defineStructure from '../utils/defineStructure'

export default defineStructure<ListItemBuilder>((S) =>
  S.listItem()
    .title('Product Pages')
    .schemaType('product')
    .child(
      S.documentTypeList('product').child(async (id) =>
        S.document().schemaType('product').documentId(id).views([S.view.form()]),
      ),
    ),
)
