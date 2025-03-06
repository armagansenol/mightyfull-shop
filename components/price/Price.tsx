import { AnimatedNumber } from '@/components/animated-number';
import s from './price.module.scss';

import cn from 'clsx';

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
  <p suppressHydrationWarning={true} className={cn(s.price, className)}>
    {/* <span className={currencyCodeClassName}>{`${currencyCode}`}</span> */}
    <AnimatedNumber
      value={
        // parseFloat(
        // `${new Intl.NumberFormat(undefined, {
        //   style: 'currency',
        //   currency: currencyCode,
        //   currencyDisplay: 'narrowSymbol'
        // }).format(parseFloat(amount))}`)
        parseFloat(amount)
      }
    />
    $
  </p>
);

export default Price;
