"use client"

import s from "./package-animation.module.scss"

import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap"
import cn from "clsx"

import { Img } from "@/components/utility/img"

export default function PackageAnimation() {
  const triggerClass = "gsap-scrolltrigger-c"

  useGSAP(() => {
    const tl = gsap.timeline({
      paused: true,
    })

    tl.from(
      ".package",
      {
        yPercent: -30,
        scale: 1.1,
      },
      "s"
    )
      .from(
        ".cookie",
        {
          yPercent: 50,
          scale: 0.9,
        },
        "s"
      )
      .from(
        ".cookie-slow",
        {
          yPercent: 30,
          scale: 0.8,
        },
        "s"
      )

    ScrollTrigger.create({
      animation: tl,
      trigger: `.${triggerClass}`,
      markers: false,
      scrub: true,
    })
  })

  return (
    <div className={cn(s.packageAnimation, triggerClass, "w-full grid grid-cols-3 items-center justify-items-center	")}>
      <div className={cn(s.animatedCard, "-rotate-6")}>
        <div className={cn(s.package, "package")}>
          <Img
            className="object-contain"
            src={"/img/p-pb-choco-oatie.png"}
            alt="Cookie Package"
            width={1000}
            height={1000}
          />
        </div>
        <div className={cn(s.cookie, "cookie-slow")}>
          <Img className="object-contain" src={"/img/c-pb-choco-oatie.png"} alt="Cookie" width={1000} height={1000} />
        </div>
      </div>
      <div className={cn(s.animatedCard, "z-10")}>
        <div className={cn(s.package, "package")}>
          <Img
            className="object-contain"
            src={"/img/p-choco-chip-with-shadow.png"}
            alt="Cookie Package"
            width={1000}
            height={1000}
          />
        </div>
        <div className={cn(s.cookie, "cookie")}>
          <Img
            className="object-contain"
            src={"/img/c-pb-jelly-choco-chip.png"}
            alt="Cookie"
            width={1000}
            height={1000}
          />
        </div>
      </div>
      <div className={cn(s.animatedCard, "rotate-6")}>
        <div className={cn(s.package, "package")}>
          <Img
            className="object-contain"
            src={"/img/p-double-choco-chip.png"}
            alt="Cookie Package"
            width={1000}
            height={1000}
          />
        </div>
        <div className={cn(s.cookie, "cookie-slow")}>
          <Img
            className="object-contain"
            src={"/img/c-double-choco-chip.png"}
            alt="Cookie"
            width={1000}
            height={1000}
          />
        </div>
      </div>
    </div>
  )
}
