'use client';

import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import {
  cancelSubscription,
  pauseSubscription,
  resumeSubscription
} from '@/app/account/subscriptions/actions';
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
    startTransition(async () => {
      const result = await pauseSubscription(contractId);
      if (result.ok) {
        router.refresh();
      }
    });
  };

  const handleResume = () => {
    startTransition(async () => {
      const result = await resumeSubscription(contractId);
      if (result.ok) {
        router.refresh();
      }
    });
  };

  const handleCancel = () => {
    startTransition(async () => {
      const result = await cancelSubscription(contractId);
      if (result.ok) {
        router.refresh();
      }
    });
  };

  return (
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
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Resume'}
        </Button>
      )}
      <Dialog>
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
          <DialogHeader>
            <DialogTitle>Cancel this subscription?</DialogTitle>
            <DialogDescription>
              You won&apos;t be billed again. You can always start a new
              subscription from the shop.
            </DialogDescription>
          </DialogHeader>
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
              type="button"
              colorTheme="blue-ruin"
              size="sm"
              padding="fat"
              hoverAnimation={false}
              disabled={isPending}
              onClick={handleCancel}
              className="h-10"
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                'Cancel subscription'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
