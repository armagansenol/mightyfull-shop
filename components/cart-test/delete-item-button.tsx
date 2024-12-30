'use client';

import { removeItem } from '@/components/cart-test/actions';
import type { CartItem } from 'lib/shopify/types';
import { X } from 'lucide-react';
import { useCallback } from 'react';

export function DeleteItemButton({
  item,
  optimisticUpdate
}: {
  item: CartItem;
  optimisticUpdate: (merchandiseId: string, type: 'delete') => void;
}) {
  const merchandiseId = item.merchandise.id;

  const remove = useCallback(async () => {
    const res = await removeItem(merchandiseId);
    console.log('lol', res);
  }, [merchandiseId]);

  return (
    <form
      action={async () => {
        optimisticUpdate(merchandiseId, 'delete');
        remove();
      }}
    >
      <button
        type="submit"
        aria-label="Remove cart item"
        className="flex h-[24px] w-[24px] items-center justify-center rounded-full bg-neutral-500"
      >
        <X className="mx-[1px] h-4 w-4 text-white dark:text-black" />
      </button>
    </form>
  );
}
