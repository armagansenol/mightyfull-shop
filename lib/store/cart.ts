import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  addToCart,
  createCart,
  getCart,
  removeFromCart,
  updateCart
} from '../shopify-test';
import { Cart } from '../shopify-test/types';

interface CartState {
  cartId: string | null;
  cart: Cart | null;

  // Actions
  fetchCart: () => Promise<void>;
  createCart: () => Promise<void>;
  addToCart: (
    lines: { merchandiseId: string; quantity: number }[]
  ) => Promise<void>;
  removeFromCart: (lineIds: string[]) => Promise<void>;
  updateCart: (
    lines: { id: string; merchandiseId: string; quantity: number }[]
  ) => Promise<void>;
}

const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cartId: null,
      cart: null,

      // Fetch cart by ID
      fetchCart: async () => {
        const { cartId } = get();
        if (!cartId) return;

        try {
          const fetchedCart = await getCart(cartId);
          if (fetchedCart) {
            set({ cart: fetchedCart });
          } else {
            set({ cartId: null, cart: null });
          }
        } catch (error) {
          console.error('Error fetching cart:', error);
        }
      },

      // Create a new cart
      createCart: async () => {
        try {
          const newCart = await createCart();
          set({ cartId: newCart.id, cart: newCart });
        } catch (error) {
          console.error('Error creating cart:', error);
        }
      },

      // Add items to the cart
      addToCart: async (lines) => {
        const { cartId, createCart, fetchCart } = get();

        if (!cartId) {
          await createCart();
          const newCartId = get().cartId;

          console.log('newCartId', newCartId);

          if (newCartId) {
            await addToCart(newCartId, lines);
            await fetchCart();
          }
          return;
        }

        try {
          const updatedCart = await addToCart(cartId, lines);
          set({ cart: updatedCart });
        } catch (error) {
          console.error('Error adding to cart:', error);
          set({ cartId: null, cart: null });
          await fetchCart();
        }
      },

      // Remove items from the cart
      removeFromCart: async (lineIds: string[]) => {
        const { cartId } = get();
        if (!cartId) return;

        try {
          const updatedCart = await removeFromCart(cartId, lineIds);
          set({ cart: updatedCart });
        } catch (error) {
          console.error('Error removing from cart:', error);
        }
      },

      // Update cart items
      updateCart: async (lines) => {
        const { cartId } = get();
        if (!cartId) return;

        try {
          const updatedCart = await updateCart(cartId, lines);
          set({ cart: updatedCart });
        } catch (error) {
          console.error('Error updating cart:', error);
        }
      }
    }),
    {
      name: 'cart-storage' // Key for localStorage
    }
  )
);

export default useCartStore;
