"use client"

import useSmoothScroll from "hooks/use-smooth-scroll"
import { ReactNode } from "react"

type Props = {
  children: ReactNode
}

const SmoothLayout = ({ children }: Props) => {
  useSmoothScroll()

  return <>{children}</>
}

export { SmoothLayout }
