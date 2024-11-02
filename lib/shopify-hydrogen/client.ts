import { createStorefrontClient } from "@shopify/hydrogen-react"

export const storeDomain = process.env.SHOPIFY_STORE_DOMAIN as string
export const publicStorefrontToken = process.env.SHOPIFY_STOREFRONT_API_TOKEN as string
export const storefrontApiVersion = process.env.SHOPIFY_STOREFRONT_API_VERSION as string

export const storefront = createStorefrontClient({
  storeDomain,
  storefrontApiVersion,
  publicStorefrontToken,
})
