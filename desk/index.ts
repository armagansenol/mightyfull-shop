import {StructureResolver} from 'sanity/structure'

import animatedCards from './animatedCards'
import colorThemes from './colorThemes'
import layouts from './layouts'
import products from './products'
import settings from './settings'
import testimonials from './testimonials'
import faq from './faq'

/**
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
      S.divider(),
      colorThemes(S, context),
      animatedCards(S, context),
      testimonials(S, context),
      S.divider(),
      settings(S, context),
      S.divider(),
      faq(S, context),
    ])
