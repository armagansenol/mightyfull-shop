import s from './product-card.module.scss';

import { cn } from '@/lib/utils';

import { AnimatedCard } from '@/components/animated-card';
import { AddToCart } from '@/components/cart/add-to-cart';
import { LetterSwapOnHover } from '@/components/letter-swap-on-hover';
import { Button } from '@/components/ui/button';
import { Link } from '@/components/utility/link';
import { routes } from '@/lib/constants';
import { AnimatedCardProps } from '@/types';

export interface ProductCardProps {
  id: string;
  animatedCard: AnimatedCardProps;
  variantId: string;
  availableForSale: boolean;
}

export function ProductCard({
  id,
  animatedCard,
  variantId,
  availableForSale
}: ProductCardProps) {
  return (
    <div className={cn(s['product-card'], 'flex flex-col')} key={id}>
      <Link
        href={`/${routes.shop.url}/${animatedCard.product.shopifySlug}`}
        prefetch={true}
      >
        <AnimatedCard {...animatedCard} />
      </Link>
      <div className={cn(s['button-c'], 'flex flex-col')}>
        <Button
          hoverAnimation={false}
          className={s.button}
          colorTheme="blue-ruin"
          asChild
          size="sm"
        >
          <Link
            href={`/${routes.shop.url}/${animatedCard.product.shopifySlug}`}
            prefetch={true}
          >
            <LetterSwapOnHover label="SHOP NOW" />
          </Link>
        </Button>
        <AddToCart
          buttonTheme="inverted-blue-ruin"
          className={s.button}
          availableForSale={availableForSale}
          variantId={variantId}
        />
      </div>
    </div>
  );
}
