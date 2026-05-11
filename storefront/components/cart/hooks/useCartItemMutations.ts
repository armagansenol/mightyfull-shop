import {
  decrementItemQuantity,
  incrementItemQuantity,
  removeItem,
  updateItemSellingPlanOption
} from '@/components/cart/actions';
import type { CartItem } from '@/lib/shopify/types';
import { useCartMutation } from './useCartMutation';

export function useDeleteCartItem(item: CartItem) {
  const lineId = item.id!;
  const merchandiseId = item.merchandise.id;
  const sellingPlanId = item.sellingPlanAllocation?.sellingPlan?.id || null;

  return useCartMutation({
    mutationFn: async () => {
      return removeItem(lineId);
    },
    actionType: 'delete',
    merchandiseId,
    sellingPlanId
  });
}

export function useIncrementCartItem(item: CartItem, maxQuantity?: number) {
  const lineId = item.id!;
  const merchandiseId = item.merchandise.id;
  const sellingPlanId = item.sellingPlanAllocation?.sellingPlan?.id || null;

  return useCartMutation({
    mutationFn: async () => {
      return incrementItemQuantity(lineId, maxQuantity);
    },
    actionType: 'plus',
    merchandiseId,
    sellingPlanId
  });
}

export function useDecrementCartItem(item: CartItem) {
  const lineId = item.id!;
  const merchandiseId = item.merchandise.id;
  const sellingPlanId = item.sellingPlanAllocation?.sellingPlan?.id || null;

  return useCartMutation({
    mutationFn: async () => {
      return decrementItemQuantity(lineId);
    },
    actionType: 'minus',
    merchandiseId,
    sellingPlanId
  });
}

export function useUpdateSellingPlan(item: CartItem) {
  const lineId = item.id!;
  const merchandiseId = item.merchandise.id;
  const currentSellingPlanId =
    item.sellingPlanAllocation?.sellingPlan?.id || null;

  return useCartMutation<{
    newSellingPlanId: string | null;
    onSuccess?: () => void;
  }>({
    mutationFn: async ({ newSellingPlanId, onSuccess }) => {
      const result = await updateItemSellingPlanOption({
        lineId,
        sellingPlanId: newSellingPlanId || null
      });

      if (onSuccess && typeof result === 'object' && result.success) {
        onSuccess();
      }

      return result;
    },
    actionType: 'update-selling-plan',
    merchandiseId,
    sellingPlanId: currentSellingPlanId
  });
}
