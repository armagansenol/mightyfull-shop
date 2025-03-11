// Rich text annotations used in the block content editor
import annotationLinkEmail from './annotations/linkEmail'
import annotationLinkExternal from './annotations/linkExternal'
import annotationLinkInternal from './annotations/linkInternal'

// Document types
import collection from './documents/collection'
import colorTheme from './documents/colorTheme'
import product from './documents/product'
import productCollection from './documents/productCollection'
import faq from './documents/faq'

// Singleton document types
import settings from './singletons/settings'

// Object types
import customProductOptionColor from './objects/customProductOption/color'
import customProductOptionSize from './objects/customProductOption/size'
import label from './objects/label'
import linkExternal from './objects/linkExternal'
import linkInternal from './objects/linkInternal'
import moduleAccordion from './objects/module/accordion'
import moduleCallout from './objects/module/callout'
import moduleCollection from './objects/module/collection'
import moduleGrid from './objects/module/grid'
import moduleInstagram from './objects/module/instagram'
import moduleTaggedProducts from './objects/module/taggedProducts'
import placeholderString from './objects/placeholderString'
import productOption from './objects/productOption'
import productSpecs from './objects/productSpecs'
import proxyString from './objects/proxyString'
import seoHome from './objects/seo/home'
import seoPage from './objects/seo/page'
import seoShopify from './objects/seo/shopify'
import shopifyCollection from './objects/shopifyCollection'
import shopifyCollectionRule from './objects/shopifyCollectionRule'
import shopifyProduct from './objects/shopifyProduct'

// Block content
import body from './blocks/body'
import simpleBlockContent from './blocks/simpleBlockContent'
import animatedCard from './documents/animatedCard'
import testimonial from './documents/testimonial'
import shopifyProductVariant from './objects/shopifyProductVariant'
import layouts from './singletons/layouts'
const annotations = [annotationLinkEmail, annotationLinkExternal, annotationLinkInternal]

const documents = [
  animatedCard,
  collection,
  colorTheme,
  product,
  productCollection,
  testimonial,
  faq,
]

const singletons = [settings, layouts]

const blocks = [body, simpleBlockContent]

const objects = [
  customProductOptionColor,
  customProductOptionSize,
  productSpecs,
  label,
  linkExternal,
  linkInternal,
  moduleAccordion,
  moduleCallout,
  moduleCollection,
  moduleGrid,
  moduleInstagram,
  moduleTaggedProducts,
  placeholderString,
  productOption,
  proxyString,
  seoHome,
  seoPage,
  seoShopify,
  shopifyCollection,
  shopifyCollectionRule,
  shopifyProduct,
  shopifyProductVariant,
]

export const types = [...annotations, ...documents, ...singletons, ...objects, ...blocks]
