'use client';

import { ShoppingCartIcon } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import type { Cart } from '@/lib/shopify/types';
import type { CartUpdateType } from '@/types';
import { CartFooter } from '../cart-footer';
import { CartItemsList } from '../cart-items-list';

interface CartContentProps {
  cart: Cart | undefined;
  updateCartItem: (
    merchandiseId: string,
    updateType: CartUpdateType,
    sellingPlanId?: string | null
  ) => void;
  isCheckoutPending: boolean;
  onCheckout: (event: React.FormEvent<HTMLFormElement>) => void;
  onContinueShopping: () => void;
}

/**
 * Empty cart state component
 */
function EmptyCart() {
  return (
    <div
      className="w-full h-full mt-20 text-blue-ruin flex flex-col items-center justify-center gap-y-4"
      aria-label="Empty shopping cart"
    >
      <ShoppingCartIcon className="h-14 w-14" />
      <p className="mt-6 font-bomstad-display text-center text-3xl font-bold">
        Your cart is empty
      </p>
    </div>
  );
}

/**
 * Cart content component that shows either empty cart or cart items with footer
 */
export function CartContent({
  cart,
  updateCartItem,
  isCheckoutPending,
  onCheckout,
  onContinueShopping
}: CartContentProps) {
  console.log('[cart] CartContent render', {
    hasCart: !!cart,
    lines: cart?.lines?.length,
    isEmpty: !cart || cart.lines.length === 0
  });
  return (
    <AnimatePresence mode="wait">
      {!cart || cart.lines.length === 0 ? (
        <motion.div
          key="empty-cart"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <EmptyCart />
        </motion.div>
      ) : (
        <motion.div
          key="filled-cart"
          className="flex flex-col flex-1 gap-y-4 h-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <CartItemsList cart={cart} updateCartItem={updateCartItem} />
          <CartFooter
            cart={cart}
            isCheckoutPending={isCheckoutPending}
            onCheckout={onCheckout}
            onContinueShopping={onContinueShopping}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
