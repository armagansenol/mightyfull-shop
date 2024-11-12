import { CartItem } from "@/types"
import { create } from "zustand"

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  setIsOpen: (isOpen: boolean) => void
  clearCart: () => void
}

export const useCartStore = create<CartStore>((set) => ({
  items: [
    {
      id: "1",
      name: "Chocolate Chip",
      price: 12.99,
      image: "/img/p-choco-chip.png",
      quantity: 1,
      subscriptionOffer: {
        text: "Upgrade to Subscription and Save 10%",
        discount: 0.1,
      },
    },
    {
      id: "2",
      name: "P&B Jelly Chocolate Chip",
      price: 11.79,
      originalPrice: 12.99,
      image: "/img/p-choco-chip.png",
      quantity: 1,
      deliveryOffer: {
        text: "Deliver Every 2 Weeks, 10% off",
        discount: 0.1,
      },
    },
    {
      id: "3",
      name: "Chocolate Chip",
      price: 12.99,
      image: "/img/p-choco-chip.png",
      quantity: 1,
      subscriptionOffer: {
        text: "Upgrade to Subscription and Save 10%",
        discount: 0.1,
      },
    },
    {
      id: "4",
      name: "P&B Jelly Chocolate Chip",
      price: 11.79,
      originalPrice: 12.99,
      image: "/img/p-choco-chip.png",
      quantity: 1,
      deliveryOffer: {
        text: "Deliver Every 2 Weeks, 10% off",
        discount: 0.1,
      },
    },
  ],
  isOpen: false,
  addItem: (item) =>
    set((state) => ({
      items: [...state.items, item],
    })),
  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),
  updateQuantity: (id, quantity) =>
    set((state) => ({
      items: state.items.map((item) => (item.id === id ? { ...item, quantity: Math.max(0, quantity) } : item)),
    })),
  setIsOpen: (isOpen) => set({ isOpen }),
  clearCart: () => set({ items: [] }),
}))
