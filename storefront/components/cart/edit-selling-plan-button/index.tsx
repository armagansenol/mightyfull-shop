'use client';

import cn from 'clsx';
import { Loader2 } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { useUpdateSellingPlan } from '@/components/cart/hooks/useCartItemMutations';
import { IconClose } from '@/components/icons';
import { LetterSwapOnHover } from '@/components/letter-swap-on-hover';
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
        <Loader2 className="h-4 w-4 animate-spin text-blue-ruin" />
      ) : (
        <IconClose fill="var(--blue-ruin)" />
      )}
    </button>
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
      <span className="font-bomstad-display font-medium text-blue-ruin text-lg leading-none">
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
          <Loader2 className="h-5 w-5 animate-spin text-blue-ruin" />
        </motion.div>
      )}
    </button>
  );
}

function SubscriptionLabel({
  currentSellingPlanName,
  isUpdating,
  onReset,
  item
}: {
  currentSellingPlanName: string;
  isUpdating: boolean;
  onReset: () => void;
  item: CartItem;
}) {
  return (
    <div className={cn('w-full flex gap-2 relative')} aria-live="polite">
      <div
        className={cn(
          'flex-1 h-12 bg-white border border-blue-ruin rounded-lg',
          'flex items-center justify-center',
          'text-lg font-bomstad-display font-medium text-blue-ruin'
        )}
      >
        {currentSellingPlanName}
      </div>

      <ResetButton
        onClick={onReset}
        disabled={isUpdating}
        isLoading={isUpdating}
        ariaLabel={`Reset ${item.merchandise.product.title} to one-time purchase`}
      />

      {isUpdating && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 rounded"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Loader2 className="h-5 w-5 animate-spin text-blue-ruin" />
        </motion.div>
      )}
    </div>
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
  const sellingPlans = useMemo(
    () => sellingPlanGroups[0]?.sellingPlans.nodes || [],
    [sellingPlanGroups]
  );
  const hasSellingPlans = sellingPlans.length > 0;
  const defaultSellingPlan = useMemo(() => sellingPlans[0]?.id, [sellingPlans]);

  const currentSellingPlanId =
    item.sellingPlanAllocation?.sellingPlan?.id || null;

  const [selectActive, setSelectActive] = useState(
    currentSellingPlanId !== null
  );

  useEffect(() => {
    setSelectActive(currentSellingPlanId !== null);
  }, [currentSellingPlanId]);

  const { mutate: updateSellingPlan, isPending: isUpdating } =
    useUpdateSellingPlan(item);

  const currentSellingPlanName = useMemo(
    () =>
      currentSellingPlanId
        ? sellingPlans.find((plan) => plan.id === currentSellingPlanId)?.name ||
          'Monthly subscription'
        : sellingPlans[0]?.name || 'Monthly subscription',
    [currentSellingPlanId, sellingPlans]
  );

  const handleUpgrade = useCallback(() => {
    if (isUpdating) return;
    updateSellingPlan({ newSellingPlanId: defaultSellingPlan });
  }, [defaultSellingPlan, updateSellingPlan, isUpdating]);

  const handleResetToOneTime = useCallback(() => {
    if (!currentSellingPlanId || isUpdating) return;
    updateSellingPlan({ newSellingPlanId: null });
  }, [currentSellingPlanId, updateSellingPlan, isUpdating]);

  if (!hasSellingPlans) return null;

  const showUpgradeButton = !selectActive && !currentSellingPlanId;
  const showSubscriptionLabel = selectActive || currentSellingPlanId !== null;

  return (
    <div
      className={cn('transition-opacity duration-700', {
        'opacity-75': isUpdating
      })}
    >
      <AnimatePresence mode="popLayout">
        {showUpgradeButton && (
          <motion.div
            key="upgrade-button"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <UpgradeButton isUpdating={isUpdating} onClick={handleUpgrade} />
          </motion.div>
        )}

        {showSubscriptionLabel && (
          <motion.div
            key="subscription-label"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <SubscriptionLabel
              currentSellingPlanName={currentSellingPlanName}
              isUpdating={isUpdating}
              onReset={handleResetToOneTime}
              item={item}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
