"use client"

import s from "./product-highlight-carousel.module.scss"

import cn from "clsx"
import { EmblaOptionsType } from "embla-carousel"
import useEmblaCarousel from "embla-carousel-react"
import React, { useCallback, useEffect, useState } from "react"

import { AnimatedCard } from "@/components/animated-card"
import { IconArrow } from "@/components/icons"
import { Link } from "@/components/utility/link"
import { routes } from "@/lib/constants"
import { AnimatedCardProps } from "@/types"
import { NextButton, PrevButton, usePrevNextButtons } from "./EmblaCarouselButtons"
import { Button } from "../ui/button"

export interface ProductHighlightCarouselProps {
  items: AnimatedCardProps[]
  options?: EmblaOptionsType
}

export default function ProductHighlightCarousel({ items, options }: ProductHighlightCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel(options)
  const { prevBtnDisabled, nextBtnDisabled, onPrevButtonClick, onNextButtonClick } = usePrevNextButtons(emblaApi)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [currentTheme, setCurrentTheme] = useState<string>()

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setCurrentSlide(emblaApi.selectedScrollSnap())

    // Add any other logic you want to execute when the slide changes
    console.log("Slide changed to:", emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on("select", onSelect)
    return () => {
      emblaApi.off("select", onSelect)
    }
  }, [emblaApi, onSelect])

  useEffect(() => {
    setCurrentTheme(items[currentSlide].product.colorTheme.text.hex)
  }, [currentSlide, items])

  return (
    <div className={s.productHighlightCarousel}>
      <div className="relative">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex touch-pan-y touch-pinch-zoom">
            {items.map((item, i) => {
              return (
                <div className={cn(s.slide, "flex flex-col items-center justify-between gap-6")} key={i}>
                  <Link className={s.card} href={`/${routes.shop.url}/${item.product.shopifySlug}`} prefetch={true}>
                    <AnimatedCard {...item} />
                  </Link>
                  <div
                    className="flex flex-row tablet:flex-col items-stretch gap-2"
                    style={{ "--text-color": `${items[i].product.colorTheme.text.hex}` } as React.CSSProperties}
                  >
                    <Button asChild variant="highlighted" size="sm" padding="slim">
                      <Link href={`/${routes.shop.url}/${item.product.shopifySlug}`} prefetch={true}>
                        SHOP NOW
                      </Link>
                    </Button>
                    <Button variant="default" size="sm" padding="slim">
                      ADD TO CART
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
          <PrevButton
            className={cn(s.prevButton, "cursor-pointer")}
            onClick={onPrevButtonClick}
            disabled={prevBtnDisabled}
          >
            <IconArrow fill={`${currentTheme}`} rotate={180} />
          </PrevButton>
          <NextButton
            className={cn(s.nextButton, "cursor-pointer")}
            onClick={onNextButtonClick}
            disabled={nextBtnDisabled}
          >
            <IconArrow fill={`${currentTheme}`} />
          </NextButton>
        </div>
      </div>
    </div>
  )
}
