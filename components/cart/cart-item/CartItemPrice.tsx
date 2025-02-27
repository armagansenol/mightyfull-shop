'use client';

import { Price } from '@/components/price';
import cn from 'clsx';
import { useEffect, useState } from 'react';

interface CartItemPriceProps {
  amount: string;
  currencyCode: string;
  isUpdating: boolean;
  className?: string;
}

export default function CartItemPrice({
  amount,
  currencyCode,
  isUpdating,
  className
}: CartItemPriceProps) {
  // Add a slight delay before showing the loading state to avoid flickering
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (isUpdating) {
      timeout = setTimeout(() => {
        setShowLoading(true);
      }, 300);
    } else {
      setShowLoading(false);
    }

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [isUpdating]);

  return (
    <div
      className={cn(
        'text-2xl transition-opacity duration-300',
        showLoading && 'opacity-50',
        className
      )}
    >
      <Price
        className={className}
        amount={amount}
        currencyCode={currencyCode}
      />
    </div>
  );
}
