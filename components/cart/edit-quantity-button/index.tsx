'use client';

import React from 'react';
import { Loader2, MinusIcon, PlusIcon } from 'lucide-react';
import { useCallback } from 'react';

import type { CartItem } from '../../../lib/shopify/types';
import {
  useIncrementCartItem,
  useDecrementCartItem
} from '../hooks/useCartItemMutations';

// Simple quantity button component
export function QuantityButton({
  type,
  disabled,
  isLoading,
  onClick,
  ariaLabel
}: {
  type: 'plus' | 'minus';
  disabled?: boolean;
  isLoading?: boolean;
  onClick: () => void;
  ariaLabel: string;
}) {
  return (
    <button
      aria-label={ariaLabel}
      onClick={onClick}
      className={`flex h-8 w-8 items-center justify-center rounded-full border ${
        disabled ? 'cursor-not-allowed opacity-50' : 'hover:bg-neutral-100'
      }`}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : type === 'plus' ? (
        <PlusIcon className="h-4 w-4" />
      ) : (
        <MinusIcon className="h-4 w-4" />
      )}
    </button>
  );
}

/**
 * Increment button component using the useIncrementCartItem hook
 */
export function IncrementButton({
  item,
  maxQuantity = 10
}: {
  item: CartItem;
  maxQuantity?: number;
}) {
  const productTitle = item.merchandise.product.title;

  // Check if the button should be disabled based on quantity limits
  const isDisabled = item.quantity >= maxQuantity;

  // Use the increment cart item hook without optimistic updates
  const { mutate, isPending: isLoading } = useIncrementCartItem(
    item,
    maxQuantity
  );

  // Handler for the button click
  const handleIncrement = useCallback(() => {
    if (!isLoading && !isDisabled) {
      mutate({});
    }
  }, [mutate, isLoading, isDisabled]);

  return (
    <QuantityButton
      type="plus"
      disabled={isDisabled}
      isLoading={isLoading}
      onClick={handleIncrement}
      ariaLabel={`Increase ${productTitle} quantity to ${item.quantity + 1}`}
    />
  );
}

/**
 * Decrement button component using the useDecrementCartItem hook
 */
export function DecrementButton({ item }: { item: CartItem }) {
  const productTitle = item.merchandise.product.title;

  // Check if the button should be disabled based on quantity limits
  const isDisabled = item.quantity <= 1;

  // Use the decrement cart item hook without optimistic updates
  const { mutate, isPending: isLoading } = useDecrementCartItem(item);

  // Handler for the button click
  const handleDecrement = useCallback(() => {
    if (!isLoading && !isDisabled) {
      mutate({});
    }
  }, [mutate, isLoading, isDisabled]);

  return (
    <QuantityButton
      type="minus"
      disabled={isDisabled}
      isLoading={isLoading}
      onClick={handleDecrement}
      ariaLabel={`Decrease ${productTitle} quantity to ${item.quantity - 1}`}
    />
  );
}

/**
 * Quantity control component that combines increment and decrement buttons
 */
export function QuantityControl({
  item,
  maxQuantity = 10
}: {
  item: CartItem;
  maxQuantity?: number;
}) {
  return (
    <div className="flex items-center space-x-2" aria-live="polite">
      <DecrementButton item={item} />

      <span className="w-8 text-center">{item.quantity}</span>

      <IncrementButton item={item} maxQuantity={maxQuantity} />
    </div>
  );
}
