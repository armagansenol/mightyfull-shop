'use client';

import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import {
  skipBillingCycle,
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

interface BillingCycle {
  cycleIndex: number;
  cycleStartAt: string;
  billingAttemptExpectedDate: string | null;
  skipped: boolean;
}

interface Props {
  contractId: string;
  canSkip: boolean;
  cycles: BillingCycle[];
}

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

export function SubscriptionNextBillingBanner({
  contractId,
  canSkip,
  cycles
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [pendingCycleIndex, setPendingCycleIndex] = useState<number | null>(
    null
  );
  const [skipConfirmOpen, setSkipConfirmOpen] = useState(false);
  const [upcomingDialogOpen, setUpcomingDialogOpen] = useState(false);

  const firstUnskipped = cycles.find((c) => !c.skipped);
  const dateForCycle = (c: BillingCycle) =>
    c.billingAttemptExpectedDate ?? c.cycleStartAt;
  const displayDate = firstUnskipped
    ? dateForCycle(firstUnskipped)
    : cycles[0]
      ? dateForCycle(cycles[0])
      : null;

  // Next unskipped cycle AFTER firstUnskipped (for the skip-confirm copy)
  const nextAfterFirst = firstUnskipped
    ? cycles
        .filter((c) => c.cycleIndex > firstUnskipped.cycleIndex)
        .find((c) => !c.skipped)
    : null;
  const resumeDate = nextAfterFirst ? dateForCycle(nextAfterFirst) : null;

  const handleSkip = (cycleIndex: number) => {
    setError(null);
    setPendingCycleIndex(cycleIndex);
    startTransition(async () => {
      const result = await skipBillingCycle(contractId, cycleIndex);
      setPendingCycleIndex(null);
      if (result.ok) {
        setSkipConfirmOpen(false);
        router.refresh();
      } else {
        setError(result.error);
      }
    });
  };

  const handleUnskip = (cycleIndex: number) => {
    setError(null);
    setPendingCycleIndex(cycleIndex);
    startTransition(async () => {
      const result = await unskipBillingCycle(contractId, cycleIndex);
      setPendingCycleIndex(null);
      if (result.ok) {
        router.refresh();
      } else {
        setError(result.error);
      }
    });
  };

  if (!displayDate) return null;

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
              onClick={() =>
                firstUnskipped && handleSkip(firstUnskipped.cycleIndex)
              }
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
            {cycles.map((cycle) => {
              const cycleDate = dateForCycle(cycle);
              const isPendingThis =
                isPending && pendingCycleIndex === cycle.cycleIndex;
              return (
                <li
                  key={cycle.cycleIndex}
                  className="flex items-center justify-between py-3 border-b border-blue-ruin/10 last:border-b-0"
                >
                  <p className="text-sm font-medium text-blue-ruin">
                    {formatShortDate(cycleDate)}
                    {cycle.skipped && (
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
                        cycle.skipped
                          ? handleUnskip(cycle.cycleIndex)
                          : handleSkip(cycle.cycleIndex)
                      }
                      disabled={isPending}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-ruin underline underline-offset-4 hover:opacity-80 transition-opacity disabled:opacity-50 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-ruin/60 rounded cursor-pointer"
                    >
                      {isPendingThis && (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      )}
                      {cycle.skipped ? 'Unskip' : 'Skip'}
                    </button>
                  )}
                </li>
              );
            })}
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
