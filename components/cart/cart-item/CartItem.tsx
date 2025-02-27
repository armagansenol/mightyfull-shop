import s from './cart-item.module.scss';

import cn from 'clsx';
import { useState } from 'react';

import { updateItemSellingPlanOption } from '@/components/cart/actions';
import { DeleteItemButton } from '@/components/cart/delete-item-button';
import { EditSellingPlan } from '@/components/cart/edit-selling-plan';
import { OptimisticQuantityAdjuster } from '@/components/cart/optimistic-quantity-adjuster';
import { Img } from '@/components/utility/img';
import type { CartItem as CartLine } from '@/lib/shopify/types';
import CartItemPrice from './CartItemPrice';

interface CartItemProps {
  item: CartLine;
  updateCartItem: (
    merchandiseId: string,
    updateType: 'plus' | 'minus' | 'delete'
  ) => void;
}

export default function CartItem({ item, updateCartItem }: CartItemProps) {
  const [isPriceUpdating, setIsPriceUpdating] = useState(false);

  const updateSellingPlan = async (
    merchandiseId: string,
    sellingPlanId: string | null
  ) => {
    await updateItemSellingPlanOption({ merchandiseId, sellingPlanId });
  };

  return (
    <li className="w-full flex flex-col gap-6 py-4">
      <div className="relative flex w-full flex-row justify-between">
        <div className="flex flex-row flex-1 gap-6">
          <div className={s.imgC}>
            <Img
              className="h-full w-full object-cover"
              width={150}
              height={150}
              alt={
                item.merchandise.product.featuredImage.altText ||
                item.merchandise.product.title
              }
              src={item.merchandise.product.featuredImage.url}
            />
          </div>
          <div className="flex flex-col items-start gap-4">
            <span className={s.title}>{item.merchandise.product.title}</span>
            <div className="flex flex-col justify-between">
              <div
                className={cn(
                  s.editQuantity,
                  'flex items-center justify-center'
                )}
              >
                <OptimisticQuantityAdjuster
                  item={item}
                  updateCartItem={updateCartItem}
                  maxQuantity={20}
                  onUpdateStateChange={setIsPriceUpdating}
                />
              </div>
            </div>
            <div>
              <DeleteItemButton item={item} optimisticUpdate={updateCartItem} />
            </div>
          </div>
          <div className="relative ml-auto h-16 w-16 border border-indigo-100 flex-shrink-0 flex-grow-0">
            <CartItemPrice
              amount={item.cost.totalAmount.amount}
              currencyCode={item.cost.totalAmount.currencyCode}
              isUpdating={isPriceUpdating}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            />
          </div>
        </div>
      </div>
      <EditSellingPlan
        item={item}
        sellingPlanGroups={item.merchandise.product.sellingPlanGroups.nodes}
        optimisticUpdate={updateSellingPlan}
      />
    </li>
  );
}
