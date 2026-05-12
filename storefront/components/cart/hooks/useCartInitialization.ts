import { useEffect, useState } from 'react';
import { getCart } from '../actions';
import { useCart } from '../cart-context';

/**
 * Hydrates the in-memory cart from the existing `cartId` cookie if one is
 * present. Deliberately does NOT create a new cart up-front: addItem creates
 * the cart on demand, so eagerly creating one here would race a fast click
 * and orphan the freshly-added line behind a competing empty cart.
 */
export function useCartInitialization() {
  const { cart, setCart } = useCart();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (isInitialized) return;

    const hydrate = async () => {
      try {
        const hasCookie = document.cookie
          .split('; ')
          .some((row) => row.startsWith('cartId='));
        if (hasCookie && !cart?.id) {
          const existingCart = await getCart();
          if (existingCart) setCart(existingCart);
        }
      } catch (error) {
        console.error('Failed to hydrate cart:', error);
      } finally {
        setIsInitialized(true);
      }
    };

    hydrate();
  }, [cart?.id, isInitialized, setCart]);

  return isInitialized;
}
