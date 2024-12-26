'use client';

import s from './purchase-panel.module.scss';

import { ScrollTrigger } from '@/lib/gsap';
import { cn } from '@/lib/utils';
import { useGSAP } from '@gsap/react';
import { useMeasure } from '@uidotdev/usehooks';
import { BellRing } from 'lucide-react';
import { useEffect, useRef } from 'react';

import { Button } from '@/components/ui/button';
import { Product } from '@/lib/shopify-test/types';

import { useState } from 'react';

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
import { DeliveryInterval, PurchaseOption } from '@/types';

export interface PurchasePanelProps {
  shopifyProduct: Product;
}

export default function PurchasePanel(props: PurchasePanelProps) {
  console.log('shopify product', props.shopifyProduct);

  const boxRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const [measureRef, { height }] = useMeasure<HTMLDivElement>();

  useEffect(() => {
    if (triggerRef.current) {
      measureRef(triggerRef.current);
    }
  }, [measureRef]);

  useGSAP(
    () => {
      if (!triggerRef.current || !boxRef.current) return;

      //   ScrollTrigger.create({
      //     trigger: triggerRef.current,
      //     start: "top top+=150",
      //     end: "bottom+=280px bottom",
      //     pin: boxRef.current,
      //     pinSpacing: false,
      //     scrub: false,
      //     markers: true,
      //   })

      ScrollTrigger.create({
        trigger: triggerRef.current,
        start: 'top-=100px top',
        end: `bottom+=${boxRef.current?.clientHeight}px bottom`,
        pin: boxRef.current
      });
    },
    { dependencies: [height], revertOnUpdate: true }
  );

  const [quantity, setQuantity] = useState(1);
  const [purchaseOption, setPurchaseOption] = useState<PurchaseOption>(
    PurchaseOption.oneTime
  );
  const [sellingPlanId, setSellingPlanId] = useState<string>('');

  return (
    <div className="flex-1" ref={triggerRef}>
      <div className="w-full" ref={boxRef}>
        {props.shopifyProduct?.availableForSale ? (
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
                          {props.shopifyProduct.title}
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
                            props.shopifyProduct.sellingPlanGroups.nodes[0]
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
                            {props.shopifyProduct.sellingPlanGroups.nodes[0].sellingPlans.nodes.map(
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
                    ({props.shopifyProduct.variants[0].price.amount}
                    {props.shopifyProduct.variants[0].price.currencyCode})
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-stretch">
            <div
              className={cn(
                s.outOfStock,
                'flex justify-center tablet:justify-start mb-10 tablet:mb-20 py-2'
              )}
            >
              OUT OF STOCK
            </div>
            <Button className="flex gap-4" size="sm">
              <span>
                <BellRing />
              </span>
              <span>NOTIFY ME WHEN BACK IN STOCK</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
