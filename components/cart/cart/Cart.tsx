'use client';

import s from './cart.module.scss';

import { ShoppingCartIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';

import {
  createCartAndSetCookie,
  redirectToCheckout
} from '@/components/cart/actions';
import { useCart } from '@/components/cart/cart-context';
import { CartItem } from '@/components/cart/cart-item';
import { IconCookieCart } from '@/components/icons';
import { Price } from '@/components/price';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import { LoadingSpinner } from '@/components/utility/loading-spinner';
import { DEFAULT_OPTION } from '@/lib/constants';
import { cn, createUrl } from '@/lib/utils';
import { ScrollableBox } from '@/components/utility/scrollable-box';

type MerchandiseSearchParams = {
  [key: string]: string;
};

export default function Cart() {
  const { cart, updateCartItem } = useCart();
  const [open, setOpen] = useState(false);
  const quantityRef = useRef(cart?.totalQuantity);
  const openCart = () => setOpen(true);
  const closeCart = () => setOpen(false);

  useEffect(() => {
    console.log('cart modal', cart);
    if (!cart?.id) {
      createCartAndSetCookie();
    }
  }, [cart]);

  useEffect(() => {
    console.log('cart', cart);
  }, [cart]);

  useEffect(() => {
    if (
      cart?.totalQuantity &&
      cart?.totalQuantity !== quantityRef.current &&
      cart?.totalQuantity > 0
    ) {
      if (!open) {
        openCart();
      }
      quantityRef.current = cart?.totalQuantity;
    }
  }, [open, cart?.totalQuantity, quantityRef]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          className="relative h-8 w-8 tablet:h-10 tablet:w-10"
          type="button"
        >
          <IconCookieCart fill="var(--primary)" />
          {cart?.totalQuantity ? (
            <span className="absolute -left-1 -bottom-1 tablet:-left-2 tablet:-bottom-2 h-5 w-5 tablet:h-6 tablet:w-6 rounded-full text-sm tablet:text-base font-bold text-[var(--primary)] bg-[var(--secondary)] flex items-center justify-center">
              {cart.totalQuantity}
            </span>
          ) : null}
        </button>
      </SheetTrigger>
      <SheetContent className={cn(s.cart)}>
        <SheetHeader className={s.header}>
          <SheetTitle className={s.title}>Your Cart</SheetTitle>
        </SheetHeader>
        {!cart || cart.lines.length === 0 ? (
          <div className="mt-20 flex w-full flex-col items-center justify-center overflow-hidden">
            <ShoppingCartIcon className="h-16" />
            <p className="mt-6 text-center text-2xl font-bold">
              Your cart is empty.
            </p>
          </div>
        ) : (
          <div className="flex h-full flex-col justify-between overflow-hidden p-1">
            <div className="flex flex-1 h-[300px] border-2 border-red-500">
              <ScrollableBox className="flex-1">
                <ul className="flex-grow overflow-auto py-4">
                  {cart.lines
                    .sort((a, b) => {
                      return a.merchandise.product.title.localeCompare(
                        b.merchandise.product.title
                      );
                    })
                    .map((item, i) => {
                      const merchandiseSearchParams =
                        {} as MerchandiseSearchParams;
                      item.merchandise.selectedOptions.forEach(
                        ({ name, value }) => {
                          if (value !== DEFAULT_OPTION) {
                            merchandiseSearchParams[name.toLowerCase()] = value;
                          }
                        }
                      );
                      const merchandiseUrl = createUrl(
                        `/product/${item.merchandise.product.handle}`,
                        new URLSearchParams(merchandiseSearchParams)
                      );

                      return (
                        <CartItem
                          key={i}
                          item={item}
                          merchandiseUrl={merchandiseUrl}
                          closeCart={closeCart}
                          updateCartItem={updateCartItem}
                        />
                      );
                    })}
                </ul>
              </ScrollableBox>
            </div>
            <div className="py-4 text-sm text-neutral-500 dark:text-neutral-400">
              <div className="mb-3 flex items-center justify-between border-b border-neutral-200 pb-1 dark:border-neutral-700">
                <p>Taxes</p>
                <Price
                  className="text-right text-base text-black dark:text-white"
                  amount={cart.cost.totalTaxAmount.amount}
                  currencyCode={cart.cost.totalTaxAmount.currencyCode}
                />
              </div>
              <div className="mb-3 flex items-center justify-between border-b border-neutral-200 pb-1 pt-1 dark:border-neutral-700">
                <p>Shipping</p>
                <p className="text-right">Calculated at checkout</p>
              </div>
              <div className="mb-3 flex items-center justify-between border-b border-neutral-200 pb-1 pt-1 dark:border-neutral-700">
                <p>Total</p>
                <Price
                  className="text-right text-base text-black dark:text-white"
                  amount={cart.cost.totalAmount.amount}
                  currencyCode={cart.cost.totalAmount.currencyCode}
                />
              </div>
            </div>
            <form action={redirectToCheckout}>
              <CheckoutButton />
            </form>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

function CheckoutButton() {
  const { pending } = useFormStatus();

  return (
    <button
      className="block w-full rounded-full bg-blue-600 p-3 text-center text-sm font-medium text-white opacity-90 hover:opacity-100"
      type="submit"
      disabled={pending}
    >
      {pending ? <LoadingSpinner /> : 'Proceed to Checkout'}
    </button>
  );
}
