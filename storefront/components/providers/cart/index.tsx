'use client';

import React, { useCallback, useMemo, useReducer } from 'react';
import {
  CartContext,
  cartReducer,
  createEmptyCart
} from '@/components/cart/cart-context';

import type { Cart, Product, ProductVariant } from '@/lib/shopify/types';
import type { CartUpdateType } from '@/types';

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
    []
  );

  const addCartItem = useCallback(
    (variant: ProductVariant, product: Product) => {
      dispatch({ type: 'ADD_ITEM', payload: { variant, product } });
    },
    []
  );

  const updateCartItemSellingPlan = useCallback(
    (merchandiseId: string, sellingPlanId: string | null) => {
      const currentSellingPlanId =
        cart?.lines.find((line) => line.merchandise.id === merchandiseId)
          ?.sellingPlanAllocation?.sellingPlan?.id || null;

      dispatch({
        type: 'UPDATE_SELLING_PLAN',
        payload: { merchandiseId, sellingPlanId, currentSellingPlanId }
      });
    },
    [cart]
  );

  const setCart = useCallback((newCart: Cart | undefined) => {
    dispatch({ type: 'SET_INITIAL_CART', payload: newCart });
  }, []);

  const value = useMemo(
    () => ({
      cart,
      updateCartItem,
      addCartItem,
      updateCartItemSellingPlan,
      setCart
    }),
    [cart, updateCartItem, addCartItem, updateCartItemSellingPlan, setCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
