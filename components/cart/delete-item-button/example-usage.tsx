'use client';

import { Loader2 } from 'lucide-react';
import { useCallback } from 'react';
import { cn } from '@/lib/utils';
import type { CartItem } from '@/lib/shopify/types';
import { useDeleteCartItem } from '@/components/cart/hooks/useCartItemMutations';
import s from './delete-item-button.module.scss';

/**
 * Example of using the abstracted mutation hook for deleting a cart item
 */
export default function DeleteItemButtonWithHook({ item }: { item: CartItem }) {
  // Use our custom hook instead of directly using useMutation
  const { mutate, isPending: isProcessing } = useDeleteCartItem(item);

  // Simplified handler that just triggers the mutation
  const handleRemoveItem = useCallback(() => {
    if (!isProcessing) {
      mutate({});
    }
  }, [mutate, isProcessing]);

  return (
    <button
      aria-label={`Remove ${item.merchandise.product.title} from cart`}
      onClick={handleRemoveItem}
      className={cn(
        s.deleteButton,
        isProcessing ? s.processing : '',
        'group flex h-[17px] w-[17px] items-center justify-center rounded-full bg-neutral-200 transition-colors hover:bg-red-500'
      )}
      disabled={isProcessing}
    >
      {isProcessing ? (
        <Loader2 className="h-3 w-3 animate-spin text-white" />
      ) : (
        <svg
          className="h-[7px] w-[7px] text-neutral-500 transition-colors group-hover:text-white"
          fill="none"
          height="10"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
          width="10"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      )}
    </button>
  );
}
