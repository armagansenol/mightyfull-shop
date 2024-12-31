'use client';

import s from './product-highlight-carousel.module.scss';

import { cn } from '@/lib/utils';
import { EmblaOptionsType } from 'embla-carousel';
import useEmblaCarousel from 'embla-carousel-react';
import React, { useCallback, useEffect, useState } from 'react';

import { CustomizedPortableText } from '@/components/customized-portable-text';
import { IconArrow } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Img } from '@/components/utility/img';
import { Link } from '@/components/utility/link';
import { routes } from '@/lib/constants';
import { AnimatedCardProps } from '@/types';
import {
  NextButton,
  PrevButton,
  usePrevNextButtons
} from './EmblaCarouselButtons';

export interface ProductHighlightCarouselProps {
  items: AnimatedCardProps[];
  options?: EmblaOptionsType;
}

export default function ProductHighlightCarousel({
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
  const [currentTheme, setCurrentTheme] = useState<string>();

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCurrentSlide(emblaApi.selectedScrollSnap());

    // Add any other logic you want to execute when the slide changes
    // console.log("Slide changed to:", emblaApi.selectedScrollSnap())
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    setCurrentTheme(items[currentSlide].product.colorTheme.text.hex);
  }, [currentSlide, items]);

  return (
    <div className={s.productHighlightCarousel}>
      <div className="relative">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex touch-pan-y touch-pinch-zoom">
            {items.map((item, i) => {
              return (
                <div
                  className={cn(
                    s.slide,
                    'flex flex-col items-center justify-between gap-6'
                  )}
                  key={i}
                >
                  <div
                    className={cn(s.cardC, 'space-y-5', {
                      [s.active]: i === currentSlide
                    })}
                  >
                    <Link
                      className={s.card}
                      href={`/${routes.shop.url}/${item.product.shopifySlug}`}
                      prefetch={true}
                    >
                      <div className={s.imgC}>
                        <Img
                          className="object-contain"
                          src={item.imgPackage.url}
                          height={item.imgPackage.height}
                          width={item.imgPackage.width}
                          alt="Picture of a Cookie Package"
                        />
                      </div>
                    </Link>
                    <div className={cn(s.info, 'space-y-3')}>
                      <div
                        className={cn(s.text, 'text')}
                        style={{ color: item.product.colorTheme.text.hex }}
                      >
                        {item.displayTitle.length > 0 && (
                          <CustomizedPortableText content={item.displayTitle} />
                        )}
                      </div>
                      <div
                        className={cn(
                          s.buttons,
                          'flex flex-col items-stretch gap-2'
                        )}
                        style={
                          {
                            '--text-color': `${items[i].product.colorTheme.text.hex}`
                          } as React.CSSProperties
                        }
                      >
                        <Button
                          colorTheme="invertedThemed"
                          asChild
                          size="sm"
                          padding="slim"
                        >
                          <Link
                            href={`/${routes.shop.url}/${item.product.shopifySlug}`}
                            prefetch={true}
                          >
                            SHOP NOW
                          </Link>
                        </Button>
                        <Button colorTheme="themed" size="sm" padding="slim">
                          ADD TO CART
                        </Button>
                      </div>
                    </div>
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
            <IconArrow fill={`${currentTheme}`} rotate={180} />
          </PrevButton>
          <NextButton
            className={cn(s.nextButton, 'cursor-pointer')}
            onClick={onNextButtonClick}
            disabled={nextBtnDisabled}
          >
            <IconArrow fill={`${currentTheme}`} />
          </NextButton>
        </div>
      </div>
    </div>
  );
}
