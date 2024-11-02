import { create } from "zustand"

interface PurchaseState {
  purchaseType: "one-time" | "subscribe"
  deliveryInterval: "2 Weeks" | "1 Month" | "2 Months"
  quantity: number
  setPurchaseType: (type: "one-time" | "subscribe") => void
  setDeliveryInterval: (interval: "2 Weeks" | "1 Month" | "2 Months") => void
  incrementQuantity: () => void
  decrementQuantity: () => void
}

export const usePurchaseStore = create<PurchaseState>((set) => ({
  purchaseType: "one-time",
  deliveryInterval: "2 Weeks",
  quantity: 1,
  setPurchaseType: (type) => set({ purchaseType: type }),
  setDeliveryInterval: (interval) => set({ deliveryInterval: interval }),
  incrementQuantity: () => set((state) => ({ quantity: state.quantity + 1 })),
  decrementQuantity: () => set((state) => ({ quantity: Math.max(1, state.quantity - 1) })),
}))
