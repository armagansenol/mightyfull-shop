"use client"

import s from "./animated-card.module.scss"

import cx from "clsx"

import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { useRef } from "react"
import ScrollTrigger from "gsap/dist/ScrollTrigger"
import { Img } from "components/utility/img"
import { AnimatedCardProps } from "@/types"

export default function AnimatedCard(props: AnimatedCardProps) {
  const ref = useRef(null)
  const tl = useRef<gsap.core.Timeline | null>(null)

  console.log(props.product.colorTheme.text)

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
            ease: "back.inOut",
          },
          "s"
        )
        .to(
          ".cookie",
          {
            yPercent: -100,
            duration,
            delay: 0.4,
            ease: "back.out",
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
            ease: "back.inOut",
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

  const mouseIn = contextSafe(() => tl.current?.play())
  const mouseOut = contextSafe(() => tl.current?.reverse())

  return (
    <div
      ref={ref}
      className={cx(s.animatedCard, "animated-card", "cursor-pointer")}
      onMouseEnter={mouseIn}
      onMouseLeave={mouseOut}
    >
      <div className={cx(s.bg, "bg")}></div>
      <div className={cx(s.package, "package", "flex flex-col items-center justify-center")}>
        <div className={s.imgC}>
          <Img
            className="object-contain"
            src={props.imgPackage.url}
            height={500}
            width={500}
            alt="Cookie Package"
            blurDataURL={props.imgPackage.blurDataURL}
          />
        </div>
      </div>
      <div className={cx(s.cookie, "cookie", "flex flex-col items-center")}>
        <div className={cx(s.text, "text")} style={{ color: props.product.colorTheme.text.hex }}>
          {props.product.shopifyTitle}
        </div>
        <div className={cx(s.imgC, "img-cookie")}>
          <Img className="object-contain" src={props.imgCookie.url} height={500} width={500} alt="Cookie" />
        </div>
      </div>
    </div>
  )
}
