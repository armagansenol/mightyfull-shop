import NumberFlow from '@number-flow/react';
import { motion } from 'motion/react';

const Price = ({
  animation,
  amount,
  className,
  currencyCode = 'USD'
}: {
  amount: string;
  animation?: 'flow' | 'bob';
  className?: string;
  currencyCode?: string;
} & React.ComponentProps<'p'>) => {
  const numericAmount = parseFloat(amount);

  const formattedNumber = new Intl.NumberFormat(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(numericAmount);

  const formatter = new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: currencyCode,
    currencyDisplay: 'narrowSymbol'
  });

  const currencySymbol =
    formatter.formatToParts(0).find((part) => part.type === 'currency')
      ?.value || currencyCode;

  const displayNumber = parseFloat(formattedNumber.replace(/,/g, ''));

  return (
    <p className={className}>
      {animation === 'flow' ? (
        <NumberFlow
          value={displayNumber}
          transformTiming={{ duration: 500 }}
          spinTiming={{ duration: 500 }}
          opacityTiming={{ duration: 500 }}
        />
      ) : animation === 'bob' ? (
        <motion.span
          key={displayNumber}
          initial={{ scale: 1.15 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
          className="inline-block"
        >
          {displayNumber}
        </motion.span>
      ) : (
        <span>{displayNumber}</span>
      )}
      {currencySymbol}
    </p>
  );
};

export default Price;
