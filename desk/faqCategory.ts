import {orderableDocumentListDeskItem} from '@sanity/orderable-document-list'
import defineStructure from '../utils/defineStructure'

export default defineStructure((S, context) =>
  orderableDocumentListDeskItem({
    type: 'faqCategory',
    title: 'FAQ Categories',
    S,
    context,
  }),
)
