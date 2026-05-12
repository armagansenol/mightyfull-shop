import { useMutation } from '@tanstack/react-query';
import { getCart } from '@/components/cart/actions';
import { useCart } from '@/components/cart/cart-context';
import type { Cart } from '@/lib/shopify/types';

type CartActionType = 'plus' | 'minus' | 'delete' | 'update-selling-plan';
type MutationResult =
  | { success: boolean; message?: string; cart?: Cart }
  | string;

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
      console.log('[cart] useCartMutation.onMutate', {
        actionType,
        merchandiseId,
        previousLines: cart?.lines?.length
      });
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

      console.log('[cart] useCartMutation.onSuccess', {
        actionType,
        isSuccess,
        result:
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
      });

      // If the server returned the updated cart in the same response, apply
      // it directly. This avoids a follow-up getCart() round-trip whose
      // result depends on the newly-set cartId cookie having been applied
      // to the next request — a timing window we want to skip entirely.
      if (
        isSuccess &&
        result &&
        typeof result === 'object' &&
        'cart' in result &&
        result.cart
      ) {
        console.log('[cart] useCartMutation.onSuccess: setCart from result');
        setCart(result.cart);
      }

      if (isSuccess && onSuccess) {
        onSuccess(result, variables);
      }
    },

    onError: (error, variables, context) => {
      console.log('[cart] useCartMutation.onError', {
        actionType,
        message: error instanceof Error ? error.message : String(error)
      });
      // Rollback to previous cart state immediately
      if (context?.previousCart) {
        setCart(context.previousCart as Cart);
      }

      if (onError) {
        onError(error, variables);
      }
    },

    // Fallback: sync with server after settling, in case the mutation didn't
    // return a cart directly (e.g. some actions only return success: true).
    onSettled: async (result, error) => {
      const hasCart =
        result &&
        typeof result === 'object' &&
        'cart' in result &&
        Boolean(result.cart);
      console.log('[cart] useCartMutation.onSettled', {
        actionType,
        hasError: !!error,
        hasCartInResult: hasCart
      });
      if (hasCart) return;
      try {
        const serverCart = await getCart();
        console.log('[cart] useCartMutation.onSettled: getCart fallback', {
          present: !!serverCart,
          lines: serverCart?.lines?.length
        });
        setCart(serverCart);
      } catch (e) {
        console.log('[cart] useCartMutation.onSettled: getCart threw', e);
        if (error) return;
      }
    }
  });
}
