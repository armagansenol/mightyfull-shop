'use client';

import { CheckoutButton } from '@/components/cart/checkout-button';
import { LetterSwapOnHover } from '@/components/letter-swap-on-hover';
import { Cart } from '@/lib/shopify/types';

interface CartFooterProps {
  cart: Cart;
  isCheckoutPending: boolean;
  onCheckout: (event: React.FormEvent<HTMLFormElement>) => void;
  onContinueShopping: () => void;
}

export function CartFooter({
  cart,
  isCheckoutPending,
  onCheckout,
  onContinueShopping
}: CartFooterProps) {
  return (
    <div className="flex flex-col items-stretch gap-6">
      <form onSubmit={onCheckout}>
        <CheckoutButton
          amount={cart.cost.totalAmount.amount}
          currencyCode={cart.cost.totalAmount.currencyCode}
          isPending={isCheckoutPending}
        />
      </form>
      <button
        className="cursor-pointer font-bomstad-display font-medium text-lg mx-auto text-center text-blue-ruin"
        onClick={onContinueShopping}
        aria-label="Continue shopping"
      >
        <LetterSwapOnHover label="Continue Shopping" />
      </button>
      <span className="cursor-pointer font-bomstad-display font-medium text-sm text-blue-ruin mx-auto text-center">
        Shipping, taxes and discounts calculated at checkout.
      </span>
    </div>
  );
}
