"use client"

import s from "./embla.module.scss"

import cn from "clsx"
import { EmblaOptionsType } from "embla-carousel"
import Fade from "embla-carousel-fade"
import useEmblaCarousel from "embla-carousel-react"
import React, { ReactNode } from "react"
import { IconArrow } from "../icons"
import { NextButton, PrevButton, usePrevNextButtons } from "./EmblaCarouselButtons"

type PropType = {
  children: ReactNode | ReactNode[]
  options?: EmblaOptionsType
}

export default function FadeInOutCarousel({ children, options }: PropType) {
  const [emblaRef, emblaApi] = useEmblaCarousel(options, [Fade()])
  const slides = React.Children.toArray(children)
  const { prevBtnDisabled, nextBtnDisabled, onPrevButtonClick, onNextButtonClick } = usePrevNextButtons(emblaApi)

  return (
    <div className="relative">
      <div className={`${s.embla}`}>
        <div className={`${s.emblaViewport}`} ref={emblaRef}>
          <div className={`${s.emblaContainer}`}>
            {slides.map((slide, index) => (
              <div className={`${s.emblaSlide}`} key={index}>
                {slide}
              </div>
            ))}
          </div>
        </div>
      </div>
      <PrevButton className={cn(s.prevButton, "cursor-pointer")} onClick={onPrevButtonClick} disabled={prevBtnDisabled}>
        <IconArrow fill="var(--blue-ruin)" rotate={180} />
      </PrevButton>
      <NextButton className={cn(s.nextButton, "cursor-pointer")} onClick={onNextButtonClick} disabled={nextBtnDisabled}>
        <IconArrow fill="var(--blue-ruin)" />
      </NextButton>
    </div>
  )
}
