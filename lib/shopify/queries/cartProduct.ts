import { CART_PRODUCTS } from '@/lib/shopify/product';
import { shopifyClient } from '..';
import { CartProduct } from '../types';

export async function fetchCartProductData(productIds: string[]) {
  //   const data = await shopifyClient.fetch(CART_PRODUCTS, { variables: { ids: productIds } })
  //   return data

  const { data } = await shopifyClient.request<CartProduct[]>(CART_PRODUCTS, {
    variables: {
      productIds
    }
  });

  return data;
}
