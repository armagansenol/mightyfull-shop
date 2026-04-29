import NumberFlow from '@number-flow/react';

const Price = ({
  animated = false,
  amount,
  className,
  currencyCode = 'USD'
}: {
  amount: string;
  animated?: boolean;
  className?: string;
  currencyCode?: string;
} & React.ComponentProps<'p'>) => {
  // Parse the amount string to a number first
  const numericAmount = parseFloat(amount);

  // Format the number with exactly two decimal places
  // This will be used to create a properly formatted number for display
  const formattedNumber = new Intl.NumberFormat(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(numericAmount);

  // Get currency symbol using Intl
  const formatter = new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: currencyCode,
    currencyDisplay: 'narrowSymbol'
  });

  // Extract just the currency symbol
  const currencySymbol =
    formatter.formatToParts(0).find((part) => part.type === 'currency')
      ?.value || currencyCode;

  // Parse the formatted number back to a number for NumberFlow
  // This ensures we have the correct number of decimal places
  const displayNumber = parseFloat(formattedNumber.replace(/,/g, ''));

  return (
    <p className={className}>
      {animated ? (
        <NumberFlow value={displayNumber} />
      ) : (
        <span>{displayNumber}</span>
      )}
      {currencySymbol}
    </p>
  );
};

export default Price;
