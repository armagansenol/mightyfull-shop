'use server';

import { CART_PRODUCTS } from '@/lib/shopify/product';
import { shopifyClient } from '@/lib/shopify';

export async function fetchCartProducts(ids: string[]) {
  return await shopifyClient.request(CART_PRODUCTS, {
    variables: {
      ids
    }
  });
}
