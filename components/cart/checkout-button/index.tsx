'use client';

import cn from 'clsx';
import { Loader2Icon } from 'lucide-react';

import { Price } from '@/components/price';
import { Button } from '@/components/ui/button';
import { motion } from 'motion/react';

interface CheckoutButtonProps {
  amount: string;
  currencyCode: string;
  isPending?: boolean;
}

export function CheckoutButton({
  amount,
  currencyCode,
  isPending
}: CheckoutButtonProps) {
  return (
    <Button
      colorTheme="blue-ruin"
      size="lg"
      className={cn('h-16 cursor-pointer flex items-center justify-center')}
      type="submit"
      disabled={isPending}
      aria-label="Proceed to checkout"
    >
      {isPending ? (
        <Loader2Icon className="h-3 w-3 animate-spin text-blue-ruin" />
      ) : (
        <div className="flex flex-row items-center justify-center gap-2">
          <span className="font-bomstad-display font-bold text-3xl">
            Checkout
          </span>
          {amount && (
            <motion.span
              layout
              className="flex items-center justify-center text-2xl font-medium"
            >
              (
              <Price animated amount={amount} currencyCode={currencyCode} />)
            </motion.span>
          )}
        </div>
      )}
    </Button>
  );
}
