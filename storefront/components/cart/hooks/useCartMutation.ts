import { useMutation } from '@tanstack/react-query';
import { getCart } from '@/components/cart/actions';
import { useCart } from '@/components/cart/cart-context';
import type { Cart } from '@/lib/shopify/types';

type CartActionType = 'plus' | 'minus' | 'delete' | 'update-selling-plan';
type MutationResult = { success: boolean; message?: string } | string;

interface UseCartMutationOptions<TVariables extends Record<string, unknown>> {
  mutationFn: (variables: TVariables) => Promise<MutationResult>;
  actionType: CartActionType;
  merchandiseId: string;
  sellingPlanId?: string | null;
  onSuccess?: (result: MutationResult, variables: TVariables) => void;
  onError?: (error: Error, variables: TVariables) => void;
}

export function useCartMutation<
  TVariables extends Record<string, unknown> = Record<string, never>
>({
  mutationFn,
  actionType,
  merchandiseId,
  sellingPlanId,
  onSuccess,
  onError
}: UseCartMutationOptions<TVariables>) {
  const { cart, updateCartItem, updateCartItemSellingPlan, setCart } =
    useCart();

  return useMutation({
    mutationFn,

    // Optimistic update: fire BEFORE the server call
    onMutate: async (variables) => {
      const previousCart = cart
        ? { ...cart, lines: [...cart.lines] }
        : undefined;

      // Apply optimistic update immediately
      if (
        actionType === 'update-selling-plan' &&
        'newSellingPlanId' in variables
      ) {
        updateCartItemSellingPlan(
          merchandiseId,
          variables.newSellingPlanId as string | null
        );
      } else if (actionType !== 'update-selling-plan') {
        updateCartItem(merchandiseId, actionType, sellingPlanId || null);
      }

      return { previousCart };
    },

    onSuccess: (result, variables) => {
      const isSuccess =
        result &&
        typeof result === 'object' &&
        'success' in result &&
        result.success;

      if (isSuccess && onSuccess) {
        onSuccess(result, variables);
      }
    },

    onError: (error, variables, context) => {
      // Rollback to previous cart state immediately
      if (context?.previousCart) {
        setCart(context.previousCart as Cart);
      }

      if (onError) {
        onError(error, variables);
      }
    },

    // Always sync with server after mutation settles
    onSettled: async (_result, error) => {
      try {
        const serverCart = await getCart();
        setCart(serverCart);
      } catch {
        // If sync fails after an error, the rollback from onError is still in effect
        if (error) return;
        // If sync fails after success, the optimistic state is close enough
      }
    }
  });
}
