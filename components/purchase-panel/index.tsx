'use client';

import s from './purchase-panel.module.scss';

import { cn } from '@/lib/utils';
import { useGSAP } from '@gsap/react';
import { useMeasure } from '@uidotdev/usehooks';
import { useEffect, useRef, useState } from 'react';
import { useMedia } from 'react-use';

import { AddToCart } from '@/components/cart/add-to-cart';
import { OutOfStock } from '@/components/out-of-stock';
import { Quantity } from '@/components/quantity';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

import { ScrollTrigger } from '@/lib/gsap';
import { Product } from '@/lib/shopify/types';
import { DeliveryInterval, PurchaseOption } from '@/types';

export interface PurchasePanelProps {
  shopifyProduct: Product;
}

export function PurchasePanel({ shopifyProduct }: PurchasePanelProps) {
  const isWiderThanTablet = useMedia('(min-width: 800px)');

  const boxRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const [triggerMeasureRef, { height: triggerHeight }] =
    useMeasure<HTMLDivElement>();
  const [boxMeasureRef, { height: boxHeight }] = useMeasure<HTMLDivElement>();

  const [quantity, setQuantity] = useState(1);
  const [purchaseOption, setPurchaseOption] = useState<PurchaseOption>(
    PurchaseOption.oneTime
  );
  const [sellingPlanId, setSellingPlanId] = useState<string>('');

  useEffect(() => {
    if (boxRef.current) {
      boxMeasureRef(boxRef.current);
    }
  }, [boxMeasureRef]);

  useEffect(() => {
    if (triggerRef.current) {
      triggerMeasureRef(triggerRef.current);
    }
  }, [triggerMeasureRef]);

  useGSAP(
    () => {
      if (!isWiderThanTablet) return;
      if (!triggerRef.current || !boxRef.current) return;

      const topDistance = 120;

      ScrollTrigger.create({
        trigger: triggerRef.current,
        start: `top-=${topDistance}px top`,
        end: `bottom+=${window.innerHeight - (boxHeight ?? 0) - topDistance}px bottom`,
        pin: boxRef.current,
        pinSpacing: false
      });
    },
    {
      dependencies: [triggerHeight, boxHeight, isWiderThanTablet],
      revertOnUpdate: true
    }
  );

  return (
    <div className="tablet:flex-1" ref={triggerRef}>
      <div className="w-full" ref={boxRef}>
        {shopifyProduct?.availableForSale ? (
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
                          Subscribe - 10% off
                        </Label>
                      </div>
                    </div>
                    {
                      <div
                        className={cn(s.subscriptionOptions, {
                          [s.active]:
                            purchaseOption === PurchaseOption.subscription
                        })}
                      >
                        <p className="mb-2">DELIVERY INTERVAL</p>
                        <Select
                          defaultValue={
                            shopifyProduct.sellingPlanGroups.nodes[0]
                              .sellingPlans.nodes[0].id
                          }
                          value={sellingPlanId as string}
                          onValueChange={(value: DeliveryInterval) =>
                            setSellingPlanId(value)
                          }
                        >
                          <SelectTrigger className={s.selectTrigger}>
                            <SelectValue placeholder={'Select'} />
                          </SelectTrigger>
                          <SelectContent data-lenis-prevent className={s.dsi}>
                            {shopifyProduct.sellingPlanGroups.nodes[0].sellingPlans.nodes.map(
                              (option, i) => {
                                return (
                                  <SelectItem
                                    className={s.item}
                                    value={option.id}
                                    key={i}
                                  >
                                    {option.name}
                                  </SelectItem>
                                );
                              }
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                    }
                  </RadioGroup>
                </div>
              </div>
            </div>
            <Label className={cn(s.title)}>QUANTITY</Label>
            <div className="flex flex-col items-center tablet:grid grid-cols-12 gap-4 tablet:gap-3 tablet:h-14">
              <Quantity
                className="w-48 tablet:w-auto h-12 tablet:h-full tablet:col-span-4"
                quantity={quantity}
                setQuantity={setQuantity}
              />
              <AddToCart
                buttonTheme="inverted-themed"
                className="tablet:w-auto h-12 tablet:h-full tablet:col-span-8"
                availableForSale={shopifyProduct.availableForSale}
                variantId={shopifyProduct.variants[0].id}
                quantity={quantity}
                sellingPlanId={sellingPlanId}
              />
            </div>
          </div>
        ) : (
          <OutOfStock
            variantId={shopifyProduct.variants[0].id}
            revalidationPath={`/shop/${shopifyProduct.handle}`}
          />
        )}
      </div>
    </div>
  );
}
