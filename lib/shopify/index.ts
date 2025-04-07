import { TAGS } from 'lib/constants';
import { isShopifyError } from 'lib/type-guards';
import { cookies } from 'next/headers';
import { CacheStrategy, SHOPIFY_CONFIG } from './config';
import { shopifyLogger } from './logger';
import {
  addToCartMutation,
  createCartMutation,
  editCartItemsMutation,
  removeFromCartMutation
} from './mutations/cart';
import { getCartQuery } from './queries/cart';
import { getProductQuery, getProductsQuery } from './queries/product';
import { getShopQuery } from './queries/shop';
import { ShopifyTransformer } from './transformers';
import {
  Cart,
  Product,
  ShopifyAddToCartOperation,
  ShopifyCart,
  ShopifyCartOperation,
  ShopifyCreateCartOperation,
  ShopifyProductOperation,
  ShopifyProductsOperation,
  ShopifyRemoveFromCartOperation,
  ShopifyShop,
  ShopifyShopOperation,
  ShopifyUpdateCartOperation,
  ShopifyUpdateSellingPlanOperation,
  CartLineItem,
  CartUpdateLineItem,
  CartSellingPlanUpdateLineItem
} from './types';

type ExtractVariables<T> = T extends { variables: object }
  ? T['variables']
  : never;

type ShopifyResponse = {
  data: {
    cart?: ShopifyCart;
    cartCreate?: { cart: ShopifyCart };
    cartLinesAdd?: { cart: ShopifyCart };
    cartLinesRemove?: { cart: ShopifyCart };
    cartLinesUpdate?: { cart: ShopifyCart };
  };
};

const handleShopifyError = (error: unknown, query?: string): never => {
  if (isShopifyError(error)) {
    shopifyLogger.error('Shopify API Error', { error, query });
    throw {
      cause: error.cause?.toString() || 'unknown',
      status: error.status || 500,
      message: error.message,
      query
    };
  }

  shopifyLogger.error('Unexpected Error', { error, query });
  throw {
    error,
    query
  };
};

export async function shopifyFetch<T>({
  cache = SHOPIFY_CONFIG.defaultCache,
  headers,
  query,
  tags,
  variables
}: {
  cache?: RequestCache;
  headers?: HeadersInit;
  query: string;
  tags?: string[];
  variables?: ExtractVariables<T>;
}): Promise<{ status: number; body: T }> {
  const startTime = performance.now();
  try {
    const result = await fetch(SHOPIFY_CONFIG.endpoint, {
      method: 'POST',
      headers: {
        ...SHOPIFY_CONFIG.defaultHeaders,
        ...headers
      },
      body: JSON.stringify({
        ...(query && { query }),
        ...(variables && { variables })
      }),
      cache,
      ...(tags && { next: { tags } })
    });

    const body = await result.json();

    if (body.errors) {
      throw body.errors[0];
    }

    const duration = performance.now() - startTime;
    shopifyLogger.logApiCall(query, duration, { variables });

    return {
      status: result.status,
      body
    };
  } catch (e) {
    return handleShopifyError(e, query);
  }
}

