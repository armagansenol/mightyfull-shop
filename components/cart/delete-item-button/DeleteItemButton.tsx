'use client';

import s from './delete-item-button.module.scss';

import { useCallback } from 'react';

import type { CartItem } from '@/lib/shopify/types';
import { removeItem } from '../actions';

export default function DeleteItemButton({
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
        className={s.deleteItemButton}
      >
        Remove
      </button>
    </form>
  );
}
