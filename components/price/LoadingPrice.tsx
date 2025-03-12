'use client';

import s from './price.module.scss';
import cn from 'clsx';
import { useEffect, useState } from 'react';

const LoadingPrice = ({
  className,
  lastKnownAmount,
  currencyCode = 'USD'
}: {
  className?: string;
  lastKnownAmount: string;
  currencyCode: string;
}) => {
  const [opacity, setOpacity] = useState(0.5);

  // Create a subtle pulsing effect
  useEffect(() => {
    const interval = setInterval(() => {
      setOpacity((prev) => (prev === 0.5 ? 0.7 : 0.5));
    }, 800);

    return () => clearInterval(interval);
  }, []);

  // Format the last known price
  const formattedPrice = `${new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: currencyCode,
    currencyDisplay: 'narrowSymbol'
  }).format(parseFloat(lastKnownAmount))}`;

  return (
    <p
      suppressHydrationWarning={true}
      className={cn(s.price, className, 'transition-opacity duration-500')}
      style={{ opacity }}
    >
      {formattedPrice}
    </p>
  );
};

export default LoadingPrice;
