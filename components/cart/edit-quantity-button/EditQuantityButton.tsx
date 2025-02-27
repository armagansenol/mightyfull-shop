'use client';

import s from './edit-quantity-button.module.scss';

import cn from 'clsx';
import { useCallback, useMemo, useState } from 'react';

import type { CartItem } from '@/lib/shopify/types';
import { updateItemQuantity } from '../actions';
import { IconPlus, IconMinus } from '@/components/icons';

function SubmitButton({
  type,
  disabled
}: {
  type: 'plus' | 'minus';
  disabled?: boolean;
}) {
  return (
    <button
      type="submit"
      aria-label={
        type === 'plus' ? 'Increase item quantity' : 'Reduce item quantity'
      }
      className={cn(
        s.editQuantityButton,
        'cursor-pointer flex-shrink-0 flex items-center justify-center',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
      disabled={disabled}
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

export default function EditQuantityButton({
  item,
  type,
  optimisticUpdate
}: {
  item: CartItem;
  type: 'plus' | 'minus';
  optimisticUpdate: (merchandiseId: string, type: 'plus' | 'minus') => void;
}) {
  const [isUpdating, setIsUpdating] = useState(false);

  const payload = useMemo(
    () => ({
      merchandiseId: item.merchandise.id,
      quantity: type === 'plus' ? item.quantity + 1 : item.quantity - 1
    }),
    [item.merchandise.id, item.quantity, type]
  );

  const update = useCallback(async () => {
    try {
      setIsUpdating(true);
      const res = await updateItemQuantity(payload);
      if (typeof res === 'string') {
        console.error('Error updating quantity:', res);
        // If there's an error, we could revert the optimistic update here
        // by calling optimisticUpdate with the opposite type
      }
    } catch (error) {
      console.error('Failed to update quantity:', error);
    } finally {
      setIsUpdating(false);
    }
  }, [payload]);

  return (
    <form
      action={async () => {
        // Apply optimistic update immediately
        optimisticUpdate(payload.merchandiseId, type);
        // Then perform the actual update
        await update();
      }}
    >
      <SubmitButton type={type} disabled={isUpdating} />
    </form>
  );
}
