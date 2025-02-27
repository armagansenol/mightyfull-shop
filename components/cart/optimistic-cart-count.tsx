'use client';

import { useOptimisticCart } from './hooks/useOptimisticCart';
import { useEffect, useState } from 'react';

export function OptimisticCartCount() {
  const { optimisticCart } = useOptimisticCart();
  const [mounted, setMounted] = useState(false);

  // Only show the count after the component has mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const itemCount = optimisticCart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  if (itemCount === 0) return null;

  return (
    <div className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs text-white">
      {itemCount > 99 ? '99+' : itemCount}
    </div>
  );
}

export default OptimisticCartCount;
