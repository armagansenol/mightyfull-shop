'use client';

import s from './cart.module.scss';

import cn from 'clsx';
import { ShoppingCartIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';

import {
  createCartAndSetCookie,
  redirectToCheckout
} from '@/components/cart/actions';
import { useCart } from '@/components/cart/cart-context';
import { CartItem } from '@/components/cart/cart-item';
import { IconClose, IconCookieCart } from '@/components/icons';
import { Price } from '@/components/price';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import { LoadingSpinner } from '@/components/utility/loading-spinner';
import { ScrollableBox } from '@/components/utility/scrollable-box';
import { DEFAULT_OPTION } from '@/lib/constants';

type MerchandiseSearchParams = {
  [key: string]: string;
};

export default function Cart() {
  const { cart, updateCartItem } = useCart();
  const quantityRef = useRef(cart?.totalQuantity);
  const [open, setOpen] = useState(false);
  const openCart = () => setOpen(true);
  const closeCart = () => setOpen(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!isInitialized) {
      const checkAndCreateCart = async () => {
        const cartCookie = document.cookie
          .split('; ')
          .find((row) => row.startsWith('cartId='));
        if (!cartCookie && !cart?.id) {
          await createCartAndSetCookie();
        }
        setIsInitialized(true);
      };

      checkAndCreateCart();
    }
  }, [cart?.id, isInitialized]);

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
      <SheetContent
        className={cn(s.cart, 'h-screen flex flex-col items-stretch')}
      >
        <SheetHeader
          className={cn(s.cartHeader, 'flex items-center justify-between py-4')}
        >
          <SheetTitle className={s.cartTitle}>Your Cart</SheetTitle>
          <SheetClose
            className={cn(
              s.closeButton,
              'cursor-pointer flex items-center justify-center'
            )}
          >
            <IconClose fill="var(--sugar-milk)" />
            <span className="sr-only">Close</span>
          </SheetClose>
        </SheetHeader>
        <div className="flex flex-col items-stretch flex-1">
          {!cart || cart.lines.length === 0 ? (
            <div className="mt-20 flex w-full flex-col items-center justify-center overflow-hidden">
              <ShoppingCartIcon className="h-16" />
              <p className="mt-6 text-center text-2xl font-bold">
                Your cart is empty.
              </p>
            </div>
          ) : (
            <div className={'flex flex-col mx-auto flex-1 gap-4'}>
              <div className={cn(s.cartItems, 'flex flex-1')}>
                <ScrollableBox className="flex-1">
                  <ul className="flex-grow overflow-auto py-6">
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
                              merchandiseSearchParams[name.toLowerCase()] =
                                value;
                            }
                          }
                        );
                        return (
                          <CartItem
                            key={i}
                            item={item}
                            updateCartItem={updateCartItem}
                          />
                        );
                      })}
                  </ul>
                </ScrollableBox>
              </div>
              <div className="flex flex-col items-stretch gap-8 mt-auto">
                <form action={redirectToCheckout}>
                  <CheckoutButton
                    amount={cart.cost.totalAmount.amount}
                    currencyCode={cart.cost.totalAmount.currencyCode}
                  />
                </form>
                <button
                  className={cn(
                    s.continueShopping,
                    'cursor-pointer mx-auto text-center'
                  )}
                  onClick={closeCart}
                >
                  Continue Shopping
                </button>
                <span className={cn(s.footnote, 'mx-auto text-center')}>
                  Shipping, taxes and discounts calculated at checkout.
                </span>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

interface CheckoutButtonProps {
  amount: string;
  currencyCode: string;
}

function CheckoutButton({ amount, currencyCode }: CheckoutButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      className={cn(
        s.checkoutButton,
        'cursor-pointer flex items-center justify-center'
      )}
      type="submit"
      disabled={pending}
    >
      {pending ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="flex flex-row items-center justify-center">
            <span>Checkout</span>
            {amount && (
              <span>
                <Price
                  amount={amount}
                  currencyCode={currencyCode}
                  className="text-base text-white"
                />
              </span>
            )}
          </div>
        </>
      )}
    </button>
  );
}
