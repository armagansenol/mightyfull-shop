'use client';

import { Loader2, RotateCw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { addItem } from '@/components/cart/actions';
import { Button } from '@/components/ui/button';

interface ReorderItem {
  variantId: string;
  quantity: number;
}

interface ReorderButtonProps {
  items: ReorderItem[];
}

type Status = 'idle' | 'success' | 'partial' | 'error';

export function ReorderButton({ items }: ReorderButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState<string | null>(null);

  const handleClick = () => {
    setStatus('idle');
    setMessage(null);
    startTransition(async () => {
      let added = 0;
      let failed = 0;
      for (const item of items) {
        const result = await addItem(item.variantId, item.quantity);
        if (
          typeof result === 'object' &&
          'success' in result &&
          result.success
        ) {
          added += 1;
        } else {
          failed += 1;
        }
      }

      if (failed === 0) {
        setStatus('success');
        setMessage(
          `Added ${added} item${added === 1 ? '' : 's'} to your cart.`
        );
        router.refresh();
        return;
      }
      if (added === 0) {
        setStatus('error');
        setMessage(
          'We couldn’t add these items to your cart. Some products may no longer be available.'
        );
        return;
      }
      setStatus('partial');
      setMessage(
        `Added ${added} of ${items.length} item${items.length === 1 ? '' : 's'}. Some products may no longer be available.`
      );
      router.refresh();
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <Button
        type="button"
        colorTheme="blue-ruin"
        size="sm"
        padding="fat"
        hoverAnimation={false}
        disabled={isPending || items.length === 0}
        onClick={handleClick}
        className="h-10"
      >
        {isPending ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            <RotateCw
              className="w-4 h-4 mr-2"
              strokeWidth={2}
              aria-hidden="true"
            />
            Re-order
          </>
        )}
      </Button>
      {message && (
        <p
          role={status === 'error' ? 'alert' : 'status'}
          className={
            status === 'error'
              ? 'text-sm font-medium text-red-700'
              : status === 'partial'
                ? 'text-sm font-medium text-amber-800'
                : 'text-sm font-medium text-emerald-800'
          }
        >
          {message}
        </p>
      )}
    </div>
  );
}
