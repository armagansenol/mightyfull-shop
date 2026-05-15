import cn from 'clsx';

import { DeleteItemButton } from '@/components/cart/delete-item-button';
import { QuantityControl } from '@/components/cart/edit-quantity-button';
import { EditSellingPlanButton } from '@/components/cart/edit-selling-plan-button';
import { Price } from '@/components/price';
import { Img } from '@/components/utility/img';
import type { CartItem as CartLine } from '@/lib/shopify/types';
import type { CartUpdateType } from '@/types';

interface CartItemProps {
  item: CartLine;
  updateCartItem?: (
    merchandiseId: string,
    updateType: CartUpdateType,
    sellingPlanId?: string | null
  ) => void;
}

export default function CartItem({ item }: CartItemProps) {
  // Resolve real inventory for the variant in this line so we cap the
  // increment button against actual stock instead of letting an optimistic
  // update bounce back when Shopify clamps the requested quantity.
  const variant = item.merchandise.product.variants.edges.find(
    (edge) => edge.node.id === item.merchandise.id
  )?.node;
  const availableStock =
    typeof variant?.quantityAvailable === 'number' &&
    variant.quantityAvailable >= 0
      ? variant.quantityAvailable
      : undefined;

  const priceBlock = item.sellingPlanAllocation?.sellingPlan?.id ? (
    <>
      <div className="line-through font-bomstad-display text-gray-400 text-base sm:text-lg lg:text-xl font-semibold">
        <Price
          className="leading-none"
          amount={(
            parseFloat(
              item.merchandise.product.variants.edges[0].node.price.amount
            ) * item.quantity
          ).toString()}
          currencyCode={
            item.merchandise.product.variants.edges[0].node.price.currencyCode
          }
        />
      </div>
      <div className="font-bomstad-display text-green-500 text-xl sm:text-2xl lg:text-3xl font-semibold">
        <Price
          animation="bob"
          amount={item.cost.totalAmount.amount}
          currencyCode={item.cost.totalAmount.currencyCode}
        />
      </div>
    </>
  ) : (
    <div className="font-bomstad-display text-blue-ruin text-xl sm:text-2xl lg:text-3xl font-semibold">
      <Price
        animation="bob"
        amount={(
          parseFloat(
            item.merchandise.product.variants.edges[0].node.price.amount
          ) * item.quantity
        ).toString()}
        currencyCode={
          item.merchandise.product.variants.edges[0].node.price.currencyCode
        }
      />
    </div>
  );

  return (
    <div
      className={cn('w-full space-y-6 border-b border-silverback/20 pb-10')}
    >
      <div className="grid grid-cols-12 gap-4 sm:gap-6">
        <div className="col-span-4 aspect-square p-1">
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
        <div className="col-span-8 flex flex-col items-start gap-3 sm:gap-4 min-w-0">
          <div className="flex items-start justify-between gap-3 w-full">
            <span className="font-bomstad-display font-black text-lg sm:text-xl lg:text-2xl text-blue-ruin leading-tight text-balance min-w-0 flex-1">
              {item.merchandise.product.title}
            </span>
            <div className="flex flex-col items-end gap-1 shrink-0">
              {priceBlock}
            </div>
          </div>
          <QuantityControl item={item} availableStock={availableStock} />
          <DeleteItemButton item={item} />
        </div>
      </div>
      <EditSellingPlanButton
        item={item}
        sellingPlanGroups={item.merchandise.product.sellingPlanGroups.nodes}
      />
    </div>
  );
}
