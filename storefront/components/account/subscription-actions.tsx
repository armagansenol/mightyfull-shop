'use client';

import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import {
  cancelSubscription,
  pauseSubscription,
  resumeSubscription
} from '@/app/account/subscriptions/actions';
import {
  CANCELLATION_REASONS,
  type CancellationReasonValue
} from '@/app/account/subscriptions/constants';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';

interface SubscriptionActionsProps {
  contractId: string;
  status: string;
}

export function SubscriptionActions({
  contractId,
  status
}: SubscriptionActionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [cancelOpen, setCancelOpen] = useState(false);
  const [reason, setReason] = useState<CancellationReasonValue | ''>('');
  const [notes, setNotes] = useState('');
  const [cancelError, setCancelError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const isActive = status === 'ACTIVE';
  const isPaused = status === 'PAUSED';
  const isTerminated =
    status === 'CANCELLED' || status === 'EXPIRED' || status === 'FAILED';

  if (isTerminated) {
    return (
      <p className="text-sm text-blue-ruin/80">This subscription has ended.</p>
    );
  }

  const handlePause = () => {
    setActionError(null);
    startTransition(async () => {
      const result = await pauseSubscription(contractId);
      if (result.ok) {
        router.refresh();
      } else {
        setActionError(result.error);
      }
    });
  };

  const handleResume = () => {
    setActionError(null);
    startTransition(async () => {
      const result = await resumeSubscription(contractId);
      if (result.ok) {
        router.refresh();
      } else {
        setActionError(result.error);
      }
    });
  };

  const resetCancelForm = () => {
    setReason('');
    setNotes('');
    setCancelError(null);
  };

  const handleCancel = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!reason) {
      setCancelError('Please pick a reason so we can keep improving.');
      return;
    }
    setCancelError(null);
    startTransition(async () => {
      const result = await cancelSubscription({
        subscriptionContractId: contractId,
        reason,
        notes: notes.trim() || undefined
      });
      if (result.ok) {
        setCancelOpen(false);
        resetCancelForm();
        router.refresh();
      } else {
        setCancelError(result.error);
      }
    });
  };

  const requiresNotes = reason === 'other';

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-3">
        {isActive && (
          <Button
            type="button"
            colorTheme="blue-ruin"
            size="sm"
            padding="fat"
            hoverAnimation={false}
            disabled={isPending}
            onClick={handlePause}
            className="h-10"
          >
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Pause'}
          </Button>
        )}
        {isPaused && (
          <Button
            type="button"
            colorTheme="blue-ruin"
            size="sm"
            padding="fat"
            hoverAnimation={false}
            disabled={isPending}
            onClick={handleResume}
            className="h-10"
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              'Resume'
            )}
          </Button>
        )}
        <Dialog
          open={cancelOpen}
          onOpenChange={(open) => {
            setCancelOpen(open);
            if (!open) resetCancelForm();
          }}
        >
          <DialogTrigger asChild>
            <Button
              type="button"
              colorTheme="naked-blue-ruin"
              size="sm"
              padding="fat"
              hoverAnimation={false}
              disabled={isPending}
              className="h-10"
            >
              Cancel subscription
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleCancel}>
              <DialogHeader>
                <DialogTitle>Cancel this subscription?</DialogTitle>
                <DialogDescription>
                  You won&apos;t be billed again. Help us improve by telling us
                  why you&apos;re cancelling.
                </DialogDescription>
              </DialogHeader>

              <fieldset className="my-5 flex flex-col gap-3">
                <legend className="sr-only">Cancellation reason</legend>
                <RadioGroup
                  value={reason}
                  onValueChange={(v) => setReason(v as CancellationReasonValue)}
                  className="flex flex-col gap-2.5"
                >
                  {CANCELLATION_REASONS.map((option) => {
                    const id = `cancel-reason-${option.value}`;
                    return (
                      <div
                        key={option.value}
                        className="flex items-center gap-3"
                      >
                        <RadioGroupItem id={id} value={option.value} />
                        <Label
                          htmlFor={id}
                          className="cursor-pointer text-sm font-medium text-blue-ruin"
                        >
                          {option.label}
                        </Label>
                      </div>
                    );
                  })}
                </RadioGroup>

                <div className="flex flex-col gap-1.5 mt-1">
                  <Label
                    htmlFor="cancel-notes"
                    className="text-xs font-semibold uppercase tracking-[0.14em] text-account-subtle"
                  >
                    {requiresNotes
                      ? 'Tell us more'
                      : 'Anything else? (optional)'}
                  </Label>
                  <Textarea
                    id="cancel-notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Optional notes"
                    rows={3}
                    required={requiresNotes}
                  />
                </div>

                {cancelError && (
                  <p role="alert" className="text-sm font-medium text-red-700">
                    {cancelError}
                  </p>
                )}
              </fieldset>

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
                    Keep it
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  colorTheme="blue-ruin"
                  size="sm"
                  padding="fat"
                  hoverAnimation={false}
                  disabled={isPending}
                  className="h-10"
                >
                  {isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    'Cancel subscription'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      {actionError && (
        <p role="alert" className="text-sm font-medium text-red-700">
          {actionError}
        </p>
      )}
    </div>
  );
}
