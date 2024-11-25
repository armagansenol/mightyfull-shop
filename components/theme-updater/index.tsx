"use client"

import { SanityColorTheme } from "@/types"
import { useTheme } from "lib/store/theme"
import { useEffect, useLayoutEffect } from "react"

export function ThemeUpdater(theme: SanityColorTheme) {
  const { setColors, resetColors } = useTheme()

  useLayoutEffect(() => {
    setColors(theme.text, theme.background, theme.tertiary)
    return () => resetColors()
  }, [theme, setColors, resetColors])

  useEffect(() => {
    document.body.style.setProperty(`--text-color`, theme.text)
    document.body.style.setProperty(`--bg-color`, theme.background)
    document.body.style.setProperty(`--tertiary-color`, theme.tertiary)

    return () => {
      document.body.style.removeProperty(`--text-color`)
      document.body.style.removeProperty(`--bg-color`)
      document.body.style.removeProperty(`--tertiary-color`)
    }
  }, [theme])

  return null
}
