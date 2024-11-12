import { SHOPIFY_GRAPHQL_API_VERSION, TAGS } from "lib/constants"
import { ensureStartsWith } from "lib/utils"
import { revalidateTag } from "next/cache"
import { headers } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

const clientDomain = process.env.SHOPIFY_STORE_DOMAIN
  ? ensureStartsWith(process.env.SHOPIFY_STORE_DOMAIN, "https://")
  : ""
const apiVersion = SHOPIFY_GRAPHQL_API_VERSION
const key = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!

import { ProductDetail } from "@/types"
import { createStorefrontApiClient } from "@shopify/storefront-api-client"
import { createCartMutation } from "./mutations/cart"
import { getProductQuery, getProductsQuery } from "./queries/product"
import { ShopifyCreateCartOperation } from "./types"

export const shopifyClient = createStorefrontApiClient({
  storeDomain: clientDomain,
  apiVersion,
  privateAccessToken: key,
})

// const reshapeCollection = (collection: ShopifyCollection): Collection | undefined => {
//   if (!collection) {
//     return undefined
//   }

//   return {
//     ...collection,
//     path: `/search/${collection.handle}`,
//   }
// }

// const reshapeCollections = (collections: ShopifyCollection[]) => {
//   const reshapedCollections = []

//   for (const collection of collections) {
//     if (collection) {
//       const reshapedCollection = reshapeCollection(collection)

//       if (reshapedCollection) {
//         reshapedCollections.push(reshapedCollection)
//       }
//     }
//   }

//   return reshapedCollections
// }

// const reshapeImages = (images: Connection<Image>, productTitle: string) => {
//   const flattened = removeEdgesAndNodes(images)

//   return flattened.map((image) => {
//     const filename = image.url.match(/.*\/(.*)\..*/)?.[1]
//     return {
//       ...image,
//       altText: image.altText || `${productTitle} - ${filename}`,
//     }
//   })
// }

// const removeEdgesAndNodes = <T>(array: Connection<T>): T[] => {
//   return array.edges.map((edge) => edge?.node)
// }

// const reshapeProduct = (product: ShopifyProduct, filterHiddenProducts: boolean = true) => {
//   if (!product || (filterHiddenProducts && product.tags.includes(HIDDEN_PRODUCT_TAG))) {
//     return undefined
//   }

//   const { images, variants, ...rest } = product

//   return {
//     ...rest,
//     images: reshapeImages(images, product.title),
//     variants: removeEdgesAndNodes(variants),
//   }
// }

// const reshapeProducts = (products: ShopifyProduct[]) => {
//   const reshapedProducts = []

//   for (const product of products) {
//     if (product) {
//       const reshapedProduct = reshapeProduct(product)

//       if (reshapedProduct) {
//         reshapedProducts.push(reshapedProduct)
//       }
//     }
//   }

//   return reshapedProducts
// }

export async function getProduct() {
  const a = await shopifyClient.request<{ product: ProductDetail }>(getProductQuery, {
    variables: {
      handle: "chocolate-chip",
    },
  })
  return a
}

export async function getProducts() {
  const a = await shopifyClient.request(getProductsQuery, {
    variables: {
      handle: "products",
    },
  })
  return a
}

export async function createCart() {
  const res = await shopifyClient.request<ShopifyCreateCartOperation>(createCartMutation)
  return res.data
}

// export async function getProductSellingPlans() {
//   const a = await shopifyClient.request(getProductSellingPlansQuery, {
//     variables: {
//       id: "gid://shopify/Product/8519377223832",
//     },
//   })
//   return a
// }

// This is called from `app/api/revalidate.ts` so providers can control revalidation logic.
export async function revalidate(req: NextRequest): Promise<NextResponse> {
  // We always need to respond with a 200 status code to Shopify,
  // otherwise it will continue to retry the request.
  const collectionWebhooks = ["collections/create", "collections/delete", "collections/update"]
  const productWebhooks = ["products/create", "products/delete", "products/update"]
  const topic = (await headers()).get("x-shopify-topic") || "unknown"
  const secret = req.nextUrl.searchParams.get("secret")
  const isCollectionUpdate = collectionWebhooks.includes(topic)
  const isProductUpdate = productWebhooks.includes(topic)

  if (!secret || secret !== process.env.SHOPIFY_REVALIDATION_SECRET) {
    console.error("Invalid revalidation secret.")
    return NextResponse.json({ status: 200 })
  }

  if (!isCollectionUpdate && !isProductUpdate) {
    // We don't need to revalidate anything for any other topics.
    return NextResponse.json({ status: 200 })
  }

  if (isCollectionUpdate) {
    revalidateTag(TAGS.collections)
  }

  if (isProductUpdate) {
    revalidateTag(TAGS.products)
  }

  return NextResponse.json({ status: 200, revalidated: true, now: Date.now() })
}
