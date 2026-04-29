'use client';

import type { EmblaOptionsType } from 'embla-carousel';
import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect, useState } from 'react';
import { IconArrow } from '@/components/icons';
import { ProductCard } from '@/components/product-card';
import type { getProduct } from '@/lib/shopify';
import { cn } from '@/lib/utils';
import type { ProductHighlightQueryResult } from '@/types';
import {
  NextButton,
  PrevButton,
  usePrevNextButtons
} from './EmblaCarouselButtons';
import s from './product-highlight-carousel.module.css';

// Define the enhanced type based on the structure returned by getProductHighlight
type SanityItem =
  ProductHighlightQueryResult['productHighlight']['items'][number];
// Infer the return type of getProduct
type ShopifyProductData = Awaited<ReturnType<typeof getProduct>>;

type EnhancedItem = SanityItem & {
  // Ensure this matches the actual structure; getProduct might return null
  shopifyProduct: ShopifyProductData | null;
};

export interface ProductHighlightCarouselProps {
  items: EnhancedItem[]; // Use the enhanced type
  options?: EmblaOptionsType;
}

export function ProductHighlightCarousel({
  items,
  options
}: ProductHighlightCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel(options);
  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick
  } = usePrevNextButtons(emblaApi);
  const [currentSlide, setCurrentSlide] = useState(0);

  const currentColor = items[currentSlide].product.colorTheme.primary;

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCurrentSlide(emblaApi.selectedScrollSnap());

  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div className="relative w-screen h-screen flex items-center">
      <div className="flex-shrink-0" ref={emblaRef}>
        <div className="flex touch-pan-y touch-pinch-zoom">
          {items.map((item, index) => {
            return (
              <div className={cn(s.slide, 'flex-shrink-0')} key={item.id}>
                <div
                  className={cn(s['animation-c'], {
                    [s.active]: currentSlide === index
                  })}
                >
                  <ProductCard
                    id={item.id}
                    animatedCard={item}
                    variantId={item.shopifyProduct?.variants[0].id as string}
                    availableForSale={
                      item.shopifyProduct?.variants[0]
                        .availableForSale as boolean
                    }
                  />
                </div>
              </div>
            );
          })}
        </div>
        <PrevButton
          className={cn(s.prevButton, 'cursor-pointer')}
          onClick={onPrevButtonClick}
          disabled={prevBtnDisabled}
        >
          <IconArrow fill={`${currentColor}`} rotate={180} />
        </PrevButton>
        <NextButton
          className={cn(s.nextButton, 'cursor-pointer')}
          onClick={onNextButtonClick}
          disabled={nextBtnDisabled}
        >
          <IconArrow fill={`${currentColor}`} />
        </NextButton>
      </div>
    </div>
  );
}
