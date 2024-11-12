"use client"

import s from "./product-highlight-carousel.module.scss"

import cn from "clsx"
import { EmblaOptionsType } from "embla-carousel"
import useEmblaCarousel from "embla-carousel-react"

import { IconArrow } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Img } from "@/components/utility/img"
import { Link } from "@/components/utility/link"
import { routes } from "@/lib/constants"
import { ProductHighlightQueryResult } from "@/types"
import { NextButton, PrevButton, usePrevNextButtons } from "./EmblaCarouselButtons"

export interface ProductHighlightCarouselProps {
  items: ProductHighlightQueryResult["productHighlight"]["items"]
  options?: EmblaOptionsType
}

export default function ProductHighlightCarousel({ items, options }: ProductHighlightCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel(options)
  const { prevBtnDisabled, nextBtnDisabled, onPrevButtonClick, onNextButtonClick } = usePrevNextButtons(emblaApi)

  return (
    <div className={s.productHighlightSlider}>
      <div className="relative">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex touch-pan-y touch-pinch-zoom">
            {items.map((item) => {
              return (
                <Link
                  className={cn(s.slide, "flex flex-col items-center space-y-10")}
                  href={`/${routes.shop.url}/${item.slug}`}
                  prefetch={true}
                  key={item._id}
                >
                  <Img
                    className={s.imgC}
                    src={item.image.url}
                    height={item.image.height}
                    width={item.image.width}
                    alt="Product Package"
                  />
                  <Button variant="ghost">SHOP NOW</Button>
                </Link>
              )
            })}
          </div>
          <PrevButton
            className={cn(s.prevButton, "cursor-pointer")}
            onClick={onPrevButtonClick}
            disabled={prevBtnDisabled}
          >
            <IconArrow fill="var(--blue-ruin)" rotate={180} />
          </PrevButton>
          <NextButton
            className={cn(s.nextButton, "cursor-pointer")}
            onClick={onNextButtonClick}
            disabled={nextBtnDisabled}
          >
            <IconArrow fill="var(--blue-ruin)" />
          </NextButton>
        </div>
      </div>
    </div>
  )
}
