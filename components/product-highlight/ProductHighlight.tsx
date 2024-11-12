"use client"

import s from "./product-highlight.module.scss"

import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap"
import cn from "clsx"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Link } from "@/components/utility/link"
import { routes } from "@/lib/constants"
import { ProductHighlightQueryResult } from "@/types"
import { useRef } from "react"

export interface ProductHighlightProps {
  items: ProductHighlightQueryResult["productHighlight"]["items"]
}

export default function ProductHighlight(props: ProductHighlightProps) {
  const scopeRef = useRef(null)

  useGSAP(() => {
    function testimonials() {
      const tl = gsap.timeline({ paused: true })
      const items = document.querySelectorAll(".product-image")
      const panels = document.querySelectorAll(".panel")

      const scrollTween = gsap.to(panels, {
        xPercent: -100 * (panels.length - 1),
        ease: "none",
        scrollTrigger: {
          trigger: scopeRef.current,
          pin: true,
          scrub: 0.1,
          start: "center center",
          end: "+=6000",
          refreshPriority: 150,
        },
      })

      items.forEach((item, i) => {
        tl.fromTo(
          item,
          {
            rotation: -9,
          },
          {
            rotation: 9,
            duration: 2,
            ease: "back.inOut",
            scrollTrigger: {
              trigger: panels[i],
              containerAnimation: scrollTween,
              start: "center center",
              id: `${i}`,
              markers: true,
            },
          }
        )
      })

      gsap.set(".gsap-marker-start, .gsap-marker-end, .gsap-marker-scroller-start, .gsap-marker-scroller-end", {
        autoAlpha: 0,
      })
      ;["panel-0", "panel-1", "panel-2", "panel-3"].forEach((triggerClass, i) => {
        ScrollTrigger.create({
          trigger: "." + triggerClass,
          containerAnimation: scrollTween,
          start: "left right",
          end: i === 3 ? "right right" : "right 30%",
          markers: false,
          onToggle: (self) => gsap.to(".marker-" + (i + 1), { duration: 0.25, autoAlpha: self.isActive ? 1 : 0 }),
        })
      })
    }

    testimonials()
  })

  return (
    <div className={cn(s.productHighlight, "flex flex-col items-center justify-center")} ref={scopeRef}>
      <div className={cn(s.text, "flex flex-col items-center")}>
        <h2>Impossible to Choose Just One!</h2>
        <p>Can’t decide? Try them all and discover your new favorite!</p>
      </div>
      <div className={cn("items flex items-center flex-nowrap w-screen")}>
        {props.items.map((item, i) => {
          return (
            <div className={cn(s.panel, `panel panel-${i} flex items-center justify-center`)} key={item._id}>
              <div className="transform-c">
                <Link
                  className={cn(s.item, "rotate-c flex flex-col items-center cursor-pointer space-y-8")}
                  href={`/${routes.shop.url}/${item.slug}`}
                  prefetch={true}
                >
                  <Image
                    className="product-image"
                    src={item.image.url}
                    height={1000}
                    width={1000}
                    alt={"Product Package 3D Render"}
                  />
                  <Button variant="ghost">SHOP NOW</Button>
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
