'use client';

import { TooltipContent } from '@radix-ui/react-tooltip';
import { useMeasure } from '@uidotdev/usehooks';
import { BadgeInfo } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useMedia } from 'react-use';
import { AddToCart } from '@/components/cart/add-to-cart';
import { gsap, ScrollTrigger, useGSAP } from '@/components/gsap';
import { OutOfStock } from '@/components/out-of-stock';
import { Quantity } from '@/components/quantity';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { Link } from '@/components/utility/link';
import type { Product } from '@/lib/shopify/types';
import { cn } from '@/lib/utils';
import { PurchaseOption } from '@/types';

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
  const sellingPlanId =
    purchaseOption === PurchaseOption.subscription &&
    shopifyProduct.sellingPlanGroups.nodes.length > 0
      ? shopifyProduct.sellingPlanGroups.nodes[0].sellingPlans.nodes[0].id
      : '';

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
      gsap.registerPlugin(ScrollTrigger);

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
    <div className="md:flex-1" ref={triggerRef}>
      <div className="w-full" ref={boxRef}>
        {shopifyProduct?.availableForSale ? (
          <div className="w-full">
            <Label className="block text-primary font-poppins font-semibold text-sm mb-1 ml-2">
              PURCHASE OPTIONS
            </Label>
            <div className="border border-primary rounded-xl mb-10 p-5">
              <RadioGroup
                value={purchaseOption}
                onValueChange={(value: PurchaseOption) =>
                  setPurchaseOption(value)
                }
              >
                <div className="space-y-5">
                  <div className={cn('flex items-center gap-2 group')}>
                    <RadioGroupItem
                      className={cn(
                        'w-6 h-6 p-1.5',
                        'data-[state=checked]:bg-primary data-[state=checked]:text-sugar-milk',
                        'data-[state=unchecked]:bg-transparent',
                        'group-hover:data-[state=unchecked]:bg-tertiary',
                        'transition-all duration-300 ease-in-out'
                      )}
                      value={PurchaseOption.oneTime}
                      id={PurchaseOption.oneTime}
                    />

                    <Label
                      className="font-poppins font-semibold text-primary text-lg cursor-pointer"
                      htmlFor={PurchaseOption.oneTime}
                    >
                      One-time purchase
                    </Label>
                  </div>
                  <div className={cn('flex items-center gap-2 group')}>
                    <RadioGroupItem
                      className={cn(
                        'w-6 h-6 p-1.5',
                        'data-[state=checked]:bg-primary data-[state=checked]:text-sugar-milk',
                        'data-[state=unchecked]:bg-transparent ',
                        'group-hover:data-[state=unchecked]:bg-tertiary',
                        'transition-all duration-300 ease-in-out'
                      )}
                      value={PurchaseOption.subscription}
                      id={PurchaseOption.subscription}
                    />
                    <Label
                      className="flex items-center space-x-2"
                      htmlFor={PurchaseOption.subscription}
                    >
                      <span className="font-poppins font-semibold text-primary text-lg cursor-pointer">
                        Subscribe - 10% off
                      </span>
                    </Label>
                    <span>
                      <TooltipProvider delayDuration={0} skipDelayDuration={0}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <BadgeInfo className="text-primary w-5 h-5" />
                          </TooltipTrigger>
                          <TooltipContent
                            className="bg-secondary border-2 border-primary max-w-xs p-3 rounded-lg"
                            sideOffset={10}
                            side="right"
                          >
                            <p className="text-sugar-milk font-poppins font-normal text-sm">
                              Love flexibility? So do we! Modify, upgrade, or
                              cancel your subscription anytime—no strings
                              attached. Just set it and forget it (or tweak it
                              whenever you like). We&apos;ll keep things rolling
                              with automatic renewals, so you never miss a beat!
                              <Link
                                className="block mt-2 underline"
                                href="/faq"
                              >
                                Learn more about our subscriptions...
                              </Link>
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </span>
                  </div>
                </div>

                <div
                  className={cn(
                    'max-w-md overflow-hidden max-h-[0px] transition-all duration-700 ease-in-out',
                    {
                      'max-h-[400px]':
                        purchaseOption === PurchaseOption.subscription
                    }
                  )}
                >
                  <article className="font-poppins font-normal text-primary text-[0.7rem] mt-4">
                    Delivered monthly. Payments will be processed automatically
                    through your selected payment method at checkout.
                    Subscriptions renew automatically at the end of their term.
                    Your order confirmation email includes links to manage or
                    cancel your subscription easily. For any further questions,
                    check out our{' '}
                    <Link className="underline" href="/faq">
                      FAQ
                    </Link>{' '}
                    or contact us directly!
                  </article>
                </div>
              </RadioGroup>
            </div>
            <Label className="block text-primary font-poppins font-semibold text-sm mb-1 ml-1">
              QUANTITY
            </Label>
            <div className="flex flex-col items-center md:grid grid-cols-12 gap-4 md:gap-3 md:h-14">
              <Quantity
                className="w-32 md:w-auto h-10 md:h-full md:col-span-4"
                quantity={quantity}
                setQuantity={setQuantity}
              />
              <AddToCart
                buttonTheme="inverted-themed"
                className="w-full md:w-auto h-12 md:h-full md:col-span-8"
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
