import s from './quantity.module.scss';

import cn from 'clsx';

import { IconMinus, IconPlus } from '@/components/icons';

interface QuantityProps {
  className?: string;
  quantity: number;
  setQuantity: (val: number) => void;
  maxQuantity?: number;
}

export default function Quantity(props: QuantityProps) {
  // Add a safe setter function to enforce min/max constraints
  const safeSetQuantity = (newQuantity: number) => {
    // Ensure quantity is at least 1
    if (newQuantity < 1) {
      newQuantity = 1;
    }

    // Ensure quantity doesn't exceed maxQuantity if defined
    if (props.maxQuantity !== undefined && newQuantity > props.maxQuantity) {
      newQuantity = props.maxQuantity;
    }

    // Only update if the value is different and within bounds
    if (newQuantity !== props.quantity) {
      props.setQuantity(newQuantity);
    }
  };

  return (
    <div className={cn(s.quantity, 'grid grid-cols-12', props.className)}>
      <button
        className="cursor-pointer col-span-4 flex items-center justify-center disabled:opacity-50"
        onClick={() => safeSetQuantity(props.quantity - 1)}
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
        onClick={() => safeSetQuantity(props.quantity + 1)}
        disabled={
          props.maxQuantity !== undefined && props.quantity >= props.maxQuantity
        }
      >
        <div className={s.iconC}>
          <IconPlus fill="var(--text-color)" />
        </div>
      </button>
    </div>
  );
}
