import {DocumentsIcon} from '@sanity/icons'
import {ListItemBuilder} from 'sanity/structure'

import {SANITY_API_VERSION} from '../constants'
import defineStructure from '../utils/defineStructure'

export default defineStructure<ListItemBuilder>((S) =>
  S.listItem()
    .title('Pages')
    .icon(DocumentsIcon)
    .schemaType('page')
    .child(
      S.list()
        .title('Pages')
        .items([
          S.divider(),
          S.listItem()
            .title(`All Pages`)
            .schemaType('page')
            .icon(DocumentsIcon)
            .child(
              S.documentList()
                .id(`all-pages`)
                .title(`All Pages`)
                .schemaType('page')
                .filter('_type == "page"')
                .apiVersion(SANITY_API_VERSION)
                .canHandleIntent(
                  (intentName, params) => intentName === 'edit' || params.template === `guide`,
                ),
            ),
        ]),
    ),
)
