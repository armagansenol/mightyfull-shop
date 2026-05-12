import { addItem } from '@/components/cart/actions';
import { useCartMutation } from './useCartMutation';

export function useAddToCart(variantId: string) {
  return useCartMutation<{
    quantity?: number;
    sellingPlanId?: string;
    onSuccess?: () => void;
  }>({
    mutationFn: async ({ quantity = 1, sellingPlanId, onSuccess }) => {
      console.log('[cart] useAddToCart.mutationFn: calling addItem', {
        variantId,
        quantity,
        sellingPlanId
      });
      const result = await addItem(
        variantId,
        quantity,
        sellingPlanId || undefined
      );
      console.log(
        '[cart] useAddToCart.mutationFn: addItem result',
        typeof result === 'object'
          ? {
              success: 'success' in result ? result.success : undefined,
              message: 'message' in result ? result.message : undefined,
              hasCart: 'cart' in result && Boolean(result.cart),
              lines:
                'cart' in result && result.cart
                  ? result.cart.lines?.length
                  : undefined
            }
          : result
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
