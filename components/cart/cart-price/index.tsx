'use client';

import { Price } from '@/components/price';
import cn from 'clsx';

interface CartPriceProps {
  amount: string;
  currencyCode: string;
  className?: string;
}

export function CartPrice({ amount, currencyCode, className }: CartPriceProps) {
  return (
    <div className={cn('text-2xl transition-opacity duration-300', className)}>
      <Price
        className={className}
        amount={amount}
        currencyCode={currencyCode}
      />
    </div>
  );
}
