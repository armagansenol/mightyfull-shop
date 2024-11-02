import { ReactNode } from "react"
import { create } from "zustand"

interface State {
  content: ReactNode | null
  isOpen: boolean
  setIsOpen: (status: boolean) => void
  setContent: (node: ReactNode) => void
  closeModal: () => void
}

export const useStore = create<State>((set) => ({
  content: null,
  isOpen: false,
  setIsOpen: (status) => set({ isOpen: status }),
  setContent: (node) => {
    set({ content: node })
    set({ isOpen: true })
  },
  closeModal: () => {
    set({ isOpen: false })
    set({ content: null })
  },
}))

export const useModalStore = useStore
