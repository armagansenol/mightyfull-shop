import { useCartMutation } from './useCartMutation';
import {
  removeItem,
  incrementItemQuantity,
  decrementItemQuantity,
  updateItemSellingPlanOption
} from '@/components/cart/actions';
import type { CartItem } from '@/lib/shopify/types';

export function useDeleteCartItem(item: CartItem) {
  const lineId = item.id!;
  const merchandiseId = item.merchandise.id;
  const sellingPlanId = item.sellingPlanAllocation?.sellingPlan?.id || null;
  const productTitle = item.merchandise.product.title;

  return useCartMutation({
    mutationFn: async () => {
      return removeItem(lineId);
    },
    actionType: 'delete',
    lineId,
    merchandiseId,
    sellingPlanId,
    productTitle,
    successMessage: `${productTitle} removed from cart`
  });
}

export function useIncrementCartItem(item: CartItem, maxQuantity = 10) {
  const lineId = item.id!;
  const merchandiseId = item.merchandise.id;
  const sellingPlanId = item.sellingPlanAllocation?.sellingPlan?.id || null;
  const productTitle = item.merchandise.product.title;

  return useCartMutation({
    mutationFn: async () => {
      return incrementItemQuantity(lineId, maxQuantity);
    },
    actionType: 'plus',
    lineId,
    merchandiseId,
    sellingPlanId,
    productTitle
  });
}

export function useDecrementCartItem(item: CartItem) {
  const lineId = item.id!;
  const merchandiseId = item.merchandise.id;
  const sellingPlanId = item.sellingPlanAllocation?.sellingPlan?.id || null;
  const productTitle = item.merchandise.product.title;

  return useCartMutation({
    mutationFn: async () => {
      return decrementItemQuantity(lineId);
    },
    actionType: 'minus',
    lineId,
    merchandiseId,
    sellingPlanId,
    productTitle
  });
}

export function useUpdateSellingPlan(item: CartItem) {
  const lineId = item.id!;
  const currentSellingPlanId =
    item.sellingPlanAllocation?.sellingPlan?.id || null;

  return useCartMutation<{
    newSellingPlanId: string | null;
    onSuccess?: () => void;
  }>({
    mutationFn: async ({ newSellingPlanId, onSuccess }) => {
      const result = await updateItemSellingPlanOption({
        lineId,
        sellingPlanId: newSellingPlanId
      });

      // Call the onSuccess callback if provided and the operation was successful
      if (onSuccess && typeof result === 'object' && result.success) {
        onSuccess();
      }

      return result;
    },
    actionType: 'update-selling-plan',
    lineId,
    merchandiseId: item.merchandise.id,
    sellingPlanId: currentSellingPlanId,
    successMessage: 'Subscription option updated'
  });
}
