import { useCartMutation } from './useCartMutation';
import {
  removeItem,
  incrementItemQuantity,
  decrementItemQuantity,
  updateItemSellingPlanOption
} from '@/components/cart/actions';
import type { CartItem } from '@/lib/shopify/types';

export function useDeleteCartItem(item: CartItem) {
  const merchandiseId = item.merchandise.id;
  const sellingPlanId = item.sellingPlanAllocation?.sellingPlan?.id || null;
  const productTitle = item.merchandise.product.title;

  return useCartMutation({
    mutationFn: async () => {
      return await removeItem(merchandiseId, sellingPlanId);
    },
    actionType: 'delete',
    merchandiseId,
    sellingPlanId,
    productTitle,
    successMessage: `${productTitle} removed from cart`
  });
}

export function useIncrementCartItem(item: CartItem, maxQuantity = 10) {
  const merchandiseId = item.merchandise.id;
  const sellingPlanId = item.sellingPlanAllocation?.sellingPlan?.id || null;
  const productTitle = item.merchandise.product.title;

  return useCartMutation({
    mutationFn: async () => {
      return await incrementItemQuantity(
        merchandiseId,
        maxQuantity,
        sellingPlanId
      );
    },
    actionType: 'plus',
    merchandiseId,
    sellingPlanId,
    productTitle
  });
}

export function useDecrementCartItem(item: CartItem) {
  const merchandiseId = item.merchandise.id;
  const sellingPlanId = item.sellingPlanAllocation?.sellingPlan?.id || null;
  const productTitle = item.merchandise.product.title;

  return useCartMutation({
    mutationFn: async () => {
      return await decrementItemQuantity(merchandiseId, sellingPlanId);
    },
    actionType: 'minus',
    merchandiseId,
    sellingPlanId,
    productTitle
  });
}

export function useUpdateSellingPlan(item: CartItem) {
  const merchandiseId = item.merchandise.id;
  const currentSellingPlanId =
    item.sellingPlanAllocation?.sellingPlan?.id || null;

  console.log('item', item);

  return useCartMutation<{
    newSellingPlanId: string | null;
    onSuccess?: () => void;
  }>({
    mutationFn: async ({ newSellingPlanId, onSuccess }) => {
      const result = await updateItemSellingPlanOption({
        merchandiseId,
        sellingPlanId: newSellingPlanId,
        currentSellingPlanId
      });

      // Call the onSuccess callback if provided and the operation was successful
      if (onSuccess && typeof result === 'object' && result.success) {
        onSuccess();
      }

      return result;
    },
    actionType: 'update-selling-plan',
    merchandiseId,
    sellingPlanId: currentSellingPlanId,
    successMessage: 'Subscription option updated'
  });
}
