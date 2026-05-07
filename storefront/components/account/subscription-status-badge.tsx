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
  positive: 'bg-emerald-100 text-emerald-800',
  warning: 'bg-amber-100 text-amber-800',
  neutral: 'bg-blue-ruin/10 text-blue-ruin',
  negative: 'bg-red-100 text-red-800'
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
        'inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full whitespace-nowrap',
        VARIANT_CLASSES[entry.variant]
      )}
    >
      {entry.label}
    </span>
  );
}
