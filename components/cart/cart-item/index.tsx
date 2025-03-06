import s from './cart-item.module.scss';

import cn from 'clsx';

import { CartPrice } from '@/components/cart/cart-price';
import DeleteItemButtonWithHook from '@/components/cart/delete-item-button/example-usage';
import { QuantityControl } from '@/components/cart/edit-quantity-button';
import { EditSellingPlanButton } from '@/components/cart/edit-selling-plan-button';
import { Img } from '@/components/utility/img';
import type { CartItem as CartLine } from '@/lib/shopify/types';

interface CartItemProps {
  item: CartLine;
  updateCartItem?: (
    merchandiseId: string,
    updateType: 'plus' | 'minus' | 'delete',
    sellingPlanId?: string | null
  ) => void;
}

export default function CartItem({ item }: CartItemProps) {
  return (
    <div className={cn('w-full space-y-4')}>
      <div className="grid grid-cols-12 gap-6">
        <div className={cn('col-span-4 aspect-square')}>
          <Img
            className="h-full w-full object-cover"
            width={300}
            height={300}
            alt={
              item.merchandise.product.featuredImage.altText ||
              item.merchandise.product.title
            }
            src={item.merchandise.product.featuredImage.url}
          />
        </div>
        <div className="col-span-4 flex flex-col items-start gap-4">
          <span className={s.title}>{item.merchandise.product.title}</span>
          <div className="flex flex-col justify-between">
            <div
              className={cn(s.editQuantity, 'flex items-center justify-center')}
            >
              <QuantityControl item={item} maxQuantity={20} />
            </div>
          </div>
          {/* <DeleteItemButton item={item} /> */}
          <DeleteItemButtonWithHook item={item} />
        </div>
        <div className="col-span-4 relative">
          <CartPrice
            amount={item.cost.totalAmount.amount}
            currencyCode={item.cost.totalAmount.currencyCode}
            className="absolute top-1/2 right-0 -translate-y-1/2"
          />
        </div>
      </div>
      <EditSellingPlanButton
        item={item}
        sellingPlanGroups={item.merchandise.product.sellingPlanGroups.nodes}
      />
    </div>
  );
}
