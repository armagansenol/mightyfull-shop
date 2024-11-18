"use client"

import s from "./product-highlight-carousel.module.scss"

import cn from "clsx"
import { EmblaOptionsType } from "embla-carousel"
import useEmblaCarousel from "embla-carousel-react"

import { IconArrow } from "@/components/icons"
import { Link } from "@/components/utility/link"
import { AnimatedCardProps } from "@/types"
import { AnimatedCard } from "../animated-card"
import { NextButton, PrevButton, usePrevNextButtons } from "./EmblaCarouselButtons"
import { useCallback, useEffect, useState } from "react"
import { routes } from "@/lib/constants"

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
            {items.map((item) => {
              return (
                <div className={cn(s.slide, "flex flex-col items-center gap-6")} key={item.id}>
                  <Link className={s.card} href={`/${routes.shop.url}/${item.product.shopifySlug}`} prefetch={true}>
                    <AnimatedCard {...item} />
                  </Link>
                  <div className="flex flex-col items-stretch space-y-3">
                    <Link
                      href={`/${routes.shop.url}/${item.product.shopifySlug}`}
                      className={cn(s.button, "cursor-pointer flex items-center justify-center")}
                      prefetch={true}
                    >
                      <span>SHOP NOW</span>
                    </Link>
                    <button className={cn(s.button, "cursor-pointer flex items-center justify-center")}>
                      <span>ADD TO CART</span>
                    </button>
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
