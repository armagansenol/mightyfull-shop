'use client';

import { IconClose } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { BellRing, Loader2 } from 'lucide-react';
import { useCallback } from 'react';
import { toast } from 'sonner';
import { useAddToCart } from '../hooks/useAddToCart';

export function AddToCart({
  buttonTheme,
  availableForSale,
  className,
  variantId,
  amount,
  currencyCode,
  quantity = 1,
  sellingPlanId,
  productTitle = 'Item'
}: {
  buttonTheme?: 'inverted-blue-ruin' | 'inverted-themed';
  className?: string;
  availableForSale: boolean;
  variantId: string;
  productTitle?: string;
  amount?: number;
  currencyCode?: string;
  quantity?: number;
  sellingPlanId?: string;
}) {
  // Use the new hook instead of direct mutation
  const { mutate, isPending } = useAddToCart(variantId, productTitle);

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
    if (isPending) return;

    // Execute the mutation using the hook
    mutate({ quantity, sellingPlanId });
  }, [availableForSale, isPending, mutate, quantity, sellingPlanId]);

  if (!availableForSale)
    return (
      <Button className={className} colorTheme={buttonTheme} size="sm" disabled>
        OUT OF STOCK
      </Button>
    );

  return (
    <form
      className={className}
      action={async () => {
        await handleAddToCart();
      }}
    >
      <Button
        colorTheme={buttonTheme}
        size="sm"
        type="submit"
        disabled={isPending}
      >
        {isPending ? (
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
