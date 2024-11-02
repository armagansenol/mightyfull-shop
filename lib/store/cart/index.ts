import { create } from "zustand"

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  purchaseType: "one-time" | "subscribe"
  deliveryInterval?: "2 Weeks" | "1 Month" | "2 Months"
}

interface CartState {
  items: CartItem[]
  addItem: (item: Omit<CartItem, "id">) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  addItem: (item) =>
    set((state) => ({
      items: [
        ...state.items,
        {
          ...item,
          id: Math.random().toString(36).substr(2, 9),
        },
      ],
    })),
  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),
  updateQuantity: (id, quantity) =>
    set((state) => ({
      items: state.items.map((item) => (item.id === id ? { ...item, quantity } : item)),
    })),
  clearCart: () => set({ items: [] }),
}))
