'use client';

import cn from 'clsx';

import s from './edit-selling-plan.module.scss';

import { useCallback, useMemo, useState } from 'react';

import { updateItemSellingPlanOption } from '@/components/cart/actions';
import { IconX } from '@/components/icons';
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
        <div className={cn(s.editSellingPlan, 'grid grid-cols-12 gap-2')}>
          <form className={cn(s.selectSubscription, 'col-span-11')}>
            <Select
              defaultValue={sellingPlanAllocation?.id}
              onValueChange={async (value) => {
                const sellingPlanId = value;
                optimisticUpdate(payload.merchandiseId, sellingPlanId);
                await update(sellingPlanId);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select purchase type" />
              </SelectTrigger>
              <SelectContent>
                {sellingPlanGroups[0]?.sellingPlans.nodes.map((plan) => (
                  <SelectItem key={plan.id} value={plan.id}>
                    {plan.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </form>
          <form
            className={cn(
              s.removeSubscription,
              'col-span-1 flex items-center justify-center'
            )}
            action={async () => {
              const sellingPlanId = null;
              optimisticUpdate(payload.merchandiseId, sellingPlanId);
              await update(sellingPlanId);
            }}
          >
            <button
              className="cursor-pointer flex items-center justify-center"
              type="submit"
            >
              <IconX />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
