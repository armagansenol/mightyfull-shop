'use client';

import cn from 'clsx';
import { Loader2 } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { useUpdateSellingPlan } from '@/components/cart/hooks/useCartItemMutations';
import { IconChevronDown, IconClose } from '@/components/icons';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { formatSellingPlanName } from '@/lib/shopify/selling-plan';
import type { CartItem } from '@/lib/shopify/types';

type SellingPlanOption = { id: string; name: string };

function ResetButton({
  onClick,
  disabled,
  ariaLabel = 'Reset to one-time purchase'
}: {
  onClick: () => void;
  disabled?: boolean;
  ariaLabel?: string;
}) {
  return (
    <button
      type="button"
      className={cn(
        'h-10 w-10 p-3 rounded-lg hover:bg-gray-100 transition-colors bg-white border border-blue-ruin',
        'cursor-pointer flex items-center justify-center',
        disabled && 'cursor-not-allowed'
      )}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      <IconClose fill="var(--blue-ruin)" />
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
        'h-10 w-full flex items-center justify-center cursor-pointer bg-white border border-blue-ruin rounded-xl',
        isUpdating && 'pointer-events-none'
      )}
      onClick={onClick}
      tabIndex={0}
      aria-label="Subscribe and save 10%"
      type="button"
    >
      <span className="font-bomstad-display font-medium text-blue-ruin text-lg leading-none">
        Subscribe & save 10%
      </span>
    </button>
  );
}

function SubscriptionPlanPicker({
  currentSellingPlanId,
  sellingPlans,
  isUpdating,
  onChange,
  onReset,
  item
}: {
  currentSellingPlanId: string | null;
  sellingPlans: SellingPlanOption[];
  isUpdating: boolean;
  onChange: (newSellingPlanId: string) => void;
  onReset: () => void;
  item: CartItem;
}) {
  const selectedId = currentSellingPlanId ?? sellingPlans[0]?.id;

  return (
    <div className={cn('w-full flex gap-2')} aria-live="polite">
      <Select
        value={selectedId}
        onValueChange={(value) => {
          if (value && value !== currentSellingPlanId) {
            onChange(value);
          }
        }}
        disabled={isUpdating || sellingPlans.length < 2}
      >
        <SelectTrigger
          aria-label={`Change delivery frequency for ${item.merchandise.product.title}`}
          className={cn(
            'flex-1 h-10 bg-white border border-blue-ruin rounded-lg px-4 gap-2',
            'justify-center text-lg font-bomstad-display font-medium text-blue-ruin',
            'disabled:opacity-100',
            '[&>svg]:hidden'
          )}
        >
          <SelectValue />
          <span
            aria-hidden="true"
            className="block w-[9px] h-[5px] shrink-0 text-blue-ruin"
          >
            <IconChevronDown fill="currentColor" />
          </span>
        </SelectTrigger>
        <SelectContent className="border border-blue-ruin bg-white">
          {sellingPlans.map((plan) => (
            <SelectItem
              key={plan.id}
              value={plan.id}
              className="font-bomstad-display font-medium text-blue-ruin focus:bg-blue-ruin/10 focus:text-blue-ruin"
            >
              {formatSellingPlanName(plan.name)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <ResetButton
        onClick={onReset}
        disabled={isUpdating}
        ariaLabel={`Reset ${item.merchandise.product.title} to one-time purchase`}
      />
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

  const { mutate: updateSellingPlan, isPending: isUpdating } =
    useUpdateSellingPlan(item);

  useEffect(() => {
    // Hold the visible state steady while a mutation is in flight so the
    // spinner overlay stays on the picker during a reset (and on the upgrade
    // button during a downgrade), then sync once it settles.
    if (isUpdating) return;
    setSelectActive(currentSellingPlanId !== null);
  }, [currentSellingPlanId, isUpdating]);

  const handleUpgrade = useCallback(() => {
    if (isUpdating) return;
    updateSellingPlan({ newSellingPlanId: defaultSellingPlan });
  }, [defaultSellingPlan, updateSellingPlan, isUpdating]);

  const handleChangePlan = useCallback(
    (newSellingPlanId: string) => {
      if (isUpdating) return;
      updateSellingPlan({ newSellingPlanId });
    },
    [updateSellingPlan, isUpdating]
  );

  const handleResetToOneTime = useCallback(() => {
    if (!currentSellingPlanId || isUpdating) return;
    updateSellingPlan({ newSellingPlanId: null });
  }, [currentSellingPlanId, updateSellingPlan, isUpdating]);

  if (!hasSellingPlans) return null;

  // Drive visibility off `selectActive` (frozen during isUpdating) so the
  // pre-mutation UI keeps its spinner overlay until the server settles.
  const showUpgradeButton = !selectActive;
  const showSubscriptionLabel = selectActive;

  return (
    <div className="relative">
      <div
        className={cn(
          'transition-opacity duration-200',
          isUpdating && 'opacity-20'
        )}
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
              <SubscriptionPlanPicker
                currentSellingPlanId={currentSellingPlanId}
                sellingPlans={sellingPlans}
                isUpdating={isUpdating}
                onChange={handleChangePlan}
                onReset={handleResetToOneTime}
                item={item}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isUpdating && (
          <motion.div
            key="loading-overlay"
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Loader2 className="h-5 w-5 animate-spin text-blue-ruin" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
