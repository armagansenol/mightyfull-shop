import { CartItemData } from "@/types"

import { create } from "zustand"

interface CartStore {
  items: CartItemData[]
  isOpen: boolean
  addItem: (item: CartItemData) => void
  removeItem: (gid: string) => void
  updateQuantity: (gid: string, quantity: number) => void
  setIsOpen: (isOpen: boolean) => void
  clearCart: () => void
}

export const useCartStore = create<CartStore>((set) => ({
  items: [],
  isOpen: false,
  addItem: (newItem) =>
    set((state) => {
      const existingItem = state.items.find((item) => item.id === newItem.id)
      // If the item already exists, update its quantity
      if (existingItem) {
        return {
          items: state.items.map((item) =>
            item.id === newItem.id ? { ...item, quantity: item.quantity + newItem.quantity } : item
          ),
        }
      }
      // Otherwise, add the new item
      return {
        items: [...state.items, newItem],
      }
    }),
  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),
  updateQuantity: (gid, quantity) =>
    set((state) => ({
      items: state.items.map((item) => (item.id === gid ? { ...item, quantity: Math.max(1, quantity) } : item)),
    })),
  increaseQuantity: (gid: string) =>
    set((state) => ({
      items: state.items.map((item) => (item.id === gid ? { ...item, quantity: item.quantity + 1 } : item)),
    })),
  decreaseQuantity: (gid: string) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === gid ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item
      ),
    })),
  setIsOpen: (isOpen) => set({ isOpen }),
  clearCart: () => set({ items: [] }),
}))
