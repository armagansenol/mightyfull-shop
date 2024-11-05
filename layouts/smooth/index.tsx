"use client"

import useSmoothScroll from "hooks/use-smooth-scroll"
import { ReactNode } from "react"

const SmoothLayout = ({ children }: { children: ReactNode }) => {
  useSmoothScroll()
  return <>{children}</>
}

export { SmoothLayout }
