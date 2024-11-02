import Lenis from "lenis"
import { create } from "zustand"

interface State {
  lenis?: Lenis | null
  setLenis: (instance: Lenis | null) => void
  isStopped: boolean
  setIsStopped: (status: boolean) => void
  reset: boolean
  setReset: (val: boolean) => void
}

export const useStore = create<State>((set) => ({
  lenis: null,
  isStopped: false,
  reset: false,
  setLenis: (instance) => set({ lenis: instance }),
  setIsStopped: (status) => set({ isStopped: status }),
  setReset: (val) => set({ reset: val }),
}))

export const useLenisStore = useStore
