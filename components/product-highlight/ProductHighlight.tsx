"use client"

import s from "./product-highlight.module.scss"

import cn from "clsx"
import Image from "next/image"

import { Link } from "@/components/utility/link"
import { ProductHighlightQueryResult } from "@/types"
import { useGSAP } from "@gsap/react"
import { gsap, ScrollTrigger } from "@/lib/gsap"

export interface ProductHighlightProps {
  items: ProductHighlightQueryResult["productHighlight"]["items"]
}

export default function ProductHighlight(props: ProductHighlightProps) {
  useGSAP(() => {
    function testimonials() {
      const tl = gsap.timeline({ paused: true })
      const items: HTMLElement[] = gsap.utils.toArray(".transform-c")

      items.forEach((item, index) => {
        const delay = index * 1

        if (index > 0) {
          tl.from(
            item,
            {
              xPercent: 150,
              duration: 1,
              delay,
            },
            "s"
          ).from(
            item.querySelector(".rotate-c"),
            {
              duration: 1,
              delay,
              rotate: () => gsap.utils.random(-8, 8),
            },
            "s"
          )

          //   .to(
          //     item,
          //     {
          //       xPercent: xPercentOffset,
          //       duration: totalDuration,
          //       delay,
          //       rotate: () => gsap.utils.random(-8, 8),
          //     },
          //     "s"
          //   )
        }
      })

      ScrollTrigger.create({
        animation: tl,
        trigger: ".items-pin-c",
        pin: true,
        scrub: true,
        start: "center center",
        end: `bottom+=${1000 * items.length}px bottom`,
        markers: true,
      })
    }

    testimonials()
  })

  return (
    <section className={cn(s.productHighlight, "flex flex-col items-center justify-center space-x-40 items-pin-c")}>
      <div className={cn(s.text, "flex flex-col items-center")}>
        <h2>Impossible to Choose Just One!</h2>
        <p>Can’t decide? Try them all and discover your new favorite!</p>
      </div>
      <div className={cn(s.items, "items flex items-center")}>
        {props.items.map((item) => {
          return (
            <div className="transform-c" key={item._id}>
              <Link
                className={cn(s.item, "rotate-c flex flex-col items-center cursor-pointer space-y-8")}
                href={`/shop/${item.slug}`}
                prefetch={true}
              >
                <Image src={item.image.url} height={1000} width={1000} alt={"Product Package 3D Render"} />
                <button className={cn(s.button, "flex items-center justify-center")} type="button">
                  SHOP NOW
                </button>
              </Link>
            </div>
          )
        })}
      </div>
    </section>
  )
}
