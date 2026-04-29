import {DocumentTextIcon} from '@sanity/icons'
import {ListItemBuilder} from 'sanity/structure'

import defineStructure from '../utils/defineStructure'

const POLICIES: {id: string; title: string}[] = [
  {id: 'privacyPolicy', title: 'Privacy Policy'},
  {id: 'refundPolicy', title: 'Refund Policy'},
  {id: 'termsOfService', title: 'Terms of Service'},
]

export default defineStructure<ListItemBuilder>((S) =>
  S.listItem()
    .title('Legal Policies')
    .icon(DocumentTextIcon)
    .child(
      S.list()
        .title('Legal Policies')
        .items(
          POLICIES.map(({id, title}) =>
            S.listItem()
              .title(title)
              .id(id)
              .icon(DocumentTextIcon)
              .child(
                S.document()
                  .schemaType('policy')
                  .documentId(id)
                  .title(title),
              ),
          ),
        ),
    ),
)
