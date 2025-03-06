'use client';

import s from './edit-selling-plan-button.module.scss';

import { cn } from '@/lib/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, X } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';

import { updateItemSellingPlanOption } from '@/components/cart/actions';
import { useCart } from '@/components/cart/cart-context';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import type { CartItem } from '@/lib/shopify/types';

function ResetButton({
  onClick,
  disabled,
  isLoading,
  ariaLabel = 'Reset to one-time purchase'
}: {
  onClick: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  ariaLabel?: string;
}) {
  return (
    <button
      type="button"
      className={cn(
        'p-2 rounded-full hover:bg-gray-100 transition-colors',
        'cursor-pointer flex items-center justify-center',
        (disabled || isLoading) && 'opacity-50 cursor-not-allowed'
      )}
      onClick={onClick}
      disabled={disabled || isLoading}
      aria-label={ariaLabel}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
      ) : (
        <X className="h-4 w-4" />
      )}
    </button>
  );
}

export function EditSellingPlanButton({
  item,
  sellingPlanGroups
}: {
  item: CartItem;
  sellingPlanGroups: {
    name: string;
    sellingPlans: {
      nodes: {
        id: string;
        name: string;
      }[];
    };
  }[];
}) {
  const { updateCartItemSellingPlan } = useCart();
  const queryClient = useQueryClient();

  // Get the current selling plan ID from the cart item
  const currentSellingPlanId =
    item.sellingPlanAllocation?.sellingPlan?.id || null;

  // State for the select dropdown visibility
  const [selectActive, setSelectActive] = useState(
    currentSellingPlanId !== null
  );

  // Setup the mutation for updating the selling plan
  const { mutate: updateSellingPlan, isPending: isUpdating } = useMutation({
    mutationFn: async ({
      newSellingPlanId
    }: {
      newSellingPlanId: string | null;
    }) => {
      return await updateItemSellingPlanOption({
        merchandiseId: item.merchandise.id,
        sellingPlanId: newSellingPlanId,
        currentSellingPlanId
      });
    },
    // Optimistically update the UI
    onMutate: async ({ newSellingPlanId }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['cart'] });

      // Optimistically update the cart context
      updateCartItemSellingPlan(item.merchandise.id, newSellingPlanId);

      return { previousSellingPlanId: currentSellingPlanId };
    },
    onSuccess: (result, { newSellingPlanId }, context) => {
      if (result && typeof result === 'object' && 'success' in result) {
        if (result.success) {
          // Show success message
          const message =
            result.message ||
            (newSellingPlanId
              ? 'Subscription updated successfully'
              : 'Changed to one-time purchase');
          toast.success(message);

          // If resetting to one-time purchase, hide the select if it was initially hidden
          if (newSellingPlanId === null && !context?.previousSellingPlanId) {
            setSelectActive(false);
          }

          // Invalidate queries to refetch the latest data
          queryClient.invalidateQueries({ queryKey: ['cart'] });
        } else {
          // Show error and revert on failure
          toast.error(result.message || 'Failed to update subscription');
          console.error('Error from Shopify:', result.message);

          // Revert the optimistic update
          if (context) {
            updateCartItemSellingPlan(
              item.merchandise.id,
              context.previousSellingPlanId
            );
          }
        }
      } else if (typeof result === 'string') {
        toast.error(result);
        console.error('Error from Shopify:', result);

        // Revert the optimistic update
        if (context) {
          updateCartItemSellingPlan(
            item.merchandise.id,
            context.previousSellingPlanId
          );
        }
      }
    },
    onError: (error, { newSellingPlanId }, context) => {
      const errorMessage =
        error instanceof Error
          ? error.message
          : newSellingPlanId
            ? 'Failed to update subscription option'
            : 'Failed to update to one-time purchase';

      toast.error(errorMessage);
      console.error('Error updating subscription:', error);

      // Revert the optimistic update
      if (context) {
        updateCartItemSellingPlan(
          item.merchandise.id,
          context.previousSellingPlanId
        );
      }

      // Invalidate to ensure we're in sync with the server
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    }
  });

  const handleUpdateSellingPlan = useCallback(
    (sellingPlanId: string) => {
      // Don't update if it's the same plan or if already loading
      if (sellingPlanId === currentSellingPlanId || isUpdating) return;

      updateSellingPlan({ newSellingPlanId: sellingPlanId });
    },
    [currentSellingPlanId, updateSellingPlan, isUpdating]
  );

  const handleResetToOneTime = useCallback(() => {
    // Don't update if already one-time or if already loading
    if (!currentSellingPlanId || isUpdating) return;

    updateSellingPlan({ newSellingPlanId: null });
  }, [currentSellingPlanId, updateSellingPlan, isUpdating]);

  // Find the current selling plan name for display
  const currentSellingPlanName = useMemo(
    () =>
      currentSellingPlanId
        ? sellingPlanGroups[0]?.sellingPlans.nodes.find(
            (plan) => plan.id === currentSellingPlanId
          )?.name || 'Selected plan'
        : 'One-time purchase',
    [currentSellingPlanId, sellingPlanGroups]
  );

  const hasSellingPlans = sellingPlanGroups[0]?.sellingPlans.nodes.length > 0;

  if (!hasSellingPlans) return null;

  return (
    <div className={cn({ 'opacity-75': isUpdating })}>
      {!selectActive && !currentSellingPlanId && (
        <div
          className={cn(
            s.upgrade,
            'flex items-center justify-center cursor-pointer',
            isUpdating && 'pointer-events-none'
          )}
          onClick={() => !isUpdating && setSelectActive(true)}
          role="button"
          tabIndex={0}
          aria-label="Upgrade to subscription and save 10%"
        >
          Upgrade to Subscription and Save 10%
        </div>
      )}

      {(selectActive || currentSellingPlanId) && (
        <div className={cn('w-full flex gap-2 relative')} aria-live="polite">
          <div className="flex-1">
            <Select
              value={currentSellingPlanId || undefined}
              disabled={isUpdating}
              onValueChange={handleUpdateSellingPlan}
            >
              <SelectTrigger className="w-full">
                <SelectValue>{currentSellingPlanName}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {sellingPlanGroups[0]?.sellingPlans.nodes.map((plan) => (
                  <SelectItem key={plan.id} value={plan.id}>
                    {plan.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <ResetButton
            onClick={handleResetToOneTime}
            disabled={isUpdating || !currentSellingPlanId}
            isLoading={isUpdating && currentSellingPlanId === null}
            ariaLabel={`Reset ${item.merchandise.product.title} to one-time purchase`}
          />

          {isUpdating && currentSellingPlanId !== null && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 rounded">
              <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
