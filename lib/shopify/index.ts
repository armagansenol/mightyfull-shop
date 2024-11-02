import { HIDDEN_PRODUCT_TAG, SHOPIFY_GRAPHQL_API_VERSION, TAGS } from "lib/constants"
import { ensureStartsWith } from "lib/utils"
import { revalidateTag } from "next/cache"
import { headers } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

const clientDomain = process.env.SHOPIFY_STORE_DOMAIN
  ? ensureStartsWith(process.env.SHOPIFY_STORE_DOMAIN, "https://")
  : ""
const apiVersion = SHOPIFY_GRAPHQL_API_VERSION
const key = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!

// export async function shopifyFetch<T>({
//   cache = "force-cache",
//   headers,
//   query,
//   tags,
//   variables,
// }: {
//   cache?: RequestCache
//   headers?: HeadersInit
//   query: string
//   tags?: string[]
//   variables?: ExtractVariables<T>
// }): Promise<{ status: number; body: T } | never> {
//   try {
//     const result = await fetch(endpoint, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "X-Shopify-Storefront-Access-Token": key,
//         ...headers,
//       },
//       body: JSON.stringify({
//         ...(query && { query }),
//         ...(variables && { variables }),
//       }),
//       cache,
//       ...(tags && { next: { tags } }),
//     })

//     const body = await result.json()

//     if (body.errors) {
//       throw body.errors[0]
//     }

//     return {
//       status: result.status,
//       body,
//     }
//   } catch (e) {
//     if (isShopifyError(e)) {
//       throw {
//         cause: e.cause?.toString() || "unknown",
//         status: e.status || 500,
//         message: e.message,
//         query,
//       }
//     }

//     throw {
//       error: e,
//       query,
//     }
//   }
// }

import { createStorefrontApiClient } from "@shopify/storefront-api-client"
import { getProductsQuery } from "./queries/product"
import { Collection, Connection, Image, ShopifyCollection, ShopifyProduct } from "./types"

const client = createStorefrontApiClient({
  storeDomain: clientDomain,
  apiVersion,
  privateAccessToken: key,
})

const reshapeCollection = (collection: ShopifyCollection): Collection | undefined => {
  if (!collection) {
    return undefined
  }

  return {
    ...collection,
    path: `/search/${collection.handle}`,
  }
}

const reshapeCollections = (collections: ShopifyCollection[]) => {
  const reshapedCollections = []

  for (const collection of collections) {
    if (collection) {
      const reshapedCollection = reshapeCollection(collection)

      if (reshapedCollection) {
        reshapedCollections.push(reshapedCollection)
      }
    }
  }

  return reshapedCollections
}

const reshapeImages = (images: Connection<Image>, productTitle: string) => {
  const flattened = removeEdgesAndNodes(images)

  return flattened.map((image) => {
    const filename = image.url.match(/.*\/(.*)\..*/)?.[1]
    return {
      ...image,
      altText: image.altText || `${productTitle} - ${filename}`,
    }
  })
}

const removeEdgesAndNodes = <T>(array: Connection<T>): T[] => {
  return array.edges.map((edge) => edge?.node)
}

const reshapeProduct = (product: ShopifyProduct, filterHiddenProducts: boolean = true) => {
  if (!product || (filterHiddenProducts && product.tags.includes(HIDDEN_PRODUCT_TAG))) {
    return undefined
  }

  const { images, variants, ...rest } = product

  return {
    ...rest,
    images: reshapeImages(images, product.title),
    variants: removeEdgesAndNodes(variants),
  }
}

const reshapeProducts = (products: ShopifyProduct[]) => {
  const reshapedProducts = []

  for (const product of products) {
    if (product) {
      const reshapedProduct = reshapeProduct(product)

      if (reshapedProduct) {
        reshapedProducts.push(reshapedProduct)
      }
    }
  }

  return reshapedProducts
}

export async function getProducts() {
  const a = await client.request(getProductsQuery, {
    variables: {
      handle: "products",
    },
  })
  return reshapeProducts(removeEdgesAndNodes(a.data.products))
}

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
