import s from './quantity.module.scss';

import cn from 'clsx';

import { IconMinus, IconPlus } from '@/components/icons';

interface QuantityProps {
  className?: string;
  quantity: number;
  setQuantity: (val: number) => void;
}

export default function Quantity(props: QuantityProps) {
  return (
    <div className={cn(s.quantity, 'grid grid-cols-12', props.className)}>
      <button
        className="cursor-pointer col-span-4 flex items-center justify-center disabled:opacity-50"
        onClick={() => props.setQuantity(props.quantity - 1)}
        disabled={props.quantity <= 1}
      >
        <div className={s.iconC}>
          <IconMinus fill="var(--text-color)" />
        </div>
      </button>
      <div className="col-span-4 flex items-center justify-center">
        {props.quantity}
      </div>
      <button
        className="cursor-pointer col-span-4 flex items-center justify-center disabled:opacity-50"
        onClick={() => props.setQuantity(props.quantity + 1)}
      >
        <div className={s.iconC}>
          <IconPlus fill="var(--text-color)" />
        </div>
      </button>
    </div>
  );
}
