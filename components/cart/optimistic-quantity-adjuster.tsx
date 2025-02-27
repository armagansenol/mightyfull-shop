'use client';

import { useState } from 'react';
import { updateItemQuantity } from './actions';
import { IconPlus, IconMinus } from '@/components/icons';
import cn from 'clsx';
import s from './edit-quantity-button/edit-quantity-button.module.scss';
import type { CartItem } from '@/lib/shopify/types';

function QuantityButton({
  type,
  disabled,
  onClick
}: {
  type: 'plus' | 'minus';
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={
        type === 'plus' ? 'Increase item quantity' : 'Reduce item quantity'
      }
      className={cn(
        s.editQuantityButton,
        'cursor-pointer flex-shrink-0 flex items-center justify-center',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
      disabled={disabled}
      onClick={onClick}
    >
      {type === 'plus' ? (
        <div className={s.icon}>
          <IconPlus fill="var(--blue-ruin)" />
        </div>
      ) : (
        <div className={s.icon}>
          <IconMinus fill="var(--blue-ruin)" />
        </div>
      )}
    </button>
  );
}

export function OptimisticQuantityAdjuster({
  item,
  updateCartItem,
  maxQuantity = 10,
  onUpdateStateChange
}: {
  item: CartItem;
  updateCartItem: (
    merchandiseId: string,
    updateType: 'plus' | 'minus' | 'delete'
  ) => void;
  maxQuantity?: number;
  onUpdateStateChange?: (isUpdating: boolean) => void;
}) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [optimisticQuantity, setOptimisticQuantity] = useState(item.quantity);

  const handleQuantityChange = async (type: 'plus' | 'minus') => {
    if (isUpdating) return;

    const newQuantity =
      type === 'plus' ? optimisticQuantity + 1 : optimisticQuantity - 1;

    // Don't allow negative quantities or quantities above max
    if (newQuantity <= 0 || newQuantity > maxQuantity) return;

    // Update local state immediately for a responsive UI
    setOptimisticQuantity(newQuantity);
    setIsUpdating(true);

    // Notify parent component about the update state
    if (onUpdateStateChange) {
      onUpdateStateChange(true);
    }

    try {
      // Apply optimistic update in the cart context
      updateCartItem(item.merchandise.id, type);

      // Perform the actual server update
      const result = await updateItemQuantity({
        merchandiseId: item.merchandise.id,
        quantity: newQuantity
      });

      if (typeof result === 'string') {
        console.error('Error updating quantity:', result);
        // Revert optimistic update if there was an error
        setOptimisticQuantity(item.quantity);
      }
    } catch (error) {
      console.error('Failed to update quantity:', error);
      // Revert optimistic update if there was an error
      setOptimisticQuantity(item.quantity);
    } finally {
      setIsUpdating(false);

      // Notify parent component about the update state
      if (onUpdateStateChange) {
        onUpdateStateChange(false);
      }
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <QuantityButton
        type="minus"
        disabled={optimisticQuantity <= 1 || isUpdating}
        onClick={() => handleQuantityChange('minus')}
      />

      <span className={cn(s.quantity, 'flex items-center justify-center')}>
        {optimisticQuantity}
      </span>

      <QuantityButton
        type="plus"
        disabled={optimisticQuantity >= maxQuantity || isUpdating}
        onClick={() => handleQuantityChange('plus')}
      />
    </div>
  );
}

export default OptimisticQuantityAdjuster;
