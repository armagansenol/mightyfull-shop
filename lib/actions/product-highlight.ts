'use server';

import { sanityFetch } from '@/lib/sanity/client';
import { PRODUCT_HIGHLIGHT_QUERY } from '@/lib/sanity/productHighlight';
import { getProduct } from '@/lib/shopify';
import { ProductHighlightQueryResult } from '@/types';

export async function getProductHighlight() {
  // First, fetch the product highlight from Sanity
  const result = await sanityFetch<ProductHighlightQueryResult>({
    query: PRODUCT_HIGHLIGHT_QUERY,
    tags: ['productHighlight']
  });

  // Then, fetch the corresponding Shopify product data for each card
  const cardsWithProducts = await Promise.all(
    result.productHighlight.items.map(async (card) => {
      const shopifyProduct = await getProduct(card.product.shopifySlug);

      // Return a combined object with both Sanity and Shopify data
      return {
        ...card,
        shopifyProduct
      };
    })
  );

  return cardsWithProducts;
}
