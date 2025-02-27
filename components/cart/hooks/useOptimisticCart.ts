'use client';

import { useState, useEffect, useCallback } from 'react';
import { addItem, removeItem, updateItemQuantity } from '../actions';
import { useRouter } from 'next/navigation';

// Define types for our cart items
type OptimisticCartItem = {
  merchandiseId: string;
  quantity: number;
  title: string;
  price?: number;
  currencyCode?: string;
  image?: string;
  sellingPlanId?: string;
};

export function useOptimisticCart() {
  // Store the optimistic cart state
  const [optimisticCart, setOptimisticCart] = useState<OptimisticCartItem[]>(
    []
  );
  // Track pending operations for potential rollback
  const [pendingOperations, setPendingOperations] = useState<
    {
      type: 'add' | 'remove' | 'update';
      item: OptimisticCartItem;
      previousState?: OptimisticCartItem[];
    }[]
  >([]);
  const router = useRouter();

  // Load initial cart state from localStorage on client side
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('optimisticCart');
      if (savedCart) {
        setOptimisticCart(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('optimisticCart', JSON.stringify(optimisticCart));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [optimisticCart]);

  // Add item to cart optimistically
  const addToCartOptimistically = useCallback(
    async (item: OptimisticCartItem) => {
      // Save previous state for potential rollback
      const previousState = [...optimisticCart];

      // Update optimistic state immediately
      setOptimisticCart((prevCart) => {
        // Check if item already exists in cart
        const existingItemIndex = prevCart.findIndex(
          (cartItem) => cartItem.merchandiseId === item.merchandiseId
        );

        if (existingItemIndex >= 0) {
          // Update existing item
          const updatedCart = [...prevCart];
          updatedCart[existingItemIndex] = {
            ...updatedCart[existingItemIndex],
            quantity: updatedCart[existingItemIndex].quantity + item.quantity
          };
          return updatedCart;
        } else {
          // Add new item
          return [...prevCart, item];
        }
      });

      // Add to pending operations
      setPendingOperations((prev) => [
        ...prev,
        { type: 'add', item, previousState }
      ]);

      // Refresh the UI to show updated cart count
      router.refresh();

      try {
        // Perform actual server operation
        const result = await addItem(
          item.merchandiseId,
          item.quantity,
          item.sellingPlanId
        );

        // If server operation failed, revert optimistic update
        if (typeof result === 'string') {
          console.error('Server operation failed:', result);
          setOptimisticCart(previousState);
          router.refresh();
        }

        // Remove from pending operations
        setPendingOperations((prev) =>
          prev.filter((op) => op.item.merchandiseId !== item.merchandiseId)
        );
      } catch (error) {
        console.error('Error adding item to cart:', error);
        // Revert optimistic update on error
        setOptimisticCart(previousState);
        router.refresh();
      }
    },
    [optimisticCart, router]
  );

  // Remove item from cart optimistically
  const removeFromCartOptimistically = useCallback(
    async (merchandiseId: string) => {
      // Save previous state for potential rollback
      const previousState = [...optimisticCart];

      // Update optimistic state immediately
      setOptimisticCart((prevCart) =>
        prevCart.filter((item) => item.merchandiseId !== merchandiseId)
      );

      // Find the item being removed
      const removedItem = previousState.find(
        (item) => item.merchandiseId === merchandiseId
      );

      if (!removedItem) return;

      // Add to pending operations
      setPendingOperations((prev) => [
        ...prev,
        { type: 'remove', item: removedItem, previousState }
      ]);

      // Refresh the UI
      router.refresh();

      try {
        // Perform actual server operation
        const result = await removeItem(merchandiseId);

        // If server operation failed, revert optimistic update
        if (typeof result === 'string') {
          console.error('Server operation failed:', result);
          setOptimisticCart(previousState);
          router.refresh();
        }

        // Remove from pending operations
        setPendingOperations((prev) =>
          prev.filter((op) => op.item.merchandiseId !== merchandiseId)
        );
      } catch (error) {
        console.error('Error removing item from cart:', error);
        // Revert optimistic update on error
        setOptimisticCart(previousState);
        router.refresh();
      }
    },
    [optimisticCart, router]
  );

  // Update item quantity optimistically
  const updateQuantityOptimistically = useCallback(
    async (merchandiseId: string, quantity: number) => {
      // Save previous state for potential rollback
      const previousState = [...optimisticCart];

      // Update optimistic state immediately
      setOptimisticCart((prevCart) => {
        if (quantity === 0) {
          // Remove item if quantity is 0
          return prevCart.filter(
            (item) => item.merchandiseId !== merchandiseId
          );
        }

        // Otherwise update quantity
        return prevCart.map((item) =>
          item.merchandiseId === merchandiseId ? { ...item, quantity } : item
        );
      });

      // Find the item being updated
      const updatedItem = previousState.find(
        (item) => item.merchandiseId === merchandiseId
      );

      if (!updatedItem) return;

      // Add to pending operations
      setPendingOperations((prev) => [
        ...prev,
        {
          type: 'update',
          item: { ...updatedItem, quantity },
          previousState
        }
      ]);

      // Refresh the UI
      router.refresh();

      try {
        // Perform actual server operation
        const result = await updateItemQuantity({
          merchandiseId,
          quantity
        });

        // If server operation failed, revert optimistic update
        if (typeof result === 'string') {
          console.error('Server operation failed:', result);
          setOptimisticCart(previousState);
          router.refresh();
        }

        // Remove from pending operations
        setPendingOperations((prev) =>
          prev.filter(
            (op) =>
              !(op.type === 'update' && op.item.merchandiseId === merchandiseId)
          )
        );
      } catch (error) {
        console.error('Error updating item quantity:', error);
        // Revert optimistic update on error
        setOptimisticCart(previousState);
        router.refresh();
      }
    },
    [optimisticCart, router]
  );

  return {
    optimisticCart,
    addToCartOptimistically,
    removeFromCartOptimistically,
    updateQuantityOptimistically,
    pendingOperations
  };
}
