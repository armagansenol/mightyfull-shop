'use server';

import { ANIMATED_CARDS_QUERY } from '@/lib/sanity/animatedCards';
import { sanityFetch } from '@/lib/sanity/client';
import { getProduct } from '@/lib/shopify';
import type { AnimatedCardProps } from '@/types';

export async function getAllProducts() {
  const cards = await sanityFetch<AnimatedCardProps[]>({
    query: ANIMATED_CARDS_QUERY,
    tags: ['animatedCards']
  });

  const results = await Promise.allSettled(
    cards.map(async (card) => {
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
