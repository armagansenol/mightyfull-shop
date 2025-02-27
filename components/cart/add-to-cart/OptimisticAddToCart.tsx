'use client';

import { Button } from '@/components/ui/button';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { addItem } from '../actions';
import { BellRing, Loader2 } from 'lucide-react';
import { IconClose } from '@/components/icons';
import { useOptimisticCart } from '../hooks/useOptimisticCart';

type AddItemResponse = string | { success: boolean };

export function OptimisticAddToCart({
  availableForSale,
  variantId,
  amount,
  currencyCode,
  quantity = 1,
  sellingPlanId,
  productTitle,
  productImage
}: {
  availableForSale: boolean;
  variantId: string;
  amount?: number;
  currencyCode?: string;
  quantity?: number;
  sellingPlanId?: string;
  productTitle: string;
  productImage?: string;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const { addToCartOptimistically } = useOptimisticCart();

  const add = useCallback(async () => {
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

    setIsLoading(true);

    // Optimistically update the UI
    addToCartOptimistically({
      merchandiseId: variantId,
      quantity,
      title: productTitle,
      price: amount,
      currencyCode,
      image: productImage,
      sellingPlanId
    });

    try {
      // Perform the actual server-side update
      const res = (await addItem(
        variantId,
        quantity,
        sellingPlanId || undefined
      )) as AddItemResponse;

      if (typeof res === 'object' && res.success) {
        // Server update succeeded, no need to do anything as the cart was already updated optimistically
      } else if (typeof res === 'string') {
        // Server update failed, show error and revert optimistic update
        toast.error(res);
        // The hook will handle reverting the optimistic update
      }
    } catch (error) {
      toast.error('Failed to add item to cart. Please try again.');
      console.error('Add to cart error:', error);
      // The hook will handle reverting the optimistic update
    } finally {
      setIsLoading(false);
    }
  }, [
    availableForSale,
    quantity,
    variantId,
    sellingPlanId,
    productTitle,
    productImage,
    amount,
    currencyCode,
    addToCartOptimistically
  ]);

  return (
    <form
      className="w-64 tablet:w-auto h-12 tablet:h-full tablet:col-span-8"
      action={async () => {
        await add();
      }}
    >
      <Button
        colorTheme="invertedThemed"
        padding="slim"
        size="sm"
        type="submit"
        className="gap-1"
        disabled={isLoading || !availableForSale}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> ADDING...
          </>
        ) : (
          <>
            ADD TO CART{' '}
            <span>
              {quantity && quantity > 0 && amount && (
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

export default OptimisticAddToCart;
