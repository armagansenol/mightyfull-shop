'use client';

import s from './delete-item-button.module.scss';

import { Loader2 } from 'lucide-react';
import { useCallback } from 'react';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { CartItem } from '@/lib/shopify/types';
import { cn } from '@/lib/utils';
import { removeItem } from '../actions';
import { useCart } from '../cart-context';

export default function DeleteItemButton({ item }: { item: CartItem }) {
  const { updateCartItem } = useCart();
  const queryClient = useQueryClient();

  const merchandiseId = item.merchandise.id;
  const sellingPlanId = item.sellingPlanAllocation?.sellingPlan?.id || null;
  const productTitle = item.merchandise.product.title;

  // Setup the mutation
  const { mutate, isPending: isProcessing } = useMutation({
    // The mutation function that calls your server action
    mutationFn: async () => {
      return await removeItem(merchandiseId, sellingPlanId);
    },
    // What to do if the mutation is successful
    onSuccess: (result) => {
      if (result && typeof result === 'object' && 'success' in result) {
        if (result.success) {
          // Update the cart context
          updateCartItem(merchandiseId, 'delete', sellingPlanId);

          // Show success message from Shopify if available, otherwise use default
          const message = result.message || `${productTitle} removed from cart`;
          toast.success(message);

          // Invalidate any cart-related queries to trigger refetches
          queryClient.invalidateQueries({ queryKey: ['cart'] });
        } else {
          // Show error message from Shopify if available
          const errorMessage = result.message || 'Failed to remove item';
          toast.error(errorMessage);
          console.error('Error from Shopify:', errorMessage);
        }
      } else if (typeof result === 'string') {
        // If the result is a string, it's likely an error message
        toast.error(result);
        console.error('Error from Shopify:', result);
      } else {
        // Handle unexpected response format
        toast.error('Unexpected response from server');
        console.error('Unexpected response format:', result);
      }
    },
    // What to do if the mutation fails
    onError: (error) => {
      // Extract error message from the error object
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to remove item';

      // Show the error message in a toast
      toast.error(`Error removing ${productTitle}: ${errorMessage}`);
      console.error('Error removing item:', error);

      // Inform the user they may need to refresh the page
      toast.error(
        'There was an issue updating your cart. Please refresh the page.',
        {
          duration: 5000,
          action: {
            label: 'Refresh',
            onClick: () => window.location.reload()
          }
        }
      );
    }
  });

  // Simplified handler that just triggers the mutation
  const handleRemove = useCallback(() => {
    if (!isProcessing) {
      mutate();
    }
  }, [mutate, isProcessing]);

  return (
    <div className={cn({ 'opacity-75': isProcessing })}>
      <button
        type="button"
        onClick={handleRemove}
        disabled={isProcessing}
        aria-label={`Remove ${productTitle} from cart`}
        className={cn(s.deleteItemButton, 'relative')}
      >
        Remove
        {isProcessing && (
          <span className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-[120%] flex items-center justify-center">
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          </span>
        )}
      </button>
    </div>
  );
}
