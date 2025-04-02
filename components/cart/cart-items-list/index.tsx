'use client';

import CartItem from '@/components/cart/cart-item';
import { ScrollableBox } from '@/components/utility/scrollable-box';
import { Cart } from '@/lib/shopify/types';
import { CartUpdateType } from '@/types';

interface CartItemsListProps {
  cart: Cart;
  updateCartItem: (
    merchandiseId: string,
    updateType: CartUpdateType,
    sellingPlanId?: string | null
  ) => void;
}

export function CartItemsList({ cart, updateCartItem }: CartItemsListProps) {
  const reversedCartLines = [...cart.lines].reverse();

  return (
    <ScrollableBox
      wrapperClassName="flex flex-col flex-1"
      contentClassName="flex-1 py-6 space-y-10"
    >
      {reversedCartLines.map((item) => (
        <div key={item.id}>
          <CartItem item={item} updateCartItem={updateCartItem} />
        </div>
      ))}
    </ScrollableBox>
  );
}
