import { SanityColorTheme } from "@/types"
import { createContext, useContext } from "react"

const ColorThemeContext = createContext<SanityColorTheme | null | undefined>(null)
export const ColorTheme = ColorThemeContext.Provider

/**
 * Returns the applied color theme, comprising background and text colors
 */
export const useColorTheme = () => useContext(ColorThemeContext)
