import cn from 'clsx';
import { AnimatePresence, motion } from 'motion/react';

import { CartPrice } from '@/components/cart/cart-price';
import { DeleteItemButton } from '@/components/cart/delete-item-button';
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
    <AnimatePresence mode="wait">
      <motion.div
        className={cn('w-full space-y-6 border-b border-silverback pb-10')}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="grid grid-cols-12 gap-6 relative ">
          <div className={cn('col-span-4 aspect-square p-1')}>
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
          <div className="col-span-5 flex flex-col items-start gap-4">
            <span className="font-bomstad-display font-black text-2xl text-blue-ruin leading-none">
              {item.merchandise.product.title}
            </span>
            <div className="flex flex-col justify-between">
              <div className="flex items-center justify-center">
                <QuantityControl item={item} />
              </div>
            </div>
            <DeleteItemButton item={item} />
          </div>
          <CartPrice
            amount={item.cost.totalAmount.amount}
            currencyCode={item.cost.totalAmount.currencyCode}
            className="absolute top-1/2 right-0 -translate-y-1/2"
          />
        </div>
        <EditSellingPlanButton
          item={item}
          sellingPlanGroups={item.merchandise.product.sellingPlanGroups.nodes}
        />
      </motion.div>
    </AnimatePresence>
  );
}
