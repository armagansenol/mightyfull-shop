import { cn } from '@/lib/utils';

type Variant = 'positive' | 'warning' | 'neutral' | 'negative';

interface SubscriptionStatusBadgeProps {
  status: string | null | undefined;
}

const STATUS_LABELS: Record<string, { label: string; variant: Variant }> = {
  ACTIVE: { label: 'Active', variant: 'positive' },
  PAUSED: { label: 'Paused', variant: 'warning' },
  CANCELLED: { label: 'Cancelled', variant: 'negative' },
  EXPIRED: { label: 'Expired', variant: 'neutral' },
  FAILED: { label: 'Failed', variant: 'negative' }
};

const VARIANT_CLASSES: Record<Variant, string> = {
  positive: 'border-emerald-700 bg-emerald-50 text-emerald-900',
  warning: 'border-amber-700 bg-amber-50 text-amber-900',
  neutral: 'border-blue-ruin bg-sugar-milk text-blue-ruin',
  negative: 'border-red-700 bg-red-50 text-red-900'
};

export function SubscriptionStatusBadge({
  status
}: SubscriptionStatusBadgeProps) {
  if (!status) return null;
  const entry = STATUS_LABELS[status] ?? {
    label: status.replace(/_/g, ' ').toLowerCase(),
    variant: 'neutral' as Variant
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 text-xs font-semibold rounded-full whitespace-nowrap border-[1.5px]',
        VARIANT_CLASSES[entry.variant]
      )}
    >
      {entry.label}
    </span>
  );
}
