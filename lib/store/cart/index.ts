import { CartItemData } from "@/types"

import { create } from "zustand"

interface CartStore {
  items: CartItemData[]
  isOpen: boolean
  addItem: (item: CartItemData) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  setIsOpen: (isOpen: boolean) => void
  clearCart: () => void
}

export const useCartStore = create<CartStore>((set) => ({
  items: [
    // {
    //   id: "gid://shopify/Product/8519377223832",
    //   quantity: 1,
    // },
    // {
    //   id: "gid://shopify/Product/8518330613912",
    //   quantity: 1,
    // },
  ],
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
  updateQuantity: (id, quantity) =>
    set((state) => ({
      items: state.items.map((item) => (item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item)),
    })),
  increaseQuantity: (id: string) =>
    set((state) => ({
      items: state.items.map((item) => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item)),
    })),
  decreaseQuantity: (id: string) =>
    set((state) => ({
      items: state.items.map((item) => (item.id === id ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item)),
    })),
  setIsOpen: (isOpen) => set({ isOpen }),
  clearCart: () => set({ items: [] }),
}))
