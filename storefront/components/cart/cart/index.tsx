'use client';

import { CartContent } from '@/components/cart/cart-content';
import { useCart } from '@/components/cart/cart-context';
import { CartHeader } from '@/components/cart/cart-header';
import { CartTrigger } from '@/components/cart/cart-trigger';
import { useCartCheckout } from '@/components/cart/hooks/useCartCheckout';
import { useCartInitialization } from '@/components/cart/hooks/useCartInitialization';
import { Sheet, SheetContent } from '@/components/ui/sheet';

/**
 * Renders the cart Sheet once globally — mount this at the app root, not
 * per-header-slot, because Radix portals SheetContent to document.body and
 * we'd otherwise get duplicate panels.
 */
export function Cart() {
  const { cart, updateCartItem, isCartOpen, setCartOpen, closeCart } =
    useCart();
  const { mutate: handleCheckout, isPending: isCheckoutPending } =
    useCartCheckout();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleCheckout({});
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={setCartOpen}>
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

/**
 * Cart launcher button. Safe to render in multiple header slots — it only
 * opens the shared Sheet via context, no portal.
 */
export function CartLauncher() {
  const { cart, openCart } = useCart();
  const isInitialized = useCartInitialization();
  const uniqueItemCount = cart?.lines?.length || 0;

  return (
    <CartTrigger
      totalQuantity={uniqueItemCount}
      isInitialized={isInitialized}
      onClick={openCart}
    />
  );
}
