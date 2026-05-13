'use client';

import { CheckIcon, Loader2 } from 'lucide-react';
import { useState, useTransition } from 'react';
import { skipNextBillingCycle } from '@/app/account/subscriptions/actions';

interface Props {
  contractId: string;
  nextBillingDate: string;
  canSkip: boolean;
  interval: 'WEEK' | 'MONTH' | 'YEAR' | 'DAY' | null;
  intervalCount: number | null;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
}

function advanceDate(
  iso: string,
  interval: 'WEEK' | 'MONTH' | 'YEAR' | 'DAY',
  count: number
): string {
  const date = new Date(iso);
  if (interval === 'DAY') date.setDate(date.getDate() + count);
  else if (interval === 'WEEK') date.setDate(date.getDate() + 7 * count);
  else if (interval === 'MONTH') date.setMonth(date.getMonth() + count);
  else if (interval === 'YEAR') date.setFullYear(date.getFullYear() + count);
  return date.toISOString();
}

export function SubscriptionNextBillingBanner({
  contractId,
  nextBillingDate,
  canSkip,
  interval,
  intervalCount
}: Props) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [displayDate, setDisplayDate] = useState(nextBillingDate);
  const [skipped, setSkipped] = useState(false);

  const handleSkip = () => {
    setError(null);
    startTransition(async () => {
      const result = await skipNextBillingCycle(contractId, displayDate);
      if (result.ok) {
        if (interval && intervalCount) {
          setDisplayDate(advanceDate(displayDate, interval, intervalCount));
        }
        setSkipped(true);
      } else {
        setError(result.error);
      }
    });
  };

  return (
    <div className="rounded-2xl bg-blue-ruin px-6 py-5 flex items-center justify-between gap-4">
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sugar-milk/60">
          Upcoming order
        </p>
        <p className="text-2xl font-bold text-sugar-milk mt-1">
          {formatDate(displayDate)}
        </p>
        {skipped && (
          <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-sugar-milk/80 mt-1.5">
            <CheckIcon className="w-3.5 h-3.5" />
            Previous order skipped
          </p>
        )}
      </div>
      {canSkip && (
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <button
            type="button"
            onClick={handleSkip}
            disabled={isPending}
            className="inline-flex items-center justify-center h-9 px-5 rounded-lg border border-sugar-milk/40 text-sugar-milk text-sm font-semibold hover:bg-sugar-milk/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-sugar-milk/60"
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              'Skip order'
            )}
          </button>
          {error && (
            <p
              role="alert"
              className="text-xs text-red-300 text-right max-w-[180px]"
            >
              {error}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
