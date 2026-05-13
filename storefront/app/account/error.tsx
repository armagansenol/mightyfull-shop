'use client';

import { AccountErrorBoundary } from '@/components/account/account-error-boundary';

export default function AccountError({
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
      title="We couldn't load your account"
      description="Something went wrong while fetching your account details. Try again, or head back to the shop while we sort it out."
      homeHref="/shop"
      homeLabel="Back to shop"
    />
  );
}
