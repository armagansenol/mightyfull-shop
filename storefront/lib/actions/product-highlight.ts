'use server';

import { sanityFetch } from '@/lib/sanity/client';
import { PRODUCT_HIGHLIGHT_QUERY } from '@/lib/sanity/productHighlight';
import { getProduct } from '@/lib/shopify';
import type { ProductHighlightQueryResult } from '@/types';

export async function getProductHighlight() {
  const result = await sanityFetch<ProductHighlightQueryResult>({
    query: PRODUCT_HIGHLIGHT_QUERY,
    tags: ['productHighlight']
  });

  const results = await Promise.allSettled(
    result.productHighlight.items.map(async (card) => {
      const shopifyProduct = await getProduct(card.product.shopifySlug);
      return { ...card, shopifyProduct };
    })
  );

  return results
    .filter(
      (
        result
      ): result is PromiseFulfilledResult<
        (typeof results)[number] extends PromiseSettledResult<infer T>
          ? T
          : never
      > => result.status === 'fulfilled'
    )
    .map((result) => result.value);
}
