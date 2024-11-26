"use client"

import s from "./product-highlight.module.scss"

import { gsap, useGSAP } from "@/lib/gsap"
import cn from "clsx"
import Image from "next/image"
import { useRef } from "react"

import { Button } from "@/components/ui/button"
import { Link } from "@/components/utility/link"
import { routes } from "@/lib/constants"
import { ProductHighlightQueryResult } from "@/types"

export interface ProductHighlightProps {
  items: ProductHighlightQueryResult["productHighlight"]["items"]
}

export default function ProductHighlight(props: ProductHighlightProps) {
  const scopeRef = useRef(null)

  useGSAP(
    () => {
      function testimonials() {
        const panels = document.querySelectorAll(".panel")
        const items = document.querySelectorAll(".product-image")

        const scrollTween = gsap.to(panels, {
          xPercent: -100 * (panels.length - 1),
          ease: "none",
          scrollTrigger: {
            trigger: scopeRef.current,
            pin: true,
            scrub: 0.1,
            end: "+=3000",
            refreshPriority: 150,
            // onLeave: () => {
            //   gsap.to(".bg", {
            //     backgroundColor: "var(--sugar-milk)",
            //     duration: 0.4,
            //   })
            //   gsap.to(".text", {
            //     color: "var(--blue-ruin)",
            //     duration: 0.4,
            //   })
            // },
            // onLeaveBack: () => {
            //   gsap.to(".bg", {
            //     backgroundColor: "var(--sugar-milk)",
            //     duration: 0.4,
            //   })
            //   gsap.to(".text", {
            //     color: "var(--blue-ruin)",
            //     duration: 0.4,
            //   })
            // },
          },
        })

        items.forEach((item, i) => {
          gsap.from(item, {
            rotation: 3,
            scale: 0.8,
            duration: 1,
            ease: "back.out",
            scrollTrigger: {
              trigger: panels[i],
              containerAnimation: scrollTween,
              start: "center center",
              toggleActions: "play none none reverse",
              id: `${i}`,
              markers: true,
              // onEnter: () => {
              //   gsap.to(".bg", {
              //     backgroundColor: props.items[i].colorTheme.background,
              //     duration: 0.4,
              //   })
              //   gsap.to(".text", {
              //     color: props.items[i].colorTheme.text,
              //     duration: 0.4,
              //   })
              // },
            },
          })
        })
      }
      testimonials()
    },
    { dependencies: [props.items], revertOnUpdate: true }
  )

  return (
    <div className={cn(s.productHighlight, `bg flex flex-col items-center justify-center`)} ref={scopeRef}>
      <div className={cn(s.text, "flex flex-col items-center")}>
        <h2 className="text">Impossible to Choose Just One!</h2>
        <p className="text">Can’t decide? Try them all and discover your new favorite!</p>
      </div>
      <div className={cn("items flex items-center flex-nowrap w-screen")}>
        {props.items.map((item, i) => {
          return (
            <div
              className={cn(s.panel, `panel panel-${i} flex items-center justify-center`)}
              key={item._id}
              style={
                {
                  "--text-color": `${item.colorTheme?.text}`,
                  "--bg-color": `${item.colorTheme?.background}`,
                } as React.CSSProperties
              }
            >
              <div className="transform-c">
                <Link
                  className={cn(s.item, "rotate-c flex flex-col items-center cursor-pointer space-y-10")}
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
                  <Button
                    style={{
                      border: "1px solid var(--text-color)",
                      color: "var(--text-color)",
                      backgroundColor: "var(--bg-color)",
                    }}
                  >
                    SHOP NOW
                  </Button>
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
