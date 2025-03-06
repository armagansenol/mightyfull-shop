'use client';

import s from './cart.module.scss';

import cn from 'clsx';
import { ShoppingCartIcon } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { toast } from 'sonner';

import {
  createCartAndSetCookie,
  redirectToCheckout
} from '@/components/cart/actions';
import { useCart } from '@/components/cart/cart-context';
import CartItem from '@/components/cart/cart-item';
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
import type { Cart as ShopifyCart } from '@/lib/shopify/types';
import { useLenisStore } from '@/lib/store/lenis';

type UpdateType = 'plus' | 'minus' | 'delete';

// Custom hook for cart initialization
function useCartInitialization() {
  const { cart } = useCart();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!isInitialized) {
      const checkAndCreateCart = async () => {
        try {
          const cartCookie = document.cookie
            .split('; ')
            .find((row) => row.startsWith('cartId='));
          if (!cartCookie && !cart?.id) {
            await createCartAndSetCookie();
          }
        } catch (error) {
          console.error('Failed to initialize cart:', error);
        } finally {
          setIsInitialized(true);
        }
      };

      checkAndCreateCart();
    }
  }, [cart?.id, isInitialized]);

  return isInitialized;
}

function EmptyCart() {
  return (
    <div
      className="mt-20 flex w-full flex-col items-center justify-center overflow-hidden"
      aria-label="Empty shopping cart"
    >
      <ShoppingCartIcon className="h-16" />
      <p className="mt-6 text-center text-2xl font-bold">Your cart is empty.</p>
    </div>
  );
}

function CartItemsList({
  cart,
  updateCartItem
}: {
  cart: ShopifyCart;
  updateCartItem: (
    merchandiseId: string,
    updateType: UpdateType,
    sellingPlanId?: string | null
  ) => void;
}) {
  const sortedCartItems = useMemo(() => {
    return [...cart.lines].sort((a, b) => {
      return a.merchandise.product.title.localeCompare(
        b.merchandise.product.title
      );
    });
  }, [cart.lines]);

  return (
    <ScrollableBox className="flex-1">
      <ul
        className="flex-grow overflow-auto py-6"
        aria-label="Shopping cart items"
      >
        {sortedCartItems.map((item, i) => {
          return (
            <CartItem key={i} item={item} updateCartItem={updateCartItem} />
          );
        })}
      </ul>
    </ScrollableBox>
  );
}

function CheckoutButton({
  amount,
  currencyCode
}: {
  amount: string;
  currencyCode: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      className={cn(
        s.checkoutButton,
        'cursor-pointer flex items-center justify-center transition-all'
      )}
      type="submit"
      disabled={pending}
      aria-label="Proceed to checkout"
    >
      {pending ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="flex flex-row items-center justify-center gap-2">
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

export function Cart() {
  const { cart, updateCartItem } = useCart();
  const quantityRef = useRef<number | undefined>(cart?.totalQuantity);
  const [open, setOpen] = useState(false);
  const openCart = () => setOpen(true);
  const closeCart = () => setOpen(false);
  const isInitialized = useCartInitialization();
  const { lenis } = useLenisStore();
  const isFirstLoad = useRef(true);

  useEffect(() => {
    if (open) {
      lenis?.stop();
    } else {
      lenis?.start();
    }
  }, [open, lenis]);

  // Handle cart quantity changes
  useEffect(() => {
    if (isFirstLoad.current || !cart?.totalQuantity) {
      isFirstLoad.current = false;
      quantityRef.current = cart?.totalQuantity;
      return;
    }

    if (
      typeof quantityRef.current === 'number' &&
      cart.totalQuantity > quantityRef.current
    ) {
      toast.success('Item added to cart', {
        action: {
          label: 'View Cart',
          onClick: openCart
        }
      });
    }

    // Always update the reference
    quantityRef.current = cart?.totalQuantity;
  }, [cart?.totalQuantity]);

  // Handle checkout errors
  const handleCheckout = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      await redirectToCheckout();
    } catch (error) {
      event.preventDefault();
      toast.error('Checkout failed. Please try again.');
      console.error('Checkout error:', error);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          aria-label={`Open shopping cart${cart?.totalQuantity ? ` with ${cart.totalQuantity} items` : ''}`}
          className="relative h-8 w-8 tablet:h-10 tablet:w-10"
          type="button"
        >
          <IconCookieCart fill="var(--primary)" />
          {cart?.totalQuantity && isInitialized ? (
            <span
              className="absolute -left-1 -bottom-1 tablet:-left-2 tablet:-bottom-2 h-5 w-5 tablet:h-6 tablet:w-6 rounded-full text-sm tablet:text-base font-bold text-[var(--primary)] bg-[var(--secondary)] flex items-center justify-center"
              aria-hidden="true"
            >
              {cart.totalQuantity}
            </span>
          ) : null}
        </button>
      </SheetTrigger>
      <SheetContent
        className={cn(
          s.cart,
          'lg:w-3/5 xl:w-2/5 h-screen px-10 py-5 bg-sugar-milk border-l-4 border-blue-ruin'
        )}
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
            aria-label="Close cart"
          >
            <IconClose fill="var(--sugar-milk)" />
            <span className="sr-only">Close</span>
          </SheetClose>
        </SheetHeader>
        <>
          {!cart || cart.lines.length === 0 ? (
            <EmptyCart />
          ) : (
            <div className="space-y-4">
              <div className={cn(s.cartItems, 'flex flex-1')}>
                <CartItemsList cart={cart} updateCartItem={updateCartItem} />
              </div>
              <div className="flex flex-col items-stretch gap-8 mt-auto">
                <form onSubmit={handleCheckout}>
                  <CheckoutButton
                    amount={cart.cost.totalAmount.amount}
                    currencyCode={cart.cost.totalAmount.currencyCode}
                  />
                </form>
                <button
                  className={cn(
                    s.continueShopping,
                    'cursor-pointer mx-auto text-center transition-colors hover:opacity-80'
                  )}
                  onClick={closeCart}
                  aria-label="Continue shopping"
                >
                  Continue Shopping
                </button>
                <span className={cn(s.footnote, 'mx-auto text-center')}>
                  Shipping, taxes and discounts calculated at checkout.
                </span>
              </div>
            </div>
          )}
        </>
      </SheetContent>
    </Sheet>
  );
}
