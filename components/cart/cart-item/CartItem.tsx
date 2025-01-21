import s from './cart-item.module.scss';

import cn from 'clsx';
import Image from 'next/image';
import Link from 'next/link';

import { updateItemSellingPlanOption } from '@/components/cart/actions';
import { DeleteItemButton } from '@/components/cart/delete-item-button';
import { EditQuantityButton } from '@/components/cart/edit-quantity-button';
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
          <div
            className={cn(
              s.imgC,
              'relative h-20 w-20 overflow-hidden rounded-md'
            )}
          >
            <Image
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
          <Link
            href={merchandiseUrl}
            onClick={closeCart}
            className="z-30 ml-2 flex flex-row space-x-4"
          >
            <div className="flex flex-1 flex-col text-base">
              <span className={cn(s.title, 'leading-tight')}>
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
        <div className="flex flex-col justify-between">
          <Price
            className="flex justify-end space-y-2 text-right text-sm"
            amount={item.cost.totalAmount.amount}
            currencyCode={item.cost.totalAmount.currencyCode}
          />
          <div className={cn(s.editQuantity, 'flex items-center')}>
            <EditQuantityButton
              item={item}
              type="minus"
              optimisticUpdate={updateCartItem}
            />
            <p className={cn(s.quantity, 'flex items-center justify-center')}>
              <span>{item.quantity}</span>
            </p>
            <EditQuantityButton
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
