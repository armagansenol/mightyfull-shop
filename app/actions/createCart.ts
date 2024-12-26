"use server"

import { shopifyClient } from "@/lib/shopify"
import { createCartMutation } from "@/lib/shopify/mutations/cart"
import { Cart, CartLineInput } from "@shopify/hydrogen-react/storefront-api-types"

export async function createCart(lines: CartLineInput[]) {
  const res = await shopifyClient.request<Cart>(createCartMutation, {
    variables: { lineItems: lines },
  })
  return res.data
}
