'use client';

import s from './edit-item-selling-plan-button.module.scss';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import type { CartItem } from '@/lib/shopify/types';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { updateItemSellingPlanOption } from '../actions';

export default function EditItemSellingPlanButton({
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
      {(!sellingPlanAllocation?.id || !selectActive) && (
        <div
          className={cn(
            s.upgrade,
            'p-4 flex items-center justify-center cursor-pointer border border-black rounded-md'
          )}
          onClick={() => setSelectActive(true)}
        >
          Upgrade to Subscription and Save 10%
        </div>
      )}
      {selectActive && (
        <form className="grid grid-cols-12 gap-2">
          <div className="col-span-10">
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
          </div>
          <div className="col-span-2 flex items-center justify-center">
            <X />
          </div>
        </form>
      )}
    </>
  );
}
