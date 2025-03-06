'use client';

import { Button } from '@/components/ui/button';
import { useCallback, useState, useTransition } from 'react';
import { toast } from 'sonner';
import { addItem } from '../actions';
import { BellRing, Loader2 } from 'lucide-react';
import { IconClose } from '@/components/icons';

// import clsx from 'clsx';
// import { useProduct } from 'components/product/product-context';
// import { Product, ProductVariant } from '@/lib/shopify/types';
// import { Plus } from 'lucide-react';
// import { useCallback } from 'react';
// import { useCart } from '../cart-context';
// import { addItem } from '../actions';

// function SubmitButton({
//   availableForSale,
//   selectedVariantId
// }: {
//   availableForSale: boolean;
//   selectedVariantId: string | undefined;
// }) {
//   const buttonClasses =
//     'relative flex w-full items-center justify-center rounded-full bg-blue-600 p-4 tracking-wide text-white';
//   const disabledClasses = 'cursor-not-allowed opacity-60 hover:opacity-60';

//   if (!availableForSale) {
//     return (
//       <button disabled className={clsx(buttonClasses, disabledClasses)}>
//         Out Of Stock
//       </button>
//     );
//   }

//   console.log(selectedVariantId);
//   if (!selectedVariantId) {
//     return (
//       <button
//         aria-label="Please select an option"
//         disabled
//         className={clsx(buttonClasses, disabledClasses)}
//       >
//         <div className="absolute left-0 ml-4">
//           <Plus className="h-5" />
//         </div>
//         Add To Cart
//       </button>
//     );
//   }

//   return (
//     <button
//       aria-label="Add to cart"
//       className={clsx(buttonClasses, {
//         'hover:opacity-90': true
//       })}
//     >
//       <div className="absolute left-0 ml-4">
//         <Plus className="h-5" />
//       </div>
//       Add To Cart
//     </button>
//   );
// }

// export default function AddToCart({ product }: { product: Product }) {
//   const { variants, availableForSale } = product;
//   const { addCartItem } = useCart();
//   const { state } = useProduct();

//   const variant = variants.find((variant: ProductVariant) =>
//     variant.selectedOptions.every(
//       (option) => option.value === state[option.name.toLowerCase()]
//     )
//   );
//   const defaultVariantId = variants.length === 1 ? variants[0]?.id : undefined;
//   const selectedVariantId = variant?.id || defaultVariantId;
//   const finalVariant = variants.find(
//     (variant) => variant.id === selectedVariantId
//   )!;

//   const add = useCallback(async () => {
//     const res = await addItem(product.variants[0].id, 1);
//     console.log('lol', res);
//   }, [product.variants]);

//   return (
//     <form
//       action={async () => {
//         addCartItem(finalVariant, product);
//         add();
//         console.log('fsjdfkljsdhflkjfh');
//       }}
//     >
//       <SubmitButton
//         availableForSale={availableForSale}
//         selectedVariantId={selectedVariantId}
//       />
//     </form>
//   );
// }

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
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(false);

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
    if (isLoading || isPending) return;

    setIsLoading(true);

    // Use server action to add item to cart
    startTransition(async () => {
      try {
        const res = (await addItem(
          variantId,
          quantity || 1,
          sellingPlanId || undefined
        )) as AddItemResponse;

        if (typeof res === 'string') {
          toast.error(res);
        }
        // Success is handled in cart-context
      } catch (error) {
        console.error('Add to cart error:', error);
        toast.error('Failed to add item to cart. Please try again.');
      } finally {
        // Set a minimum loading time to provide better feedback
        setTimeout(() => {
          setIsLoading(false);
        }, 300);
      }
    });
  }, [
    availableForSale,
    quantity,
    variantId,
    sellingPlanId,
    isLoading,
    isPending
  ]);

  return (
    <form
      className="w-64 tablet:w-auto h-12 tablet:h-full tablet:col-span-8"
      action={async () => {
        await handleAddToCart();
      }}
    >
      <Button
        colorTheme="invertedThemed"
        padding="slim"
        size="sm"
        type="submit"
        className="gap-1"
        disabled={isLoading || isPending || !availableForSale}
      >
        {isLoading || isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
          </>
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