const createCartService = () => {
  const executeCartOperation = async <T extends ShopifyResponse>({
    query,
    variables,
    cache = CacheStrategy.NO_STORE
  }: {
    query: string;
    variables?: ExtractVariables<T>;
    cache?: RequestCache;
  }): Promise<Cart> => {
    const res = await shopifyFetch<T>({
      query,
      variables,
      cache
    });

    const cart =
      res.body.data.cartCreate?.cart ||
      res.body.data.cartLinesAdd?.cart ||
      res.body.data.cartLinesRemove?.cart ||
      res.body.data.cartLinesUpdate?.cart ||
      res.body.data.cart;

    if (!cart) {
      shopifyLogger.error('No cart data received from Shopify');
      throw new Error('No cart data received from Shopify');
    }

    ShopifyTransformer.validateCart(cart);
    return ShopifyTransformer.reshapeCart(cart);
  };

  return {
    async create() {
      const existingCartId = (await cookies()).get('cartId')?.value;
      if (existingCartId) {
        const existingCart = await this.get(existingCartId);
        if (existingCart) return existingCart;
      }
      return executeCartOperation<ShopifyCreateCartOperation>({
        query: createCartMutation
      });
    },

    async add(cartId: string, lines: CartLineItem[]) {
      return executeCartOperation<ShopifyAddToCartOperation>({
        query: addToCartMutation,
        variables: { cartId, lines }
      });
    },

    async remove(cartId: string, lineIds: string[]) {
      return executeCartOperation<ShopifyRemoveFromCartOperation>({
        query: removeFromCartMutation,
        variables: { cartId, lineIds }
      });
    },

    async update(cartId: string, lines: CartUpdateLineItem[]) {
      return executeCartOperation<ShopifyUpdateCartOperation>({
        query: editCartItemsMutation,
        variables: { cartId, lines }
      });
    },

    async updateSellingPlan(
      cartId: string,
      lines: CartSellingPlanUpdateLineItem[]
    ) {
      return executeCartOperation<ShopifyUpdateSellingPlanOperation>({
        query: editCartItemsMutation,
        variables: { cartId, lines }
      });
    },

    async get(cartId?: string): Promise<Cart | undefined> {
      if (!cartId) {
        const existingCartId = await cookies().get('cartId')?.value;
        if (!existingCartId) return undefined;
        cartId = existingCartId;
      }

      const res = await shopifyFetch<ShopifyCartOperation>({
        query: getCartQuery,
        variables: { cartId },
        tags: [TAGS.cart]
      });

      if (!res.body.data.cart) {
        return undefined;
      }

      ShopifyTransformer.validateCart(res.body.data.cart);
      return ShopifyTransformer.reshapeCart(res.body.data.cart);
    }
  };
};

export const cartService = createCartService();

export async function getProduct(handle: string): Promise<Product | undefined> {
  const res = await shopifyFetch<ShopifyProductOperation>({
    query: getProductQuery,
    tags: [TAGS.products],
    variables: { handle }
  });

  if (res.body.data.product) {
    ShopifyTransformer.validateProduct(res.body.data.product);
  }

  return ShopifyTransformer.reshapeProduct(res.body.data.product, false);
}

export async function getProducts({
  query,
  reverse,
  sortKey
}: {
  query?: string;
  reverse?: boolean;
  sortKey?: string;
}): Promise<Product[]> {
  const res = await shopifyFetch<ShopifyProductsOperation>({
    query: getProductsQuery,
    tags: [TAGS.products],
    variables: {
      query,
      reverse,
      sortKey
    }
  });

  return ShopifyTransformer.reshapeProducts(
    ShopifyTransformer.removeEdgesAndNodes(res.body.data.products)
  );
}

// This is called from `app/api/revalidate.ts` so providers can control revalidation logic.
// export async function revalidate(req: NextRequest): Promise<NextResponse> {
//   // We always need to respond with a 200 status code to Shopify,
//   // otherwise it will continue to retry the request.
//   const collectionWebhooks = [
//     'collections/create',
//     'collections/delete',
//     'collections/update'
//   ];
//   const productWebhooks = [
//     'products/create',
//     'products/delete',
//     'products/update'
//   ];
//   const topic = (await headers()).get('x-shopify-topic') || 'unknown';
//   const secret = req.nextUrl.searchParams.get('secret');
//   const isCollectionUpdate = collectionWebhooks.includes(topic);
//   const isProductUpdate = productWebhooks.includes(topic);

//   if (!secret || secret !== process.env.SHOPIFY_REVALIDATION_SECRET) {
//     console.error('Invalid revalidation secret.');
//     return NextResponse.json({ status: 401 });
//   }

//   if (!isCollectionUpdate && !isProductUpdate) {
//     // We don't need to revalidate anything for any other topics.
//     return NextResponse.json({ status: 200 });
//   }

//   if (isCollectionUpdate) {
//     revalidateTag(TAGS.collections);
//   }

//   if (isProductUpdate) {
//     revalidateTag(TAGS.products);
//   }

//   return NextResponse.json({ status: 200, revalidated: true, now: Date.now() });
// }

export async function getShop(): Promise<ShopifyShop> {
  const res = await shopifyFetch<ShopifyShopOperation>({
    query: getShopQuery
  });

  return res.body.data.shop;
}
