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
import productPageFaq from './documents/product-page-faq'
import store from './documents/store'
import noticebar from './documents/noticebar'
import contactForm from './documents/contactForm'
import productSpecification from './documents/productSpecification'
import faqCategory from './documents/faqCategory'

// Singleton document types
import settings from './singletons/settings'
import policy from './singletons/policy'

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
import proxyString from './objects/proxyString'
import seoHome from './objects/seo/home'
import seoPage from './objects/seo/page'
import seoShopify from './objects/seo/shopify'
import shopifyCollection from './objects/shopifyCollection'
import shopifyCollectionRule from './objects/shopifyCollectionRule'
import shopifyProduct from './objects/shopifyProduct'
import shopifyProductVariant from './objects/shopifyProductVariant'

// Block content
import body from './blocks/body'
import simpleBlockContent from './blocks/simpleBlockContent'
import animatedCard from './documents/animatedCard'
import testimonial from './documents/testimonial'
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
  faqCategory,
  store,
  noticebar,
  productSpecification,
  productPageFaq,
]

const singletons = [settings, layouts, policy]

const blocks = [body, simpleBlockContent]

const objects = [
  customProductOptionColor,
  customProductOptionSize,
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
  contactForm,
]

export const types = [...annotations, ...documents, ...singletons, ...objects, ...blocks]
