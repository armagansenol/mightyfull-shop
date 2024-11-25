"use client"

import { useTheme } from "@/lib/store/theme"
import { ReactNode } from "react"

const ThemeLayout = ({ children }: { children: ReactNode }) => {
  const { primaryColor, secondaryColor } = useTheme()

  return (
    <div
      style={
        {
          "--text-color": `${primaryColor}`,
          "--bg-color": `${secondaryColor}`,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  )
}

export { ThemeLayout }
