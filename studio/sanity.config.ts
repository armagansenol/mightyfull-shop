import {defineSanityConfig} from './define-config'

export default defineSanityConfig({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID ?? '7vetn2qx',
  dataset: process.env.SANITY_STUDIO_DATASET ?? 'production',
  preview: {
    domain: process.env.SANITY_STUDIO_PREVIEW_DOMAIN,
    secret: process.env.SANITY_STUDIO_PREVIEW_SECRET ?? '',
  },
  shopify: {
    storeDomain: process.env.SANITY_STUDIO_SHOPIFY_STORE_DOMAIN!,
  },
})
