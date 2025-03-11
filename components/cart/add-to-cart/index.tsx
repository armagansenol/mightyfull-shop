'use client';

import { IconClose } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { BellRing, Loader2 } from 'lucide-react';
import { useCallback } from 'react';
import { toast } from 'sonner';
import { addItem } from '../actions';

type AddItemResponse = string | { success: boolean };

export function AddToCart({
  availableForSale,
  variantId,
  amount,
  currencyCode,
  quantity,
  sellingPlanId
}: {
  availableForSale: boolean;
  variantId: string;
  amount?: number;
  currencyCode?: string;
  quantity?: number;
  sellingPlanId?: string;
}) {
  // Replace useTransition with useMutation
  const addToCartMutation = useMutation({
    mutationFn: async () => {
      return (await addItem(
        variantId,
        quantity || 1,
        sellingPlanId || undefined
      )) as AddItemResponse;
    },
    onError: (error) => {
      console.error('Add to cart error:', error);
      toast.error('Failed to add item to cart. Please try again.');
    },
    onSuccess: (res) => {
      if (typeof res === 'string') {
        toast.error(res);
      }
      // Success is handled in cart-context
    }
  });

  const handleAddToCart = useCallback(() => {
    if (!availableForSale) {
      return toast.error(
        <>
          <div
            className="absolute top-2 right-2 w-4 h-4 cursor-pointer"
            onClick={() => toast.dismiss()}
          >
            <IconClose fill="var(--blue-ruin)" />
          </div>
          <div className="flex flex-col gap-2 relative">
            <div>This product is currently out of stock.</div>
            <div>Please check back soon.</div>
            <button className="flex gap-4">
              <span>
                <BellRing />
              </span>
              <span>NOTIFY ME WHEN BACK IN STOCK</span>
            </button>
          </div>
        </>
      );
    }

    // Prevent multiple clicks while processing
    if (addToCartMutation.isPending) return;

    // Execute the mutation
    addToCartMutation.mutate();
  }, [availableForSale, addToCartMutation]);

  if (!availableForSale)
    return (
      <Button
        className="w-full"
        colorTheme="inverted-blue-ruin"
        size="sm"
        disabled
      >
        OUT OF STOCK
      </Button>
    );

  return (
    <form
      className="w-full flex"
      action={async () => {
        await handleAddToCart();
      }}
    >
      <Button
        className="w-full"
        colorTheme="inverted-blue-ruin"
        size="sm"
        type="submit"
        disabled={addToCartMutation.isPending}
      >
        {addToCartMutation.isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            ADD TO CART{' '}
            <span>
              {quantity && quantity > 0 && amount && !isNaN(Number(amount)) && (
                <>
                  ({(Number(amount) * quantity).toFixed(2)} {currencyCode})
                </>
              )}
            </span>
          </>
        )}
      </Button>
    </form>
  );
}
