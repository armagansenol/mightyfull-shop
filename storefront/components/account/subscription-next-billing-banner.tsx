'use client';

import { Loader2 } from 'lucide-react';
import { useMemo, useState, useTransition } from 'react';
import {
  skipNextBillingCycle,
  unskipBillingCycle
} from '@/app/account/subscriptions/actions';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';

type Interval = 'WEEK' | 'MONTH' | 'YEAR' | 'DAY';

interface Props {
  contractId: string;
  nextBillingDate: string;
  canSkip: boolean;
  interval: Interval | null;
  intervalCount: number | null;
}

const UPCOMING_COUNT = 5;

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
}

function formatShortDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

function advanceDate(iso: string, interval: Interval, count: number): string {
  const date = new Date(iso);
  if (interval === 'DAY') date.setDate(date.getDate() + count);
  else if (interval === 'WEEK') date.setDate(date.getDate() + 7 * count);
  else if (interval === 'MONTH') date.setMonth(date.getMonth() + count);
  else if (interval === 'YEAR') date.setFullYear(date.getFullYear() + count);
  return date.toISOString();
}

interface UpcomingItem {
  date: string;
  skipped: boolean;
}

function computeUpcoming(
  startDate: string,
  interval: Interval | null,
  intervalCount: number | null
): UpcomingItem[] {
  if (!interval || !intervalCount) {
    return [{ date: startDate, skipped: false }];
  }
  const items: UpcomingItem[] = [];
  let current = startDate;
  for (let i = 0; i < UPCOMING_COUNT; i++) {
    items.push({ date: current, skipped: false });
    current = advanceDate(current, interval, intervalCount);
  }
  return items;
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
  const [upcoming, setUpcoming] = useState<UpcomingItem[]>(() =>
    computeUpcoming(nextBillingDate, interval, intervalCount)
  );
  const [skipConfirmOpen, setSkipConfirmOpen] = useState(false);
  const [upcomingDialogOpen, setUpcomingDialogOpen] = useState(false);

  const firstUnskipped = upcoming.find((u) => !u.skipped);
  const displayDate = firstUnskipped?.date ?? nextBillingDate;

  // The date the subscription will resume after skipping the next order
  const resumeDate = useMemo(() => {
    if (!firstUnskipped) return null;
    const startIdx = upcoming.indexOf(firstUnskipped);
    const next = upcoming.slice(startIdx + 1).find((u) => !u.skipped);
    if (next) return next.date;
    if (interval && intervalCount) {
      return advanceDate(displayDate, interval, intervalCount);
    }
    return null;
  }, [firstUnskipped, upcoming, interval, intervalCount, displayDate]);

  const handleSkip = (dateToSkip: string) => {
    setError(null);
    startTransition(async () => {
      const result = await skipNextBillingCycle(contractId, dateToSkip);
      if (result.ok) {
        setUpcoming((prev) =>
          prev.map((u) =>
            u.date === dateToSkip ? { ...u, skipped: true } : u
          )
        );
        setSkipConfirmOpen(false);
      } else {
        setError(result.error);
      }
    });
  };

  const handleUnskip = (dateToUnskip: string) => {
    setError(null);
    startTransition(async () => {
      const result = await unskipBillingCycle(contractId, dateToUnskip);
      if (result.ok) {
        setUpcoming((prev) =>
          prev.map((u) =>
            u.date === dateToUnskip ? { ...u, skipped: false } : u
          )
        );
      } else {
        setError(result.error);
      }
    });
  };

  return (
    <>
      <div className="rounded-2xl bg-blue-ruin px-6 py-5 flex items-start justify-between gap-4">
        <div className="min-w-0 flex flex-col gap-1">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sugar-milk/60">
            Upcoming order
          </p>
          <p className="text-2xl font-bold text-sugar-milk">
            {formatDate(displayDate)}
          </p>
          <button
            type="button"
            onClick={() => setUpcomingDialogOpen(true)}
            className="text-xs font-semibold text-sugar-milk/80 hover:text-sugar-milk underline underline-offset-4 transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-sugar-milk/60 rounded mt-1 w-fit cursor-pointer"
          >
            Show upcoming orders
          </button>
        </div>
        {canSkip && firstUnskipped && (
          <button
            type="button"
            onClick={() => setSkipConfirmOpen(true)}
            disabled={isPending}
            className="shrink-0 inline-flex items-center justify-center h-9 px-5 rounded-lg border border-sugar-milk/40 text-sugar-milk text-sm font-semibold hover:bg-sugar-milk/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-sugar-milk/60"
          >
            Skip order
          </button>
        )}
      </div>

      {/* Skip confirmation dialog */}
      <Dialog open={skipConfirmOpen} onOpenChange={setSkipConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Skip next order</DialogTitle>
            <DialogDescription>
              Do you want to skip the next order?
              {resumeDate
                ? ` Your subscription will resume on ${formatDate(resumeDate)}.`
                : ''}
            </DialogDescription>
          </DialogHeader>
          {error && (
            <p role="alert" className="text-sm font-medium text-red-700 mt-2">
              {error}
            </p>
          )}
          <DialogFooter className="gap-2">
            <DialogClose asChild>
              <Button
                type="button"
                colorTheme="naked-blue-ruin"
                size="sm"
                padding="fat"
                hoverAnimation={false}
                className="h-10"
              >
                Close
              </Button>
            </DialogClose>
            <Button
              type="button"
              colorTheme="blue-ruin"
              size="sm"
              padding="fat"
              hoverAnimation={false}
              disabled={isPending}
              onClick={() => firstUnskipped && handleSkip(firstUnskipped.date)}
              className="h-10"
            >
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Skip'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upcoming orders dialog */}
      <Dialog open={upcomingDialogOpen} onOpenChange={setUpcomingDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upcoming orders</DialogTitle>
          </DialogHeader>
          <ul className="flex flex-col list-none p-0 my-2">
            {upcoming.map((item) => (
              <li
                key={item.date}
                className="flex items-center justify-between py-3 border-b border-blue-ruin/10 last:border-b-0"
              >
                <p className="text-sm font-medium text-blue-ruin">
                  {formatShortDate(item.date)}
                  {item.skipped && (
                    <span className="text-blue-ruin/60 font-normal">
                      {' '}
                      (skipped)
                    </span>
                  )}
                </p>
                {canSkip && (
                  <button
                    type="button"
                    onClick={() =>
                      item.skipped
                        ? handleUnskip(item.date)
                        : handleSkip(item.date)
                    }
                    disabled={isPending}
                    className="text-sm font-semibold text-blue-ruin underline underline-offset-4 hover:opacity-80 transition-opacity disabled:opacity-50 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-ruin/60 rounded cursor-pointer"
                  >
                    {item.skipped ? 'Unskip' : 'Skip'}
                  </button>
                )}
              </li>
            ))}
          </ul>
          {error && (
            <p role="alert" className="text-sm font-medium text-red-700">
              {error}
            </p>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button
                type="button"
                colorTheme="blue-ruin"
                size="sm"
                padding="fat"
                hoverAnimation={false}
                className="h-10"
              >
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
