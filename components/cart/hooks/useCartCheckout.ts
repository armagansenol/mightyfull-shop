import { redirectToCheckout } from '@/components/cart/actions';
import { useCartMutation } from './useCartMutation';

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
    lineId: 'checkout',
    merchandiseId: 'checkout',
    successMessage: 'Redirecting to checkout...'
  });
}
