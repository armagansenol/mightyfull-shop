'use client';

import { Loader2 } from 'lucide-react';
import { useCallback } from 'react';

import { useDeleteCartItem } from '@/components/cart/hooks/useCartItemMutations';
import { CartItem } from '@/lib/shopify/types';

export function DeleteItemButton({ item }: { item: CartItem }) {
  const { mutate, isPending: isProcessing } = useDeleteCartItem(item);

  const handleRemoveItem = useCallback(() => {
    if (!isProcessing) {
      mutate({});
    }
  }, [mutate, isProcessing]);

  return (
    <button
      className="relative cursor-pointer text-sm text-blue-ruin underline hover:opacity-70 transition-opacity"
      aria-label={`Remove ${item.merchandise.product.title} from cart`}
      onClick={handleRemoveItem}
      disabled={isProcessing}
    >
      {isProcessing && (
        <span className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-[120%]">
          <Loader2 className="h-3 w-3 animate-spin text-blue-ruin" />
        </span>
      )}
      <span>Remove</span>
    </button>
  );
}
