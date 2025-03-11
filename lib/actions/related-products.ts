'use server';

import { sanityFetch } from '@/lib/sanity/client';
import { ANIMATED_CARDS_QUERY } from '@/lib/sanity/animatedCards';
import { getProduct } from '@/lib/shopify';
import { AnimatedCardProps } from '@/types';

export async function getRelatedProducts(hiddenProductSlug: string) {
  // First, fetch all the animated cards from Sanity
  const cards = await sanityFetch<AnimatedCardProps[]>({
    query: ANIMATED_CARDS_QUERY,
    tags: ['animatedCards']
  });

  // Then, fetch the corresponding Shopify product data for each card
  const cardsWithProducts = await Promise.all(
    cards
      .filter((card) => card.product.shopifySlug !== hiddenProductSlug)
      .map(async (card) => {
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
