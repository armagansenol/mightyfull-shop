'use client';

import { Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useCallback } from 'react';

import { IconMinus, IconPlus } from '@/components/icons';
import type { CartItem } from '@/lib/shopify/types';
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
  maxQuantity = 100,
  availableStock
}: {
  item: CartItem;
  maxQuantity?: number;
  availableStock?: number;
}) {
  const productTitle = item.merchandise.product.title;
  const effectiveMax =
    typeof availableStock === 'number'
      ? Math.min(maxQuantity, availableStock)
      : maxQuantity;
  const isDisabled = item.quantity >= effectiveMax;
  const { mutate, isPending: isLoading } = useIncrementCartItem(
    item,
    effectiveMax
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
  maxQuantity = 100,
  availableStock
}: {
  item: CartItem;
  maxQuantity?: number;
  availableStock?: number;
}) {
  const atStockLimit =
    typeof availableStock === 'number' && item.quantity >= availableStock;

  return (
    <div className="flex flex-col gap-1" aria-live="polite">
      <div className="flex items-center space-x-2 border border-blue-ruin rounded-lg">
        <DecrementButton item={item} />
        <span className="w-6 text-center font-poppins font-bold text-lg text-blue-ruin leading-none">
          <motion.span
            key={item.quantity}
            initial={{ scale: 1.15 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
            className="inline-block"
          >
            {item.quantity}
          </motion.span>
        </span>
        <IncrementButton
          item={item}
          maxQuantity={maxQuantity}
          availableStock={availableStock}
        />
      </div>
      {atStockLimit && availableStock !== undefined && (
        <span
          role="status"
          className="text-[11px] font-poppins font-medium text-blue-ruin/60 tracking-wide leading-none"
        >
          Max in stock: {availableStock}
        </span>
      )}
    </div>
  );
}
