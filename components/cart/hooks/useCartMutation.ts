import { useCart } from '@/components/cart/cart-context';
import { test } from '@/components/custom-toast/success';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
type CartActionType = 'plus' | 'minus' | 'delete' | 'update-selling-plan';
type MutationResult = { success: boolean; message?: string } | string;

interface UseCartMutationOptions<TVariables extends Record<string, unknown>> {
  // The function that performs the actual mutation
  mutationFn: (variables: TVariables) => Promise<MutationResult>;

  // The action type to perform on success
  actionType: CartActionType;

  // The merchandise ID to update
  merchandiseId: string;

  // Optional selling plan ID
  sellingPlanId?: string | null;

  // Product title for error messages
  productTitle?: string;

  // Custom success message
  successMessage?: string;

  // Custom error message
  errorMessage?: string;

  // Optional callback for success
  onSuccess?: (result: MutationResult, variables: TVariables) => void;

  // Optional callback for error
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
  const { updateCartItem, updateCartItemSellingPlan } = useCart();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,

    // Default success handler with customization options
    onSuccess: (result, variables) => {
      if (result && typeof result === 'object' && 'success' in result) {
        if (result.success) {
          // Update the cart context
          if (
            actionType === 'update-selling-plan' &&
            'newSellingPlanId' in variables
          ) {
            updateCartItemSellingPlan(
              merchandiseId,
              variables.newSellingPlanId as string | null
            );
          } else {
            updateCartItem(
              merchandiseId,
              actionType as 'plus' | 'minus' | 'delete',
              sellingPlanId || null
            );
          }

          // Show success message
          const message =
            result.message ||
            successMessage ||
            `${productTitle} updated successfully`;

          test(message);

          // Invalidate cart queries
          queryClient.invalidateQueries({ queryKey: ['cart'] });

          // Call custom onSuccess if provided
          if (onSuccess) {
            onSuccess(result, variables);
          }
        } else {
          // Show error message
          const message =
            result.message ||
            errorMessage ||
            `Failed to update ${productTitle}`;
          toast.error(message);
          console.error('Error from Shopify:', result.message);
        }
      } else if (typeof result === 'string') {
        // Handle string error results
        toast.error(result);
        console.error('Error from Shopify:', result);
      } else {
        // Handle unexpected response format
        toast.error('Unexpected response from server');
        console.error('Unexpected response format:', result);
      }
    },

    // Default error handler with customization options
    onError:
      onError ||
      ((error) => {
        // Extract error message
        const message =
          error instanceof Error
            ? error.message
            : errorMessage || `Failed to update ${productTitle}`;

        // Show error toast
        toast.error(`Error updating ${productTitle}: ${message}`);
        console.error('Error updating cart:', error);

        // Suggest page refresh for persistent errors
        toast.error(
          'There was an issue updating your cart. Please refresh the page.',
          {
            duration: 5000,
            action: {
              label: 'Refresh',
              onClick: () => window.location.reload()
            }
          }
        );
      })
  });
}
