'use client';

import React, { useCallback, useMemo, useReducer, useState } from 'react';
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
  const [isCartOpen, setCartOpen] = useState(false);
  const openCart = useCallback(() => setCartOpen(true), []);
  const closeCart = useCallback(() => setCartOpen(false), []);

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
    console.log('[cart] CartProvider.setCart called', {
      hasCart: !!newCart,
      id: newCart?.id,
      lines: newCart?.lines?.length,
      totalQuantity: newCart?.totalQuantity,
      firstLine: newCart?.lines?.[0]
        ? {
            id: newCart.lines[0].id,
            quantity: newCart.lines[0].quantity,
            merchandiseId: newCart.lines[0].merchandise?.id,
            hasProduct: !!newCart.lines[0].merchandise?.product
          }
        : null
    });
    dispatch({ type: 'SET_INITIAL_CART', payload: newCart });
  }, []);

  React.useEffect(() => {
    console.log('[cart] CartProvider state change', {
      hasCart: !!cart,
      id: cart?.id,
      lines: cart?.lines?.length,
      totalQuantity: cart?.totalQuantity
    });
  }, [cart]);

  const value = useMemo(
    () => ({
      cart,
      updateCartItem,
      addCartItem,
      updateCartItemSellingPlan,
      setCart,
      isCartOpen,
      setCartOpen,
      openCart,
      closeCart
    }),
    [
      cart,
      updateCartItem,
      addCartItem,
      updateCartItemSellingPlan,
      setCart,
      isCartOpen,
      openCart,
      closeCart
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
