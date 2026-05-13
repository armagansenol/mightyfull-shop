'use client';

import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { changeSubscriptionFrequency } from '@/app/account/subscriptions/actions';
import { FREQUENCY_OPTIONS } from '@/app/account/subscriptions/constants';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface SubscriptionFrequencyFormProps {
  contractId: string;
  currentValue?: string;
  disabled?: boolean;
}

export function SubscriptionFrequencyForm({
  contractId,
  currentValue,
  disabled
}: SubscriptionFrequencyFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selected, setSelected] = useState<string>(currentValue ?? '');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    if (!selected) {
      setError('Pick a delivery frequency.');
      return;
    }
    if (selected === currentValue) return;

    startTransition(async () => {
      const result = await changeSubscriptionFrequency(contractId, selected);
      if (result.ok) {
        setSuccess(true);
        router.refresh();
      } else {
        setError(result.error);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <RadioGroup
        value={selected}
        onValueChange={setSelected}
        className="flex flex-col gap-2.5"
        aria-label="Delivery frequency"
      >
        {FREQUENCY_OPTIONS.map((option) => {
          const id = `frequency-${option.value}`;
          return (
            <div key={option.value} className="flex items-center gap-3">
              <RadioGroupItem
                id={id}
                value={option.value}
                disabled={disabled || isPending}
              />
              <Label
                htmlFor={id}
                className="cursor-pointer text-sm font-medium text-blue-ruin"
              >
                {option.label}
                {currentValue === option.value && (
                  <span className="ml-2 text-xs font-semibold uppercase tracking-[0.14em] text-account-subtle">
                    Current
                  </span>
                )}
              </Label>
            </div>
          );
        })}
      </RadioGroup>

      {error && (
        <p role="alert" className="text-sm font-medium text-red-700">
          {error}
        </p>
      )}
      {success && (
        <output className="text-sm font-medium text-emerald-800">
          Frequency updated.
        </output>
      )}

      <div>
        <Button
          type="submit"
          colorTheme="blue-ruin"
          size="sm"
          padding="fat"
          hoverAnimation={false}
          disabled={
            disabled || isPending || !selected || selected === currentValue
          }
          className="h-10"
        >
          {isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            'Save frequency'
          )}
        </Button>
      </div>
    </form>
  );
}
