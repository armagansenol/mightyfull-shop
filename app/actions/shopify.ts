"use server"

import { shopifyClient } from "@/lib/shopify"
import { getProductQuery } from "@/lib/shopify/queries/product"
import { ProductDetail } from "@/types"

export async function getShopifyProductByHandle(handle: string) {
  return await shopifyClient.request<{ product: ProductDetail }>(getProductQuery, {
    variables: {
      handle,
    },
  })
}
