'use client';

import { Loader2 } from 'lucide-react';
import { useCallback } from 'react';

import { useCart } from '@/components/cart/cart-context';
import { useAddToCart } from '@/components/cart/hooks/useAddToCart';
import { Button } from '@/components/ui/button';

export function AddToCart({
  buttonTheme,
  availableForSale,
  className,
  variantId,
  amount,
  currencyCode,
  quantity = 1,
  sellingPlanId
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
  const { mutate, isPending } = useAddToCart(variantId);
  const { cart, openCart } = useCart();

  const handleAddToCart = useCallback(() => {
    console.log('[cart] AddToCart click', {
      variantId,
      sellingPlanId,
      quantity,
      availableForSale,
      isPending,
      cartLines: cart?.lines?.length
    });
    if (!availableForSale) return;
    if (isPending) return;

    const isNewUniqueLine = !cart?.lines?.some(
      (line) =>
        line.merchandise.id === variantId &&
        ((sellingPlanId &&
          line.sellingPlanAllocation?.sellingPlan?.id === sellingPlanId) ||
          (!sellingPlanId && !line.sellingPlanAllocation))
    );

    mutate({ quantity, sellingPlanId });

    if (isNewUniqueLine) {
      openCart();
    }
  }, [
    availableForSale,
    isPending,
    mutate,
    quantity,
    sellingPlanId,
    cart,
    variantId,
    openCart
  ]);

  if (!availableForSale)
    return (
      <Button className={className} colorTheme={buttonTheme} size="sm" disabled>
        SOLD OUT
      </Button>
    );

  return (
    <form
      className={className}
      action={() => {
        handleAddToCart();
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
              {quantity &&
                quantity > 0 &&
                amount &&
                !Number.isNaN(Number(amount)) && (
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
