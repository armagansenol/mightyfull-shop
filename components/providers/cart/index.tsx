'use client';

import React, { useCallback, useMemo, useReducer } from 'react';
import {
  CartContext,
  cartReducer,
  createEmptyCart
} from '@/components/cart/cart-context';

import { Cart, Product, ProductVariant } from '@/lib/shopify/types';
import { CartUpdateType } from '@/types';

export function CartProvider({
  children,
  cartPromise
}: {
  children: React.ReactNode;
  cartPromise: Promise<Cart | undefined>;
}) {
  const [cart, dispatch] = useReducer(cartReducer, createEmptyCart());

  React.useEffect(() => {
    cartPromise.then((initialCart) => {
      dispatch({ type: 'SET_INITIAL_CART', payload: initialCart });
    });
  }, [cartPromise]);

  const updateCartItem = useCallback(
    (
      merchandiseId: string,
      updateType: CartUpdateType,
      sellingPlanId?: string | null
    ) => {
      dispatch({
        type: 'UPDATE_ITEM',
        payload: { merchandiseId, updateType, sellingPlanId }
      });
    },
    [dispatch]
  );

  const addCartItem = useCallback(
    (variant: ProductVariant, product: Product) => {
      dispatch({ type: 'ADD_ITEM', payload: { variant, product } });
    },
    [dispatch]
  );

  const updateCartItemSellingPlan = useCallback(
    (merchandiseId: string, sellingPlanId: string | null) => {
      // Get the current selling plan ID for this item
      const currentSellingPlanId =
        cart?.lines.find((line) => line.merchandise.id === merchandiseId)
          ?.sellingPlanAllocation?.sellingPlan?.id || null;

      dispatch({
        type: 'UPDATE_SELLING_PLAN',
        payload: { merchandiseId, sellingPlanId, currentSellingPlanId }
      });
    },
    [cart, dispatch]
  );

  const value = useMemo(
    () => ({
      cart,
      updateCartItem,
      addCartItem,
      updateCartItemSellingPlan
    }),
    [cart, updateCartItem, addCartItem, updateCartItemSellingPlan]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
