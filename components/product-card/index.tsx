import { routes } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { AnimatedCardProps } from '@/types';
import { AnimatedCard } from '../animated-card';
import { AddToCart } from '../cart/add-to-cart';
import { Button } from '../ui/button';
import { Link } from '../utility/link';
import s from './product-card.module.scss';

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
    <div
      className={cn(s['product-card'], 'flex flex-col gap-10 flex-shrink-0')}
      key={id}
    >
      <Link
        href={`/${routes.shop.url}/${animatedCard.product.shopifySlug}`}
        prefetch={true}
      >
        <AnimatedCard {...animatedCard} />
      </Link>
      <div className="flex flex-row tablet:flex-col items-stretch gap-2">
        <Button colorTheme="blue-ruin" asChild size="sm" padding="slim">
          <Link
            href={`/${routes.shop.url}/${animatedCard.product.shopifySlug}`}
            prefetch={true}
          >
            SHOP NOW
          </Link>
        </Button>
        <AddToCart availableForSale={availableForSale} variantId={variantId} />
      </div>
    </div>
  );
}
