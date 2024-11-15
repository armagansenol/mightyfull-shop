"use server"

import { shopifyClient } from "@/lib/shopify"
import { createCartMutation } from "@/lib/shopify/mutations/cart"
import { ShopifyCreateCartOperation } from "@/lib/shopify/types"

export async function createCart(lines: { merchandiseId: string; quantity: number; sellingPlanId: string }[]) {
  const res = await shopifyClient.request<ShopifyCreateCartOperation>(createCartMutation, {
    variables: { lineItems: lines },
  })
  return res.data
}
