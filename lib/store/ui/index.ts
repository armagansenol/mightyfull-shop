import { create } from "zustand"

interface State {
  resetAnimatedLogo: boolean
  setResetAnimatedLogo: (status: boolean) => void
}

export const useStore = create<State>((set) => ({
  resetAnimatedLogo: false,
  setResetAnimatedLogo: (status) => set({ resetAnimatedLogo: status }),
}))

export const useUiStore = useStore
