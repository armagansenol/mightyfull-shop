'use client';

import { AnimatePresence, motion } from 'motion/react';
import { forwardRef } from 'react';
import { IconCookieCart } from '@/components/icons';

interface CartTriggerProps {
  totalQuantity?: number;
  isInitialized: boolean;
  onClick?: () => void;
}

export const CartTrigger = forwardRef<HTMLButtonElement, CartTriggerProps>(
  ({ totalQuantity, isInitialized, onClick }, ref) => {
    const itemText = totalQuantity === 1 ? 'item' : 'items';

    return (
      <button
        ref={ref}
        aria-label={`Open shopping cart${totalQuantity ? ` with ${totalQuantity} unique ${itemText}` : ''}`}
        className="relative h-8 w-8 md:h-10 md:w-10"
        type="button"
        onClick={onClick}
      >
        <IconCookieCart fill="var(--primary)" />
        {totalQuantity && isInitialized ? (
          <AnimatePresence>
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="absolute -left-1 -bottom-1 md:-left-2 md:-bottom-2 h-5 w-5 md:h-6 md:w-6 rounded-full text-sm md:text-base font-bold text-[var(--primary)] bg-[var(--tertiary)] flex items-center justify-center"
              aria-hidden="true"
            >
              {totalQuantity}
            </motion.span>
          </AnimatePresence>
        ) : null}
      </button>
    );
  }
);

CartTrigger.displayName = 'CartTrigger';
