'use client';

import { useMemo } from 'react';
import CartItem from '@/components/cart/cart-item';
import { ScrollableBox } from '@/components/utility/scrollable-box';
import type { Cart } from '@/lib/shopify/types';
import { CartUpdateType } from '@/types';

interface CartItemsListProps {
  cart: Cart;
  updateCartItem: (
    merchandiseId: string,
    updateType: CartUpdateType,
    sellingPlanId?: string | null
  ) => void;
}

/**
 * List of cart items with sorting and scrolling
 */
export function CartItemsList({ cart, updateCartItem }: CartItemsListProps) {
  const sortedCartItems = useMemo(() => {
    return [...cart.lines].sort((a, b) => {
      return a.merchandise.product.title.localeCompare(
        b.merchandise.product.title
      );
    });
  }, [cart.lines]);

  return (
    <ScrollableBox
      wrapperClassName="flex flex-col flex-1"
      contentClassName="flex-1 py-6 space-y-10"
    >
      {sortedCartItems.map((item, i) => {
        return <CartItem key={i} item={item} updateCartItem={updateCartItem} />;
      })}
    </ScrollableBox>
  );
}
