'use client';

import { CheckIcon, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { skipNextBillingCycle } from '@/app/account/subscriptions/actions';

export function SubscriptionSkipButton({
  contractId,
  nextBillingDate
}: {
  contractId: string;
  nextBillingDate: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [skipped, setSkipped] = useState(false);

  const handleSkip = () => {
    setError(null);
    startTransition(async () => {
      const result = await skipNextBillingCycle(contractId, nextBillingDate);
      if (result.ok) {
        setSkipped(true);
        // Give Shopify a moment to recompute nextBillingDate, then refresh.
        setTimeout(() => router.refresh(), 1500);
      } else {
        setError(result.error);
      }
    });
  };

  if (skipped) {
    return (
      <div className="inline-flex items-center gap-2 text-sm font-semibold text-sugar-milk shrink-0">
        <CheckIcon className="w-4 h-4" />
        <span>Order skipped</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1.5 shrink-0">
      <button
        type="button"
        onClick={handleSkip}
        disabled={isPending}
        className="inline-flex items-center justify-center h-9 px-5 rounded-lg border border-sugar-milk/40 text-sugar-milk text-sm font-semibold hover:bg-sugar-milk/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-sugar-milk/60"
      >
        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Skip order'}
      </button>
      {error && (
        <p role="alert" className="text-xs text-red-300 text-right max-w-[180px]">
          {error}
        </p>
      )}
    </div>
  );
}
