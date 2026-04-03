import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getCart } from '@/components/cart/actions';
import { useCart } from '@/components/cart/cart-context';
import { test } from '@/components/custom-toast/success';
import type { Cart } from '@/lib/shopify/types';

type CartActionType = 'plus' | 'minus' | 'delete' | 'update-selling-plan';
type MutationResult = { success: boolean; message?: string } | string;

interface UseCartMutationOptions<TVariables extends Record<string, unknown>> {
  mutationFn: (variables: TVariables) => Promise<MutationResult>;
  actionType: CartActionType;
  merchandiseId: string;
  sellingPlanId?: string | null;
  productTitle?: string;
  successMessage?: string;
  errorMessage?: string;
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
  productTitle = 'Item',
  successMessage,
  errorMessage,
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

      if (isSuccess) {
        const message =
          (typeof result === 'object' && 'message' in result
            ? result.message
            : undefined) ||
          successMessage ||
          `${productTitle} updated successfully`;
        test(message);

        if (onSuccess) {
          onSuccess(result, variables);
        }
      } else {
        // Server returned a failure — rollback will happen in onSettled via sync
        const message =
          (typeof result === 'object' && 'message' in result
            ? result.message
            : undefined) ||
          (typeof result === 'string' ? result : undefined) ||
          errorMessage ||
          `Failed to update ${productTitle}`;
        toast.error(message);
      }
    },

    onError: (error, variables, context) => {
      // Rollback to previous cart state immediately
      if (context?.previousCart) {
        setCart(context.previousCart as Cart);
      }

      if (onError) {
        onError(error, variables);
        return;
      }

      const message =
        error instanceof Error
          ? error.message
          : errorMessage || `Failed to update ${productTitle}`;

      toast.error(`Error updating ${productTitle}: ${message}`);
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
