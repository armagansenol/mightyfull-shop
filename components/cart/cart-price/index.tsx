'use client';

import { Price } from '@/components/price';

interface CartPriceProps {
  amount: string;
  currencyCode: string;
  className?: string;
}

export function CartPrice({ amount, currencyCode, className }: CartPriceProps) {
  return (
    <div className={className}>
      <Price
        className="font-bomstad-display font-medium text-2xl text-blue-ruin"
        amount={amount}
        currencyCode={currencyCode}
      />
    </div>
  );
}
