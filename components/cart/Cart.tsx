'use client';

import s from './cart.module.scss';

import cn from 'clsx';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { ScrollableBox } from '@/components/utility/scrollable-box';
import useCartStore from '@/lib/store/cart';
import { createCartAndSetCookie } from '@/app/actions/cart';
// import { useCartLineStore } from "@/lib/store/cart-lines"

export default function Cart() {
  const { cart } = useCartStore();
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    if (!cart) {
      createCartAndSetCookie();
    }
  }, [cart]);

  return (
    <>
      <div
        className={cn(s.backdrop, { [s.open]: isOpen })}
        onClick={() => setIsOpen(false)}
      />
      <div
        className={cn(s.cart, { [s.open]: isOpen }, 'flex flex-col flex-1')}
        data-lenis-prevent
      >
        <div className="flex items-center justify-between py-5 mb-5 border-b border-slate-50">
          <h2 className={s.title}>Your Cart</h2>
          <Button
            size="icon"
            className="rounded-full"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-6 w-6" />
            <span className="sr-only">Close cart</span>
          </Button>
        </div>
        <div
          className={cn(s.cartItems, 'flex flex-1 flex-col gap-8 mt-auto', {
            [s.disabled]: isOpen
          })}
        >
          <ScrollableBox className="flex-1">
            <div className="flex flex-col gap-8">
              {/* {cartProductsData?.nodes.map((item) => {
                return (
                  <CartItemC
                    key={item.id}
                    id={item.id}
                    title={item.title}
                    featuredImage={item.featuredImage}
                    variants={item.variants}
                    handle={item.handle}
                  />
                )
              })} */}
            </div>
          </ScrollableBox>
          <div className="mt-auto space-y-4">
            {/* <Button className="text-2xl" variant="ghost" size="slim" disabled={!checkoutUrl}>
              <Link
                href={checkoutUrl ?? "/"}
              >{`CHECKOUT (${cartCreateData?.cartCreate.cart.cost.totalAmount.amount})`}</Link>
            </Button>
            <Button className="text-[var(--blue-ruin)]" variant="naked" size="slim" onClick={() => setIsOpen(false)}>
              Continue Shopping
            </Button> */}
            <p className="text-center text-sm text-muted-foreground">
              Shipping, taxes and discounts calculated at checkout.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
