"use client"

import { SanityColorTheme } from "@/types"
import { useTheme } from "lib/store/theme"
import { useLayoutEffect } from "react"

export function ThemeUpdater(theme: SanityColorTheme) {
  const { setColors, resetColors } = useTheme()

  useLayoutEffect(() => {
    setColors(theme.text, theme.background, theme.tertiary)
    return () => resetColors()
  }, [theme, setColors, resetColors])

  return null
}
