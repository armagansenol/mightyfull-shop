'use client';

import s from './purchase-panel.module.scss';

import { ScrollTrigger } from '@/lib/gsap';
import { cn } from '@/lib/utils';
import { useGSAP } from '@gsap/react';
import { MoneyV2 } from '@shopify/hydrogen-react/storefront-api-types';
import { useMeasure } from '@uidotdev/usehooks';
import { BellRing } from 'lucide-react';
import { useEffect, useRef } from 'react';

import { Purchase } from '@/components/purchase';
import { Button } from '@/components/ui/button';
import { ProductDetail } from '@/types';

export interface PurchasePanelProps {
  shopifyProduct: ProductDetail;
}

export default function PurchasePanel(props: PurchasePanelProps) {
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
        pin: boxRef.current,
      });
    },
    { dependencies: [height], revertOnUpdate: true },
  );

  return (
    <div className="flex-1" ref={triggerRef}>
      <div className="w-full" ref={boxRef}>
        {props.shopifyProduct?.availableForSale ? (
          <>
            <Purchase
              gid={props.shopifyProduct.id}
              price={props.shopifyProduct?.variants.nodes[0].price as MoneyV2}
              sp={props.shopifyProduct.sellingPlanGroups.nodes[0]}
              product={props.shopifyProduct}
            />
          </>
        ) : (
          <div className="flex flex-col items-stretch">
            <div
              className={cn(
                s.outOfStock,
                'flex justify-center tablet:justify-start mb-10 tablet:mb-20 py-2',
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
