import {orderableDocumentListDeskItem} from '@sanity/orderable-document-list'
import defineStructure from '../utils/defineStructure'

export default defineStructure((S, context) =>
  orderableDocumentListDeskItem({
    type: 'faq',
    title: 'FAQ Questions',
    S,
    context,
  }),
)
