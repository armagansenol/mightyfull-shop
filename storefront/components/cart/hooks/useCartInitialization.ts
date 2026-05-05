import { useEffect, useState } from 'react';
import { createCartAndSetCookie, getCart } from '../actions';
import { useCart } from '../cart-context';

export function useCartInitialization() {
  const { cart, setCart } = useCart();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!isInitialized) {
      const checkAndCreateCart = async () => {
        try {
          const cartCookie = document.cookie
            .split('; ')
            .find((row) => row.startsWith('cartId='));

          if (cartCookie && !cart?.id) {
            const existingCart = await getCart();
            if (existingCart) {
              setCart(existingCart);
            }
          } else if (!cartCookie && !cart?.id) {
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
  }, [cart?.id, isInitialized, setCart]);

  return isInitialized;
}
