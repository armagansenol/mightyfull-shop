'use client';

import { useState } from 'react';

import { CartContent } from '@/components/cart/cart-content';
import { useCart } from '@/components/cart/cart-context';
import { CartHeader } from '@/components/cart/cart-header';
import { CartTrigger } from '@/components/cart/cart-trigger';
import { useCartCheckout } from '@/components/cart/hooks/useCartCheckout';
import { useCartInitialization } from '@/components/cart/hooks/useCartInitialization';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

import { useScrollLock } from '@/hooks/use-scroll-lock';

export function Cart() {
  const [open, setOpen] = useState(false);
  const openCart = () => setOpen(true);
  const closeCart = () => setOpen(false);

  const { cart, updateCartItem } = useCart();
  const isInitialized = useCartInitialization();
  const { mutate: handleCheckout, isPending: isCheckoutPending } =
    useCartCheckout();

  const uniqueItemCount = cart?.lines?.length || 0;

  useScrollLock(open);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleCheckout({});
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <CartTrigger
          totalQuantity={uniqueItemCount}
          isInitialized={isInitialized}
          onClick={openCart}
        />
      </SheetTrigger>
      <SheetContent
        className="lg:w-3/5 xl:w-2/5 h-full max-h-screen px-10 py-5 bg-sugar-milk border-l-4 border-blue-ruin flex flex-col"
        aria-describedby="cart-content-description"
      >
        <div id="cart-content-description" className="sr-only">
          Your shopping cart contents
        </div>
        <CartHeader />
        <CartContent
          cart={cart}
          updateCartItem={updateCartItem}
          isCheckoutPending={isCheckoutPending}
          onCheckout={handleSubmit}
          onContinueShopping={closeCart}
        />
      </SheetContent>
    </Sheet>
  );
}
