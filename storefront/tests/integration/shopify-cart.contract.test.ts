import { describe, expect, it } from 'vitest';
import { SHOPIFY_GRAPHQL_API_ENDPOINT } from '@/lib/constants';
import {
  addToCartMutation,
  createCartMutation,
  editCartItemsMutation,
  removeFromCartMutation
} from '@/lib/shopify/mutations/cart';

const shouldRun = process.env.RUN_SHOPIFY_CONTRACTS === 'true';
const storeDomain = process.env.SHOPIFY_STORE_DOMAIN;
const accessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const variantId = process.env.TEST_SHOPIFY_VARIANT_ID;
const sellingPlanId = process.env.TEST_SHOPIFY_SELLING_PLAN_ID;

type ShopifyResponse<T> = {
  data?: T;
  errors?: { message: string }[];
};

async function shopifyRequest<T>(
  query: string,
  variables?: Record<string, unknown>
) {
  if (!storeDomain || !accessToken) {
    throw new Error('Missing Shopify contract test credentials');
  }

  const domain = storeDomain.startsWith('https://')
    ? storeDomain
    : `https://${storeDomain}`;
  const response = await fetch(`${domain}${SHOPIFY_GRAPHQL_API_ENDPOINT}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': accessToken
    },
    body: JSON.stringify({ query, variables })
  });
  const body = (await response.json()) as ShopifyResponse<T>;

  if (!response.ok || body.errors?.length) {
    throw new Error(
      body.errors?.[0]?.message ?? `Shopify returned ${response.status}`
    );
  }

  return body.data;
}

describe.skipIf(!shouldRun)('Shopify cart contract', () => {
  it('creates, adds, updates, and removes a cart line', async () => {
    if (!variantId) {
      throw new Error('Missing TEST_SHOPIFY_VARIANT_ID');
    }

    const created = await shopifyRequest<{
      cartCreate: { cart: { id: string; checkoutUrl: string } };
    }>(createCartMutation);
    const cartId = created?.cartCreate.cart.id;
    const checkoutUrl = created?.cartCreate.cart.checkoutUrl;

    expect(cartId).toBeTruthy();
    expect(checkoutUrl).toBeTruthy();
    expect(() => new URL(checkoutUrl!)).not.toThrow();

    const added = await shopifyRequest<{
      cartLinesAdd: {
        cart: {
          totalQuantity: number;
          lines: { edges: { node: { id: string } }[] };
        };
      };
    }>(addToCartMutation, {
      cartId,
      lines: [{ merchandiseId: variantId, quantity: 1 }]
    });
    const lineId = added?.cartLinesAdd.cart.lines.edges[0]?.node.id;

    expect(added?.cartLinesAdd.cart.totalQuantity).toBe(1);
    expect(lineId).toBeTruthy();

    const updated = await shopifyRequest<{
      cartLinesUpdate: { cart: { totalQuantity: number } };
    }>(editCartItemsMutation, {
      cartId,
      lines: [{ id: lineId, merchandiseId: variantId, quantity: 2 }]
    });

    expect(updated?.cartLinesUpdate.cart.totalQuantity).toBe(2);

    const removed = await shopifyRequest<{
      cartLinesRemove: { cart: { totalQuantity: number } };
    }>(removeFromCartMutation, {
      cartId,
      lineIds: [lineId]
    });

    expect(removed?.cartLinesRemove.cart.totalQuantity).toBe(0);
  });

  it.skipIf(!sellingPlanId)(
    'adds a subscription line with a selling plan',
    async () => {
      if (!variantId || !sellingPlanId) {
        throw new Error(
          'Missing TEST_SHOPIFY_VARIANT_ID or TEST_SHOPIFY_SELLING_PLAN_ID'
        );
      }

      const created = await shopifyRequest<{
        cartCreate: { cart: { id: string } };
      }>(createCartMutation);
      const cartId = created?.cartCreate.cart.id;

      const added = await shopifyRequest<{
        cartLinesAdd: {
          cart: {
            lines: {
              edges: {
                node: {
                  sellingPlanAllocation?: {
                    sellingPlan: { id: string };
                  } | null;
                };
              }[];
            };
          };
        };
      }>(addToCartMutation, {
        cartId,
        lines: [{ merchandiseId: variantId, quantity: 1, sellingPlanId }]
      });

      expect(
        added?.cartLinesAdd.cart.lines.edges[0]?.node.sellingPlanAllocation
          ?.sellingPlan.id
      ).toBe(sellingPlanId);
    }
  );
});
