import Image from 'next/image';
import Link from 'next/link';

import { updateItemSellingPlanOption } from '@/components/cart/actions';
import { DeleteItemButton } from '@/components/cart/delete-item-button';
import { EditQuantity } from '@/components/cart/edit-quantity';
import { EditSellingPlan } from '@/components/cart/edit-selling-plan';
import { Price } from '@/components/price';
import { DEFAULT_OPTION } from '@/lib/constants';
import type { CartItem as CartLine } from '@/lib/shopify/types';

interface CartItemProps {
  item: CartLine;
  merchandiseUrl: string;
  closeCart: () => void;
  updateCartItem: (
    merchandiseId: string,
    updateType: 'plus' | 'minus' | 'delete'
  ) => void;
}

export default function CartItem({
  item,
  merchandiseUrl,
  closeCart,
  updateCartItem
}: CartItemProps) {
  const updateSellingPlan = async (
    merchandiseId: string,
    sellingPlanId: string | null
  ) => {
    await updateItemSellingPlanOption({ merchandiseId, sellingPlanId });
  };

  return (
    <li className="flex w-full flex-col border-b border-neutral-300 dark:border-neutral-700">
      <div className="relative flex w-full flex-row justify-between px-1 py-4">
        <div className="absolute z-40 -ml-1 -mt-2">
          <DeleteItemButton item={item} optimisticUpdate={updateCartItem} />
        </div>
        <div className="flex flex-row">
          <div className="relative h-20 w-20 overflow-hidden rounded-md">
            <Image
              className="h-full w-full object-cover"
              width={64}
              height={64}
              alt={
                item.merchandise.product.featuredImage.altText ||
                item.merchandise.product.title
              }
              src={item.merchandise.product.featuredImage.url}
            />
          </div>
          <Link
            href={merchandiseUrl}
            onClick={closeCart}
            className="z-30 ml-2 flex flex-row space-x-4"
          >
            <div className="flex flex-1 flex-col text-base">
              <span className="leading-tight">
                {item.merchandise.product.title}
              </span>
              {item.merchandise.title !== DEFAULT_OPTION ? (
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  {item.merchandise.title}
                </p>
              ) : null}
            </div>
          </Link>
        </div>
        <div className="flex h-16 flex-col justify-between">
          <Price
            className="flex justify-end space-y-2 text-right text-sm"
            amount={item.cost.totalAmount.amount}
            currencyCode={item.cost.totalAmount.currencyCode}
          />
          <div className="ml-auto flex h-9 flex-row items-center rounded-full border border-neutral-200 dark:border-neutral-700">
            <EditQuantity
              item={item}
              type="minus"
              optimisticUpdate={updateCartItem}
            />
            <p className="w-6 text-center">
              <span className="w-full text-sm">{item.quantity}</span>
            </p>
            <EditQuantity
              item={item}
              type="plus"
              optimisticUpdate={updateCartItem}
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
