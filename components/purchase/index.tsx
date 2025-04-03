'use client';

import s from './purchase.module.scss';

import {
  ProductVariant,
  SellingPlanGroup
} from '@shopify/hydrogen-react/storefront-api-types';
import cn from 'clsx';
import { useState } from 'react';

import { Quantity } from '@/components/quantity';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { DeliveryInterval, ProductDetail, PurchaseOption } from '@/types';

interface PurchaseOptionsProps {
  gid: string;
  price: ProductVariant['price'];
  sp?: SellingPlanGroup;
  product: ProductDetail;
}

export function PurchaseOptions(props: PurchaseOptionsProps) {
  const sellingPlanOptions = props.sp?.sellingPlans.nodes.map((item) => {
    return {
      label: item.name,
      value: item.id
    };
  });

  console.log('sp options', sellingPlanOptions);

  const [quantity, setQuantity] = useState(1);
  const [purchaseOption, setPurchaseOption] = useState<PurchaseOption>(
    PurchaseOption.oneTime
  );
  const [sellingPlanId, setSellingPlanId] = useState<string>('');

  // const payload = cartLines.map((item) => {
  //   return {
  //     merchandiseId: item.merchandiseId,
  //     quantity: item.quantity,
  //     sellingPlanId: item.sellingPlanId,
  //   }
  // })

  // function useCartCreate() {
  //   return useMutation({
  //     mutationFn: createCart,
  //     onSuccess: (data) => {
  //       console.log("Cart created successfully:", data)
  //     },
  //     onError: (error) => {
  //       console.error("Failed to create cart:", error)
  //     },
  //   })
  // }

  // const cartCreate = useCartCreate()

  // const handleAddToCart = () => {
  //   cartCreate.mutate(cartLines)
  // }

  // const handleAddToCart = () => {
  //   addToCart({
  //     cartId: `${props.product.id}_${purchaseOption}`,
  //     merchandiseId: props.product.variants.nodes[0].id,
  //     quantity,
  //     ...(sellingPlanId && { sellingPlanId }),
  //   })
  // }

  // const { data: cartCreateData, isLoading: isCartCreateLoading } = useQuery({
  //   queryKey: ["cart-create", payload],
  //   queryFn: () => createCart(payload),
  //   enabled: !!payload && payload.length > 0,
  // })

  // console.log("d", cartCreateData)

  return (
    <div className={s.purchaseOptions}>
      <Label className={s.title}>PURCHASE OPTIONS</Label>
      <div className={cn(s.purchase, 'rounded-lg mb-10')}>
        <div className="space-y-6">
          <div className={s.border}>
            <RadioGroup
              className="space-y-10"
              value={purchaseOption}
              onValueChange={(value: PurchaseOption) =>
                setPurchaseOption(value)
              }
            >
              <div className="space-y-6">
                <div
                  className={cn(
                    s.purchaseOption,
                    'flex items-center space-x-2'
                  )}
                >
                  <RadioGroupItem
                    className={s.checkbox}
                    value={PurchaseOption.oneTime}
                    id={PurchaseOption.oneTime}
                  />
                  <Label htmlFor={PurchaseOption.oneTime}>
                    One-time purchase
                  </Label>
                </div>
                <div
                  className={cn(
                    s.purchaseOption,
                    'flex items-center space-x-2'
                  )}
                >
                  <RadioGroupItem
                    className={s.checkbox}
                    value={PurchaseOption.subscription}
                    id={PurchaseOption.subscription}
                  />
                  <Label htmlFor={PurchaseOption.subscription}>
                    {props.sp?.name}
                  </Label>
                </div>
              </div>
              {sellingPlanOptions && sellingPlanOptions?.length > 0 && (
                <div
                  className={cn(s.subscriptionOptions, {
                    [s.active]: purchaseOption === PurchaseOption.subscription
                  })}
                >
                  <p className="mb-2">DELIVERY INTERVAL</p>
                  <Select
                    defaultValue={sellingPlanOptions[0].value}
                    value={sellingPlanId as string}
                    onValueChange={(value: DeliveryInterval) =>
                      setSellingPlanId(value)
                    }
                  >
                    <SelectTrigger className={s.selectTrigger}>
                      <SelectValue placeholder={'Select'} />
                    </SelectTrigger>
                    <SelectContent data-lenis-prevent className={s.dsi}>
                      {sellingPlanOptions.map((option, i) => {
                        return (
                          <SelectItem
                            className={s.item}
                            value={option.value}
                            key={i}
                          >
                            {option.label}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </RadioGroup>
          </div>
        </div>
      </div>
      <Label className={cn(s.title)}>QUANTITY</Label>
      <div className="flex flex-col items-center tablet:grid grid-cols-12 gap-4 tablet:gap-3 tablet:h-12">
        <Quantity
          className="w-48 tablet:w-auto h-12 tablet:h-full tablet:col-span-4"
          quantity={quantity}
          setQuantity={setQuantity}
        />
        <Button
          className="h-12 tablet:h-full tablet:col-span-8"
          // onClick={handleAddToCart}
          size="sm"
          padding="none"
          colorTheme="themed"
        >
          ADD TO CART{' '}
          {quantity > 0 && (
            <>
              ({quantity * parseFloat(props.price.amount)}{' '}
              {props.price.currencyCode})
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
