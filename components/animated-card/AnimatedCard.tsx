"use client"

import s from "./animated-card.module.scss"

import cx from "clsx"
import gsap from "gsap"
import ScrollTrigger from "gsap/dist/ScrollTrigger"
import { useRef } from "react"
import { useGSAP } from "@gsap/react"

import { AnimatedCardProps } from "@/types"
import { Img } from "@/components/utility/img"
import { CustomizedPortableText } from "../customized-portable-text"

export default function AnimatedCard(props: AnimatedCardProps) {
  const ref = useRef(null)
  const tl = useRef<gsap.core.Timeline | null>(null)

  const { contextSafe } = useGSAP(
    () => {
      if (ScrollTrigger.isTouch) return

      const duration = 1

      tl.current = gsap
        .timeline({ paused: true })
        .to(
          ".package",
          {
            yPercent: -100,
            duration,
            ease: "back.inOut(1.7)",
          },
          "s"
        )
        .to(
          ".cookie",
          {
            yPercent: -100,
            duration,
            delay: 0.4,
            ease: "back.out(1.7)",
          },
          "s"
        )
        .to(
          ".bg",
          {
            backgroundColor: props.product.colorTheme.background.hex,
          },
          "s"
        )
        .to(
          ".text",
          {
            scale: 1,
            y: 0,
            duration,
            ease: "back.inOut(1.7)",
          },
          "s"
        )
        .to(
          ".img-cookie",
          {
            scale: 1,
            duration,
          },
          "s"
        )
    },
    { scope: ref }
  )

  const mouseIn = contextSafe(() => {
    if (ScrollTrigger.isTouch) return
    tl.current?.play()
  })
  const mouseOut = contextSafe(() => {
    if (ScrollTrigger.isTouch) return
    tl.current?.reverse()
  })

  return (
    <div ref={ref} className={cx(s.animatedCard, "animated-card")} onMouseEnter={mouseIn} onMouseLeave={mouseOut}>
      <div className={cx(s.bg, "bg")}></div>
      <div className={cx(s.package, "package", "flex flex-col items-center justify-center")}>
        <div className={s.imgC}>
          <Img
            className="object-contain"
            src={props.imgPackage.url}
            height={props.imgPackage.height}
            width={props.imgPackage.width}
            alt="Picture of a Cookie Package"
            priority
          />
        </div>
      </div>
      <div className={cx(s.cookie, "cookie", "flex flex-col items-center")}>
        <div className={cx(s.text, "text")} style={{ color: props.product.colorTheme.text.hex }}>
          {props.displayTitle.length > 0 && <CustomizedPortableText content={props.displayTitle} />}
        </div>
        <div className={cx(s.imgC, "img-cookie")}>
          <Img
            className="object-contain"
            src={props.imgCookie.url}
            height={props.imgCookie.height}
            width={props.imgCookie.width}
            alt="Picture of a Cookie"
          />
        </div>
      </div>
    </div>
  )
}
