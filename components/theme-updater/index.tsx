"use client"

import { SanityColorTheme } from "lib/context/theme"
import { useTheme } from "lib/store/theme"
import { useLayoutEffect } from "react"

export function ThemeUpdater(theme: SanityColorTheme) {
  const { setColors, resetColors } = useTheme()

  useLayoutEffect(() => {
    setColors(theme.text, theme.background)
    return () => resetColors()
  }, [theme, setColors, resetColors])

  return null
}
