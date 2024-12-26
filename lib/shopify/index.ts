import { SHOPIFY_GRAPHQL_API_VERSION } from 'lib/constants';
import { ensureStartsWith } from 'lib/utils';
import { revalidateTag } from 'next/cache';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export const TAGS = {
  collections: 'collections',
  products: 'products',
  cart: 'cart'
};

const clientDomain = process.env.SHOPIFY_STORE_DOMAIN
  ? ensureStartsWith(process.env.SHOPIFY_STORE_DOMAIN, 'https://')
  : '';
const apiVersion = SHOPIFY_GRAPHQL_API_VERSION;
const key = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!;

import { ProductDetail } from '@/types';
import {
  Cart,
  CartLineInput
} from '@shopify/hydrogen-react/storefront-api-types';
import { createStorefrontApiClient } from '@shopify/storefront-api-client';
import { createCartMutation } from './mutations/cart';
import { getCartQuery } from './queries/cart';
import { getProductQuery, getProductsQuery } from './queries/product';

export const shopifyClient = createStorefrontApiClient({
  storeDomain: clientDomain,
  apiVersion,
  privateAccessToken: key
});

// const removeEdgesAndNodes = <T>(array: Connection<T>): T[] => {
//   return array.edges.map((edge) => edge?.node);
// };

// const reshapeCart = (cart: ShopifyCart): Cart => {
//   if (!cart.cost?.totalTaxAmount) {
//     cart.cost.totalTaxAmount = {
//       amount: "0.0",
//       currencyCode: cart.cost.totalAmount.currencyCode,
//     }
//   }

//   return {
//     ...cart,
//     lines: removeEdgesAndNodes(cart.lines),
//   }
// }

export async function getCart(
  cartId: string | undefined
): Promise<Cart | undefined> {
  if (!cartId) {
    return undefined;
  }

  const res = await shopifyClient.request<Cart>(getCartQuery, {
    variables: { cartId }
  });

  // Old carts becomes `null` when you checkout.
  if (!res.data) {
    return undefined;
  }

  return res.data;
}

export async function getProduct(handle: string) {
  const a = await shopifyClient.request<{ product: ProductDetail }>(
    getProductQuery,
    {
      variables: {
        handle
      }
    }
  );
  return a;
}

export async function getProducts() {
  const a = await shopifyClient.request(getProductsQuery, {
    variables: {
      handle: 'products'
    }
  });
  return a;
}

export async function createCart(lines: CartLineInput[]) {
  const res = await shopifyClient.request<Cart>(createCartMutation, {
    variables: { lineItems: lines }
  });
  return res.data;
}

// This is called from `app/api/revalidate.ts` so providers can control revalidation logic.
export async function revalidate(req: NextRequest): Promise<NextResponse> {
  // We always need to respond with a 200 status code to Shopify,
  // otherwise it will continue to retry the request.
  const collectionWebhooks = [
    'collections/create',
    'collections/delete',
    'collections/update'
  ];
  const productWebhooks = [
    'products/create',
    'products/delete',
    'products/update'
  ];
  const topic = (await headers()).get('x-shopify-topic') || 'unknown';
  const secret = req.nextUrl.searchParams.get('secret');
  const isCollectionUpdate = collectionWebhooks.includes(topic);
  const isProductUpdate = productWebhooks.includes(topic);

  if (!secret || secret !== process.env.SHOPIFY_REVALIDATION_SECRET) {
    console.error('Invalid revalidation secret.');
    return NextResponse.json({ status: 200 });
  }

  if (!isCollectionUpdate && !isProductUpdate) {
    // We don't need to revalidate anything for any other topics.
    return NextResponse.json({ status: 200 });
  }

  if (isCollectionUpdate) {
    revalidateTag(TAGS.collections);
  }

  if (isProductUpdate) {
    revalidateTag(TAGS.products);
  }

  return NextResponse.json({ status: 200, revalidated: true, now: Date.now() });
}
