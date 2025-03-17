'use client';

import { AnimatePresence, motion, useIsPresent } from 'motion/react';

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
  const isPresent = useIsPresent();

  const animations = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { type: 'spring', stiffness: 900, damping: 80 }
  };

  const reversedCartLines = [...cart.lines].reverse();

  return (
    <ScrollableBox
      wrapperClassName="flex flex-col flex-1"
      contentClassName="flex-1 py-6 space-y-10"
    >
      <AnimatePresence>
        {reversedCartLines.map((item) => {
          return (
            <motion.div
              {...animations}
              key={item.id}
              layout
              style={{
                position: isPresent ? 'static' : 'absolute'
              }}
            >
              <CartItem item={item} updateCartItem={updateCartItem} />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </ScrollableBox>
  );
}
