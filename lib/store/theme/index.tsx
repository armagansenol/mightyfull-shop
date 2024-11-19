import { create } from "zustand"

const defaultColors = {
  primary: "var(--blue-ruin)",
  secondary: "var(--cerulean)",
  tertiary: "var(--cerulean)",
}

interface State {
  primaryColor: string
  secondaryColor: string
  tertiaryColor: string
  setColors: (primary: string, secondary: string, tertiary: string) => void
  resetColors: () => void
}

export const useStore = create<State>((set) => ({
  primaryColor: defaultColors.primary,
  secondaryColor: defaultColors.secondary,
  tertiaryColor: defaultColors.tertiary,

  setColors: (primary, secondary, tertiary) => {
    set({ primaryColor: primary, secondaryColor: secondary, tertiaryColor: tertiary })
  },
  resetColors: () => {
    set({
      primaryColor: defaultColors.primary,
      secondaryColor: defaultColors.secondary,
      tertiaryColor: defaultColors.tertiary,
    })
  },
}))

export const useTheme = useStore
