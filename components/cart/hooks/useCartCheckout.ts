import { useCartMutation } from './useCartMutation';
import { redirectToCheckout } from '@/components/cart/actions';

/**
 * Hook for handling cart checkout process
 */
export function useCartCheckout() {
  return useCartMutation({
    mutationFn: async () => {
      try {
        await redirectToCheckout();
        return { success: true };
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Checkout failed';
        return { success: false, message };
      }
    },
    actionType: 'delete',
    merchandiseId: 'checkout',
    successMessage: 'Redirecting to checkout...'
  });
}
