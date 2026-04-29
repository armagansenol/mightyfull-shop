import {StructureResolver} from 'sanity/structure'

import {EnvelopeIcon, BulbOutlineIcon} from '@sanity/icons'
import animatedCards from './animatedCards'
import colorThemes from './colorThemes'
import faq from './faq'
import layouts from './layouts'
import policies from './policies'
import products from './products'
import settings from './settings'
import stores from './stores'
import testimonials from './testimonials'
import faqCategory from './faqCategory'
import productPageFaq from './product-page-faq'
/**
import faqCategory from '../schema/documents/faqCategory'
 * Desk structure overrides
 *
 * Sanity Studio automatically lists document types out of the box.
 * With this custom desk structure we achieve things like showing the `home`
 * and `settings` document types as singletons, and grouping product details
 * and variants for easy editorial access.
 *
 * You can customize this even further as your schemas progress.
 * To learn more about structure builder, visit our docs:
 * https://www.sanity.io/docs/overview-structure-builder
 */

// If you add document types to desk structure manually, you can add them to this array to prevent duplicates in the root pane
const DOCUMENT_TYPES_IN_STRUCTURE = [
  'collection',
  'colorTheme',
  'material',
  'media.tag',
  'product',
  'settings',
  'translation.metadata',
  'animatedCard',
]

export const structure: StructureResolver = (S, context) =>
  S.list()
    .title('Content')
    .items([
      layouts(S, context),
      S.divider(),
      products(S, context),
      colorThemes(S, context),
      animatedCards(S, context),
      testimonials(S, context),
      stores(S, context),
      policies(S, context),
      settings(S, context),
      S.listItem()
        .title('FAQ')
        .icon(BulbOutlineIcon)
        .child(
          S.list()
            .title('FAQ')
            .items([faqCategory(S, context), faq(S, context), productPageFaq(S, context)]),
        ),
      S.listItem()
        .title('Contact Form Submissions')
        .icon(EnvelopeIcon)
        .child(
          S.documentList()
            .title('Contact Form Submissions')
            .filter('_type == "contactForm"')
            .defaultOrdering([{field: '_createdAt', direction: 'desc'}]),
        ),
    ])
