import { toast } from 'sonner';
import { addItem } from '@/components/cart/actions';
import { useCartMutation } from './useCartMutation';

export function useAddToCart(variantId: string, productTitle: string) {
  return useCartMutation<{
    quantity?: number;
    sellingPlanId?: string;
    onSuccess?: () => void;
  }>({
    mutationFn: async ({ quantity = 1, sellingPlanId, onSuccess }) => {
      const result = await addItem(
        variantId,
        quantity,
        sellingPlanId || undefined
      );

      if (onSuccess && typeof result === 'object' && result.success) {
        onSuccess();
      }

      return result;
    },
    actionType: 'plus',
    merchandiseId: variantId,
    sellingPlanId: undefined,
    productTitle,
    successMessage: `${productTitle} added to cart`,
    onError: (error: Error) => {
      toast.error(`Failed to add ${productTitle} to cart: ${error.message}`);
    }
  });
}
