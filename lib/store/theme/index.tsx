import { create } from "zustand"

const defaultColors = {
  primary: "var(--blue-ruin)",
  secondary: "var(--cerulean)",
}

interface State {
  primaryColor: string
  secondaryColor: string
  setColors: (primary: string, secondary: string) => void
  resetColors: () => void
}

export const useStore = create<State>((set) => ({
  primaryColor: defaultColors.primary,
  secondaryColor: defaultColors.secondary,
  setColors: (primary, secondary) => {
    set({ primaryColor: primary, secondaryColor: secondary })
  },
  resetColors: () => {
    set({ primaryColor: defaultColors.primary, secondaryColor: defaultColors.secondary })
  },
}))

export const useTheme = useStore
