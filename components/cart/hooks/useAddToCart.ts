import { useCartMutation } from './useCartMutation';
import { addItem } from '@/components/cart/actions';

/**
 * Hook for adding an item to the cart
 * @param variantId The ID of the product variant to add
 * @param productTitle The title of the product (for notifications)
 */
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

      // Call the onSuccess callback if provided and the operation was successful
      if (onSuccess && typeof result === 'object' && result.success) {
        onSuccess();
      }

      return result;
    },
    actionType: 'plus', // Using 'plus' since we're adding to the cart
    merchandiseId: variantId,
    sellingPlanId: undefined, // Changed from null to undefined
    productTitle,
    successMessage: `${productTitle} added to cart`
  });
}
