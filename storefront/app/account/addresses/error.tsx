'use client';

import { AccountErrorBoundary } from '@/components/account/account-error-boundary';

export default function AddressesError({
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
      title="We couldn't load your addresses"
      description="Your saved addresses are briefly unavailable. Try again in a moment."
    />
  );
}
