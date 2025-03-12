import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { useCart } from '@/components/cart/cart-context';

/**
 * Custom hook to show notifications when items are added to the cart
 * @param onCartOpen Function to open the cart
 */
export function useCartNotifications(onCartOpen: () => void) {
  const { cart } = useCart();
  const linesCountRef = useRef<number>(0);
  const isFirstLoad = useRef(true);

  useEffect(() => {
    if (!cart || !cart.lines) return;

    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      linesCountRef.current = cart.lines.length;
      return;
    }

    // Check if the number of unique items (lines) has increased
    if (cart.lines.length > linesCountRef.current) {
      toast.success('Item added to cart', {
        action: {
          label: 'View Cart',
          onClick: onCartOpen
        }
      });
    }

    linesCountRef.current = cart.lines.length;
  }, [cart, onCartOpen]);

  return { cartQuantity: cart?.totalQuantity };
}
