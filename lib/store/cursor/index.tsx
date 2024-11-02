import { CursorType } from "@/types"
import { create } from "zustand"

interface State {
  type: CursorType
  visible: boolean
  toggleVisibility: () => void
  setCursor: (type: CursorType) => void
  events: any
  reset: () => void
}

const useStore = create<State>((set, get) => ({
  type: CursorType.default,
  visible: false,
  toggleVisibility: () => set({ visible: !get().visible }),
  setCursor: (type) => set({ type }),
  reset: () => {
    get().setCursor(CursorType.default)
  },
  events: {
    cursorEmail: {
      onMouseEnter: () => get().setCursor(CursorType.email),
      onMouseLeave: () => get().reset(),
    },
    cursorView: {
      onMouseEnter: () => get().setCursor(CursorType.view),
      onMouseLeave: () => get().reset(),
    },
  },
}))

export const useCursorStore = useStore
