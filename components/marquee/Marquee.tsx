"use client"

import s from "./marquee.module.scss"

import { useIntersectionObserver } from "@uidotdev/usehooks"
import cn from "clsx"
import { ReactElement } from "react"

type Props = {
  children: ReactElement
  repeat?: number
  duration?: number
  offset?: number
  inverted?: boolean
  className?: string
  animationStart?: boolean
  reset?: boolean
}

const Marquee = ({
  children,
  repeat = 2,
  duration = 20,
  offset = 0,
  inverted = false,
  className,
  animationStart = true,
  reset = false,
  ...props
}: Props) => {
  const [ref, intersection] = useIntersectionObserver({
    threshold: 0,
    root: null,
    rootMargin: "0px",
  })

  return (
    <div
      ref={ref}
      className={cn(
        className,
        s.marquee,
        inverted && s.inverted,
        intersection?.isIntersecting && "running",
        reset && s.reset
      )}
      style={
        {
          "--duration": duration + "s",
          "--offset": (offset % 100) + "%",
          "--animation-status": intersection?.isIntersecting && animationStart ? "running" : "paused",
        } as React.CSSProperties
      }
      {...props}
    >
      {new Array(repeat).fill(children).map((_, i) => (
        <div key={i} className={s.inner}>
          {children}
        </div>
      ))}
    </div>
  )
}

export default Marquee
