'use client';

import { AnimatePresence, motion } from 'motion/react';
import CartItem from '@/components/cart/cart-item';
import { ScrollableBox } from '@/components/utility/scrollable-box';
import type { Cart } from '@/lib/shopify/types';
import type { CartUpdateType } from '@/types';

interface CartItemsListProps {
  cart: Cart;
  updateCartItem: (
    merchandiseId: string,
    updateType: CartUpdateType,
    sellingPlanId?: string | null
  ) => void;
}

export function CartItemsList({ cart, updateCartItem }: CartItemsListProps) {
  return (
    <ScrollableBox
      wrapperClassName="flex flex-col flex-1"
      contentClassName="flex-1 py-6 space-y-10"
      showScrollbar
    >
      <AnimatePresence initial={false}>
        {cart.lines.map((item) => (
          <motion.div
            key={item.id}
            layout="position"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
          >
            <CartItem item={item} updateCartItem={updateCartItem} />
          </motion.div>
        ))}
      </AnimatePresence>
    </ScrollableBox>
  );
}
