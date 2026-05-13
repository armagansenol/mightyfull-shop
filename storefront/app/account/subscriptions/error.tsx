'use client';

import { AccountErrorBoundary } from '@/components/account/account-error-boundary';

export default function SubscriptionsError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <AccountErrorBoundary
      error={error}
      reset={reset}
      title="We couldn't load your subscriptions"
      description="Your subscriptions are briefly unavailable. Try again in a moment."
    />
  );
}
