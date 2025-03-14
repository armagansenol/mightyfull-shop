'use client';

import cn from 'clsx';
import { Loader2 } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { useUpdateSellingPlan } from '@/components/cart/hooks/useCartItemMutations';
import { IconClose } from '@/components/icons';
import { LetterSwapOnHover } from '@/components/letter-swap-on-hover';
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
        'h-12 w-12 p-4 rounded-lg hover:bg-gray-100 transition-colors bg-white border border-blue-ruin',
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
        <IconClose fill="var(--blue-ruin)" />
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
  // Extract selling plans for easier access
  const sellingPlans = useMemo(
    () => sellingPlanGroups[0]?.sellingPlans.nodes || [],
    [sellingPlanGroups]
  );
  const hasSellingPlans = sellingPlans.length > 0;
  const defaultSellingPlan = useMemo(() => sellingPlans[0]?.id, [sellingPlans]);

  // Get the current selling plan ID from the cart item
  const currentSellingPlanId =
    item.sellingPlanAllocation?.sellingPlan?.id || null;

  // State for the select dropdown visibility
  const [selectActive, setSelectActive] = useState(
    currentSellingPlanId !== null
  );

  // Update selectActive when currentSellingPlanId changes
  useEffect(() => {
    setSelectActive(currentSellingPlanId !== null);
  }, [currentSellingPlanId]);

  // Use the hook for updating the selling plan
  const { mutate: updateSellingPlan, isPending: isUpdating } =
    useUpdateSellingPlan(item);

  // Find the current selling plan name for display
  const currentSellingPlanName = useMemo(
    () =>
      currentSellingPlanId
        ? sellingPlans.find((plan) => plan.id === currentSellingPlanId)?.name ||
          'Selected plan'
        : sellingPlans[0]?.name,
    [currentSellingPlanId, sellingPlans]
  );

  // Handler functions
  const handleUpdateSellingPlan = useCallback(
    (sellingPlanId: string) => {
      if (sellingPlanId === currentSellingPlanId || isUpdating) return;
      updateSellingPlan({ newSellingPlanId: sellingPlanId });
    },
    [currentSellingPlanId, updateSellingPlan, isUpdating]
  );

  const handleResetToOneTime = useCallback(() => {
    if (!currentSellingPlanId || isUpdating) return;
    updateSellingPlan({ newSellingPlanId: null });
  }, [currentSellingPlanId, updateSellingPlan, isUpdating]);

  if (!hasSellingPlans) return null;

  const showUpgradeButton = !selectActive && !currentSellingPlanId;
  const showSelectionUI = selectActive || currentSellingPlanId !== null;

  return (
    <div className={cn({ 'opacity-75': isUpdating })}>
      <AnimatePresence mode="wait">
        {showUpgradeButton && (
          <motion.div
            key="upgrade-button"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <UpgradeButton
              isUpdating={isUpdating}
              onClick={() =>
                !isUpdating && handleUpdateSellingPlan(defaultSellingPlan)
              }
            />
          </motion.div>
        )}

        {showSelectionUI && (
          <motion.div
            key="subscription-selector"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <SubscriptionSelector
              currentSellingPlanId={currentSellingPlanId}
              currentSellingPlanName={currentSellingPlanName}
              sellingPlans={sellingPlans}
              isUpdating={isUpdating}
              onSellingPlanChange={handleUpdateSellingPlan}
              onReset={handleResetToOneTime}
              item={item}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function UpgradeButton({
  isUpdating,
  onClick
}: {
  isUpdating: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={cn(
        'h-12 w-full flex items-center justify-center cursor-pointer relative bg-white border border-blue-ruin rounded-xl',
        isUpdating && 'pointer-events-none'
      )}
      onClick={onClick}
      tabIndex={0}
      aria-label="Upgrade to subscription and save 10%"
      type="button"
    >
      <span className="font-bomstad-display font-medium text-blue-ruin text-base leading-none">
        <LetterSwapOnHover label="Upgrade to Subscription and Save 10%" />
      </span>
      {isUpdating && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 rounded"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
        </motion.div>
      )}
    </button>
  );
}

function SubscriptionSelector({
  currentSellingPlanId,
  currentSellingPlanName,
  sellingPlans,
  isUpdating,
  onSellingPlanChange,
  onReset,
  item
}: {
  currentSellingPlanId: string | null;
  currentSellingPlanName: string | undefined;
  sellingPlans: { id: string; name: string }[];
  isUpdating: boolean;
  onSellingPlanChange: (id: string) => void;
  onReset: () => void;
  item: CartItem;
}) {
  return (
    <div className={cn('w-full flex gap-2 relative')} aria-live="polite">
      <div className="flex-1">
        <Select
          value={currentSellingPlanId || ''}
          disabled={isUpdating}
          onValueChange={onSellingPlanChange}
        >
          <SelectTrigger
            className={cn(
              'w-full h-12 bg-white border border-blue-ruin rounded-lg justify-center gap-2',
              'text-base font-bomstad-display font-medium text-blue-ruin'
            )}
          >
            <SelectValue placeholder={currentSellingPlanName}>
              {currentSellingPlanName}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-white">
            {sellingPlans.map((plan) => (
              <SelectItem
                className={cn(
                  'w-full h-12',
                  'text-base font-bomstad-display font-medium text-blue-ruin'
                )}
                key={plan.id}
                value={plan.id}
              >
                {plan.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <ResetButton
        onClick={onReset}
        disabled={isUpdating || !currentSellingPlanId}
        isLoading={isUpdating && currentSellingPlanId === null}
        ariaLabel={`Reset ${item.merchandise.product.title} to one-time purchase`}
      />

      {isUpdating && currentSellingPlanId !== null && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 rounded"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
        </motion.div>
      )}
    </div>
  );
}
