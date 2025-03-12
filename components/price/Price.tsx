import NumberFlow from '@number-flow/react';

const Price = ({
  amount,
  className
  // currencyCode = 'USD'
  // currencyCodeClassName
}: {
  amount: string;
  className?: string;
  currencyCode: string;
  currencyCodeClassName?: string;
} & React.ComponentProps<'p'>) => (
  <p className={className}>
    <NumberFlow value={parseFloat(amount)} />$
    {/* <span className={currencyCodeClassName}>{`${currencyCode}`}</span> */}
    {/* <AnimatedNumber
      value={
        // parseFloat(
        // `${new Intl.NumberFormat(undefined, {
        //   style: 'currency',
        //   currency: currencyCode,
        //   currencyDisplay: 'narrowSymbol'
        // }).format(parseFloat(amount))}`)
        parseFloat(amount)
      }
    /> */}
  </p>
);

export default Price;
