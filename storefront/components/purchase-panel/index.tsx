'use client';

import { TooltipContent } from '@radix-ui/react-tooltip';
import { useMeasure } from '@uidotdev/usehooks';
import { BadgeInfo } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useMedia } from 'react-use';
import { AddToCart } from '@/components/cart/add-to-cart';
import { CancellationPolicyDialog } from '@/components/cancellation-policy-dialog';
import { gsap, ScrollTrigger, useGSAP } from '@/components/gsap';
import { IconCheck } from '@/components/icons';
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
import { formatSellingPlanName } from '@/lib/shopify/selling-plan';
import type { Product } from '@/lib/shopify/types';
import { cn } from '@/lib/utils';
import { PurchaseOption } from '@/types';

const DEFAULT_SUBSCRIPTION_BENEFITS = [
  'Save 10% on every order',
  'Free Shipping',
  'Pause or Cancel Anytime'
];

export interface PurchasePanelProps {
  shopifyProduct: Product;
  subscriptionBenefits?: string[];
}

export function PurchasePanel({ shopifyProduct, subscriptionBenefits }: PurchasePanelProps) {
  const benefits =
    subscriptionBenefits && subscriptionBenefits.length > 0
      ? subscriptionBenefits
      : DEFAULT_SUBSCRIPTION_BENEFITS;
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

  const sellingPlans =
    shopifyProduct.sellingPlanGroups.nodes[0]?.sellingPlans.nodes ?? [];
  const [selectedSellingPlanId, setSelectedSellingPlanId] = useState<string>(
    sellingPlans[0]?.id ?? ''
  );

  const sellingPlanId =
    purchaseOption === PurchaseOption.subscription ? selectedSellingPlanId : '';

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
            <div className="border border-primary rounded-xl mb-10 p-5">
              <RadioGroup
                value={purchaseOption}
                onValueChange={(value: PurchaseOption) =>
                  setPurchaseOption(value)
                }
              >
                <div>
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
                        Subscribe &amp; save 10%
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

                  <div className="flex flex-wrap gap-2 mt-3 ml-8">
                    {benefits.map((benefit) => (
                      <span
                        key={benefit}
                        className="inline-flex items-center gap-1.5 bg-primary/10 text-primary font-poppins font-medium text-xs px-3 py-1.5 rounded-full"
                      >
                        <span className="w-2.5 h-2.5 shrink-0">
                          <IconCheck />
                        </span>
                        {benefit}
                      </span>
                    ))}
                  </div>

                  <div
                    className={cn(
                      'overflow-hidden max-h-[0px] transition-all duration-700 ease-in-out',
                      {
                        'max-h-[600px]':
                          purchaseOption === PurchaseOption.subscription
                      }
                    )}
                  >
                    {sellingPlans.length > 0 && (
                      <RadioGroup
                        className="mt-4 ml-8 space-y-2"
                        value={selectedSellingPlanId}
                        onValueChange={setSelectedSellingPlanId}
                        aria-label="Delivery frequency"
                      >
                        {sellingPlans.map((plan) => {
                          const inputId = `selling-plan-${plan.id}`;
                          return (
                            <div
                              key={plan.id}
                              className="flex items-center gap-2 group"
                            >
                              <RadioGroupItem
                                className={cn(
                                  'w-5 h-5 p-1',
                                  'data-[state=checked]:bg-primary data-[state=checked]:text-sugar-milk',
                                  'data-[state=unchecked]:bg-transparent',
                                  'group-hover:data-[state=unchecked]:bg-tertiary',
                                  'transition-all duration-300 ease-in-out'
                                )}
                                value={plan.id}
                                id={inputId}
                              />
                              <Label
                                className="font-poppins font-medium text-primary text-base cursor-pointer"
                                htmlFor={inputId}
                              >
                                {formatSellingPlanName(plan.name)}
                              </Label>
                            </div>
                          );
                        })}
                      </RadioGroup>
                    )}
                  </div>

                  <div className={cn('flex items-center gap-2 group mt-5')}>
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
            <div
              className={cn(
                'overflow-hidden max-h-0 transition-all duration-500 ease-in-out',
                {
                  'max-h-40': purchaseOption === PurchaseOption.subscription
                }
              )}
            >
              <p className="font-poppins text-[0.65rem] leading-relaxed text-cookie-brown/70 mt-3">
                This item is a recurring subscription purchase. By continuing, I
                agree to the{' '}
                <Link className="underline" href="/terms-of-service">
                  Subscription terms
                </Link>{' '}
                and{' '}
                <CancellationPolicyDialog
                  trigger={
                    <button
                      type="button"
                      className="underline cursor-pointer"
                    >
                      Cancellation Policy
                    </button>
                  }
                />{' '}
                and authorize Mightyfull LLC to charge my payment method at the
                prices, billing frequency, and dates shown on this page
                (including applicable taxes and shipping) until I cancel, as
                outlined in the{' '}
                <Link className="underline" href="/terms-of-service">
                  Terms of Service
                </Link>
                .
              </p>
            </div>
          </div>
        ) : (
          <div className="w-full">
            <Label className="block text-primary font-poppins font-semibold text-sm mb-1 ml-1">
              QUANTITY
            </Label>
            <div className="flex flex-col items-center md:grid grid-cols-12 gap-4 md:gap-3 md:h-14">
              <Quantity
                className="w-32 md:w-auto h-10 md:h-full md:col-span-4"
                quantity={quantity}
                setQuantity={setQuantity}
              />
              <div
                className={cn(
                  'w-full md:w-auto h-12 md:h-full md:col-span-8',
                  'flex items-center justify-center',
                  'border border-primary rounded-xl',
                  'font-poppins font-semibold text-primary text-sm tracking-widest'
                )}
                aria-label="Product sold out"
              >
                SOLD OUT
              </div>
            </div>
            <div className="mt-4">
              <OutOfStock
                showLabel={false}
                variantId={shopifyProduct.variants[0].id}
                revalidationPath={`/shop/${shopifyProduct.handle}`}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
