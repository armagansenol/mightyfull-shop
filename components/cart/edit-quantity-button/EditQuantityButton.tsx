'use client';

import s from './edit-quantity-button.module.scss';

import cn from 'clsx';
import { useCallback, useMemo } from 'react';

import type { CartItem } from '@/lib/shopify/types';
import { updateItemQuantity } from '../actions';
import { IconPlus, IconMinus } from '@/components/icons';

function SubmitButton({ type }: { type: 'plus' | 'minus' }) {
  return (
    <button
      type="submit"
      aria-label={
        type === 'plus' ? 'Increase item quantity' : 'Reduce item quantity'
      }
      className={cn(
        s.editQuantityButton,
        'flex-shrink-0 flex items-center justify-center'
      )}
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
  const payload = useMemo(
    () => ({
      merchandiseId: item.merchandise.id,
      quantity: type === 'plus' ? item.quantity + 1 : item.quantity - 1
    }),
    [item.merchandise.id, item.quantity, type]
  );

  const update = useCallback(async () => {
    const res = await updateItemQuantity(payload);
    console.log('lol', res);
  }, [payload]);

  return (
    <form
      action={async () => {
        optimisticUpdate(payload.merchandiseId, type);
        await update();
      }}
    >
      <SubmitButton type={type} />
    </form>
  );
}
