import { describe, expect, it } from 'vitest';
import { HIDDEN_PRODUCT_TAG } from '@/lib/constants';
import { ShopifyTransformer } from '@/lib/shopify/transformers';
import type { ShopifyCart } from '@/lib/shopify/types';
import {
  createShopifyCart,
  createShopifyProduct
} from '@/test/fixtures/shopify';

describe('ShopifyTransformer', () => {
  it('flattens cart connection lines and defaults missing tax amount', () => {
    const cart = createShopifyCart({
      cost: {
        subtotalAmount: { amount: '5.00', currencyCode: 'USD' },
        totalAmount: { amount: '5.00', currencyCode: 'USD' }
      }
    } as Partial<ShopifyCart>);

    const reshaped = ShopifyTransformer.reshapeCart(cart);

    expect(reshaped.lines).toHaveLength(1);
    expect(reshaped.lines[0]?.merchandise.id).toBe(
      'gid://shopify/ProductVariant/1'
    );
    expect(reshaped.cost.totalTaxAmount).toEqual({
      amount: '0.0',
      currencyCode: 'USD'
    });
  });

  it('filters hidden Shopify products', () => {
    const product = createShopifyProduct({
      tags: [HIDDEN_PRODUCT_TAG]
    });

    expect(ShopifyTransformer.reshapeProduct(product)).toBeUndefined();
    expect(ShopifyTransformer.reshapeProduct(product, false)?.id).toBe(
      product.id
    );
  });

  it('generates image alt text when Shopify image alt text is missing', () => {
    const product = createShopifyProduct({
      title: 'Chocolate Chip'
    });

    const reshaped = ShopifyTransformer.reshapeProduct(product, false);

    expect(reshaped?.images[0]?.altText).toBe(
      'Chocolate Chip - chocolate-chip'
    );
  });
});
