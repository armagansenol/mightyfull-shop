'use client';

import { AccountErrorBoundary } from '@/components/account/account-error-boundary';

export default function OrdersError({
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
      title="We couldn't load your orders"
      description="Your order history is briefly unavailable. Try again in a moment."
    />
  );
}
