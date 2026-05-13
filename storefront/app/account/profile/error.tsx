'use client';

import { AccountErrorBoundary } from '@/components/account/account-error-boundary';

export default function ProfileError({
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
      title="We couldn't load your profile"
      description="Your profile is briefly unavailable. Try again in a moment."
    />
  );
}
