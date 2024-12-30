'use client';

import { updateItemQuantity } from '@/components/cart-test/actions';
import clsx from 'clsx';
import type { CartItem } from 'lib/shopify/types';
import { Minus, Plus } from 'lucide-react';
import { useCallback, useMemo } from 'react';

function SubmitButton({ type }: { type: 'plus' | 'minus' }) {
  return (
    <button
      type="submit"
      aria-label={
        type === 'plus' ? 'Increase item quantity' : 'Reduce item quantity'
      }
      className={clsx(
        'ease flex h-full min-w-[36px] max-w-[36px] flex-none items-center justify-center rounded-full p-2 transition-all duration-200 hover:border-neutral-800 hover:opacity-80',
        {
          'ml-auto': type === 'minus'
        }
      )}
    >
      {type === 'plus' ? (
        <Plus className="h-4 w-4 dark:text-neutral-500" />
      ) : (
        <Minus className="h-4 w-4 dark:text-neutral-500" />
      )}
    </button>
  );
}

export function EditItemQuantityButton({
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
