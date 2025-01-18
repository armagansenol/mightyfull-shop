'use client';

import { updateItemSellingPlanOption } from '@/components/cart/actions';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import type { CartItem } from '@/lib/shopify/types';

import { X } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';

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
              className={
                'p-4 flex items-center justify-center cursor-pointer border border-black rounded-md'
              }
              onClick={() => setSelectActive(true)}
            >
              Upgrade to Subscription and Save 10%
            </div>
          )}
        </>
      )}
      {sellingPlanAllocation?.id && (
        <div className="grid grid-cols-12 gap-5">
          <form className="col-span-10">
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
            className="col-span-2 flex items-center justify-center"
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
              <X />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
