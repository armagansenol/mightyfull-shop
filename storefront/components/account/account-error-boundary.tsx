'use client';

import { AlertTriangle, RefreshCw } from 'lucide-react';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from '@/components/utility/link';

interface AccountErrorBoundaryProps {
  error: Error & { digest?: string };
  reset: () => void;
  title?: string;
  description?: string;
  homeHref?: string;
  homeLabel?: string;
}

export function AccountErrorBoundary({
  error,
  reset,
  title = 'Something went wrong',
  description = "We couldn't load this part of your account. Try again — if the problem keeps happening, you can sign out and back in.",
  homeHref = '/account',
  homeLabel = 'Back to account'
}: AccountErrorBoundaryProps) {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.error('[account error boundary]', error);
    }
  }, [error]);

  return (
    <div
      role="alert"
      aria-live="polite"
      className="rounded-2xl border border-red-300/60 bg-red-50 text-red-900 p-6 md:p-8 flex flex-col gap-5"
    >
      <div className="flex items-start gap-4">
        <span
          aria-hidden="true"
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-700"
        >
          <AlertTriangle className="w-5 h-5" strokeWidth={1.75} />
        </span>
        <div className="flex flex-col gap-1.5 min-w-0">
          <h2 className="font-bomstad-display text-2xl md:text-3xl font-bold leading-tight">
            {title}
          </h2>
          <p className="text-sm md:text-base text-red-900/85 max-w-prose">
            {description}
          </p>
          {error.digest && (
            <p className="text-xs font-mono text-red-900/60 mt-1">
              Reference: {error.digest}
            </p>
          )}
        </div>
      </div>
      <div className="flex flex-wrap gap-3">
        <Button
          type="button"
          colorTheme="blue-ruin"
          size="sm"
          padding="fat"
          hoverAnimation={false}
          onClick={reset}
          className="h-10"
        >
          <RefreshCw
            className="w-4 h-4 mr-2"
            strokeWidth={2}
            aria-hidden="true"
          />
          Try again
        </Button>
        <Button
          asChild
          colorTheme="naked-blue-ruin"
          size="sm"
          padding="fat"
          hoverAnimation={false}
          className="h-10"
        >
          <Link href={homeHref}>{homeLabel}</Link>
        </Button>
      </div>
    </div>
  );
}
