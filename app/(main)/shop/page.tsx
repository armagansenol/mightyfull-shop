import s from './shop.module.scss';

import { cn } from '@/lib/utils';

import { AnimatedCard } from '@/components/animated-card';
import { Button } from '@/components/ui/button';
import { Link } from '@/components/utility/link';
import { routes } from '@/lib/constants';
import { ANIMATED_CARDS_QUERY } from '@/lib/sanity/animatedCards';
import { sanityFetch } from '@/lib/sanity/client';
import { AnimatedCardProps } from 'types';
import { AddToCart } from '@/components/cart/add-to-cart';
import { getProduct } from '@/lib/shopify';

export default async function ShopPage() {
  const cards = await sanityFetch<AnimatedCardProps[]>({
    query: ANIMATED_CARDS_QUERY,
    tags: ['animatedCards']
  });

  const shopifyProducts = await Promise.all(
    cards.map(async (card) => {
      const shopifyProduct = await getProduct(card.product.shopifySlug);
      return shopifyProduct;
    })
  );

  console.log('cards', cards);
  console.log('shopifyProducts', shopifyProducts);

  return (
    <section className={cn(s.shop, 'flex flex-col items-center')}>
      <h2>Impossible to Choose Just One!</h2>
      <p>Can’t decide? Try them all and discover your new favorite!</p>
      <div className="flex flex-col items-center tablet:grid grid-cols-4 gap-16 mt-10 tablet:mt-20 px-4 tablet:px-0">
        {cards.map((item, i) => {
          return (
            <div
              className={cn(
                s.card,
                'flex flex-col items-stretch gap-5 tablet:gap-10'
              )}
              key={item.id}
            >
              <Link
                href={`/${routes.shop.url}/${item.product.shopifySlug}`}
                prefetch={true}
              >
                <AnimatedCard {...item} />
              </Link>
              <div className="flex flex-col items-stretch gap-2">
                <Button colorTheme="blueRuin" size="sm" padding="slim" asChild>
                  <Link
                    href={`/${routes.shop.url}/${item.product.shopifySlug}`}
                    prefetch={true}
                  >
                    SHOP NOW
                  </Link>
                </Button>
                {/* <Button colorTheme="invertedBlueRuin" size="sm" padding="slim">
                  ADD TO CART
                </Button> */}
                {shopifyProducts.length > 0 &&
                  shopifyProducts[i]?.variants?.[0]?.id && (
                    <AddToCart
                      availableForSale={shopifyProducts[i].availableForSale}
                      variantId={shopifyProducts[i].variants[0].id}
                    />
                  )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
