'use client';

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
        className="relative h-8 w-8 tablet:h-10 tablet:w-10"
        type="button"
        onClick={onClick}
      >
        <IconCookieCart fill="var(--primary)" />
        {totalQuantity && isInitialized ? (
          <span
            className="absolute -left-1 -bottom-1 tablet:-left-2 tablet:-bottom-2 h-5 w-5 tablet:h-6 tablet:w-6 rounded-full text-sm tablet:text-base font-bold text-[var(--primary)] bg-[var(--secondary)] flex items-center justify-center"
            aria-hidden="true"
          >
            {totalQuantity}
          </span>
        ) : null}
      </button>
    );
  }
);

CartTrigger.displayName = 'CartTrigger';
