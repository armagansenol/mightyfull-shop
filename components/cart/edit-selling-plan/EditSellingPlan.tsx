'use client';

import s from './edit-selling-plan.module.scss';

import cn from 'clsx';
import { useCallback, useMemo, useState } from 'react';

import { updateItemSellingPlanOption } from '@/components/cart/actions';
import { IconClose } from '@/components/icons';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import type { CartItem } from '@/lib/shopify/types';

export default function EditSellingPlan({
  item,
  sellingPlanGroups,
  optimisticUpdate
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
  optimisticUpdate: (
    merchandiseId: string,
    sellingPlanId: string | null
  ) => void;
}) {
  const [selectActive, setSelectActive] = useState(false);

  const payload = useMemo(
    () => ({
      merchandiseId: item.merchandise.id,
      sellingPlanId: null
    }),
    [item.merchandise.id]
  );

  const update = useCallback(
    async (sellingPlanId: string | null) => {
      const res = await updateItemSellingPlanOption({
        ...payload,
        sellingPlanId
      });
      console.log('Selling plan update response:', res);
    },
    [payload]
  );

  const sellingPlanAllocation = item.sellingPlanAllocation?.sellingPlan;

  console.log('sellingPlanAllocation', item.sellingPlanAllocation?.sellingPlan);
  console.log('sellingPlans', sellingPlanGroups[0]?.sellingPlans.nodes);

  return (
    <>
      {!selectActive && (
        <>
          {!sellingPlanAllocation?.id && (
            <div
              className={cn(
                s.upgradeToSubscription,
                'flex items-center justify-center cursor-pointer'
              )}
              onClick={() => setSelectActive(true)}
            >
              Upgrade to Subscription and Save 10%
            </div>
          )}
        </>
      )}
      {sellingPlanAllocation?.id && (
        <div className={cn(s.editSellingPlan, 'w-full flex gap-2')}>
          <form className={cn(s.selectSubscription, 'w-full flex flex-1')}>
            <Select
              defaultValue={sellingPlanAllocation?.id}
              onValueChange={async (value) => {
                const sellingPlanId = value;
                optimisticUpdate(payload.merchandiseId, sellingPlanId);
                await update(sellingPlanId);
              }}
            >
              <SelectTrigger
                className={cn(s.selectTrigger, 'w-full flex flex-1')}
              >
                <SelectValue placeholder={'Select'} />
              </SelectTrigger>
              <SelectContent data-lenis-prevent className={cn(s.msix, 'msix')}>
                {sellingPlanGroups[0]?.sellingPlans.nodes.map((plan) => (
                  <SelectItem
                    className={cn(s.item, 'item')}
                    key={plan.id}
                    value={plan.id}
                  >
                    {plan.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </form>
          <form
            className={cn(
              s.removeSubscription,
              'flex items-center justify-center'
            )}
            action={async () => {
              const sellingPlanId = null;
              optimisticUpdate(payload.merchandiseId, sellingPlanId);
              await update(sellingPlanId);
            }}
          >
            <button
              className={cn(
                'cursor-pointer flex items-center justify-center',
                s.closeButton
              )}
              type="submit"
            >
              <IconClose fill="var(--blue-ruin)" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
