import { useEffect, useState } from 'react';
import { useCart } from '../cart-context';
import { createCartAndSetCookie } from '../actions';

export function useCartInitialization() {
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
