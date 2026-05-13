'use client';

import { useState } from 'react';
import { sendPaymentMethodUpdateEmail } from '@/app/account/subscriptions/actions';

interface Props {
  contractId: string;
}

type State = 'idle' | 'loading' | 'success' | 'error';

export function SubscriptionPaymentUpdateButton({ contractId }: Props) {
  const [state, setState] = useState<State>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleClick() {
    setState('loading');
    setErrorMessage(null);

    const result = await sendPaymentMethodUpdateEmail(contractId);

    if (result.ok) {
      setState('success');
    } else {
      setErrorMessage(result.error);
      setState('error');
    }
  }

  if (state === 'success') {
    return (
      <p className="text-sm font-semibold text-green-700">
        Check your email — we sent you a secure link to update your card.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div>
        <button
          type="button"
          onClick={handleClick}
          disabled={state === 'loading'}
          className="inline-flex items-center justify-center h-10 px-6 lg:px-8 xl:px-12 rounded-lg bg-blue-ruin text-sugar-milk font-bold text-base focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-ruin/60 focus-visible:ring-offset-2 transition-colors hover:bg-blue-ruin/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {state === 'loading' ? 'Sending…' : 'Send payment update link'}
        </button>
      </div>
      {state === 'error' && errorMessage && (
        <p role="alert" className="text-sm text-red-600">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
