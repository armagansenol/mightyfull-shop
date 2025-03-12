'use client';

import NumberFlow from '@number-flow/react';
import { Loader2 } from 'lucide-react';
import { useCallback } from 'react';

import { IconMinus, IconPlus } from '@/components/icons';
import { CartItem } from '@/lib/shopify/types';
import {
  useDecrementCartItem,
  useIncrementCartItem
} from '../hooks/useCartItemMutations';

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
      className={`cursor-pointer h-10 w-10 flex items-center justify-center`}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin text-blue-ruin" />
      ) : type === 'plus' ? (
        <span className="w-1/2 h-1/2 flex items-center justify-center">
          <IconPlus fill="var(--blue-ruin)" />
        </span>
      ) : (
        <span className="w-1/2 h-1/2 flex items-center justify-center">
          <IconMinus fill="var(--blue-ruin)" />
        </span>
      )}
    </button>
  );
}

export function IncrementButton({
  item,
  maxQuantity = 100
}: {
  item: CartItem;
  maxQuantity?: number;
}) {
  const productTitle = item.merchandise.product.title;
  const isDisabled = item.quantity >= maxQuantity;
  const { mutate, isPending: isLoading } = useIncrementCartItem(
    item,
    maxQuantity
  );

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

export function DecrementButton({ item }: { item: CartItem }) {
  const productTitle = item.merchandise.product.title;
  const isDisabled = item.quantity <= 1;
  const { mutate, isPending: isLoading } = useDecrementCartItem(item);

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

export function QuantityControl({
  item,
  maxQuantity = 10
}: {
  item: CartItem;
  maxQuantity?: number;
}) {
  return (
    <div
      className="flex items-center space-x-2 border border-blue-ruin rounded-lg"
      aria-live="polite"
    >
      <DecrementButton item={item} />
      <span className="w-6 text-center font-poppins font-bold text-lg text-blue-ruin leading-none">
        <NumberFlow value={item.quantity} />
      </span>
      <IncrementButton item={item} maxQuantity={maxQuantity} />
    </div>
  );
}
