import { addItem } from '@/components/cart/actions';
import { useCartMutation } from './useCartMutation';

export function useAddToCart(variantId: string) {
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
    sellingPlanId: undefined
  });
}
