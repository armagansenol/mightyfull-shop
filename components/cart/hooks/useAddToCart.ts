import { addItem } from '@/components/cart/actions';
import { toast } from 'sonner';
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

      // Call the onSuccess callback if provided and the operation was successful
      if (onSuccess && typeof result === 'object' && result.success) {
        onSuccess();
      }

      return result;
    },
    actionType: 'plus', // Using 'plus' since we're adding to the cart
    lineId: '', // Adding an empty lineId as we're adding a new item
    merchandiseId: variantId,
    sellingPlanId: undefined, // Changed from null to undefined
    productTitle,
    successMessage: `${productTitle} added to cart`,
    // Add error handling for toast display
    onError: (error: Error) => {
      // Display error toast
      toast.error(`Failed to add ${productTitle} to cart: ${error.message}`);
      return error.message;
    }
  });
}
