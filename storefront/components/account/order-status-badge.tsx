import { cn } from '@/lib/utils';

type Variant = 'neutral' | 'positive' | 'warning' | 'negative';

interface OrderStatusBadgeProps {
  status: string | null | undefined;
  type: 'fulfillment' | 'financial';
}

const FULFILLMENT_LABELS: Record<string, { label: string; variant: Variant }> =
  {
    FULFILLED: { label: 'Fulfilled', variant: 'positive' },
    PARTIALLY_FULFILLED: { label: 'Partially fulfilled', variant: 'warning' },
    UNFULFILLED: { label: 'Unfulfilled', variant: 'warning' },
    IN_PROGRESS: { label: 'In progress', variant: 'warning' },
    ON_HOLD: { label: 'On hold', variant: 'warning' },
    OPEN: { label: 'Open', variant: 'warning' },
    PENDING_FULFILLMENT: { label: 'Pending fulfillment', variant: 'warning' },
    RESTOCKED: { label: 'Restocked', variant: 'neutral' },
    SCHEDULED: { label: 'Scheduled', variant: 'neutral' }
  };

const FINANCIAL_LABELS: Record<string, { label: string; variant: Variant }> = {
  PAID: { label: 'Paid', variant: 'positive' },
  PARTIALLY_PAID: { label: 'Partially paid', variant: 'warning' },
  AUTHORIZED: { label: 'Authorized', variant: 'neutral' },
  PENDING: { label: 'Pending', variant: 'warning' },
  REFUNDED: { label: 'Refunded', variant: 'neutral' },
  PARTIALLY_REFUNDED: { label: 'Partially refunded', variant: 'neutral' },
  VOIDED: { label: 'Voided', variant: 'negative' },
  EXPIRED: { label: 'Expired', variant: 'negative' }
};

const VARIANT_CLASSES: Record<Variant, string> = {
  neutral: 'bg-blue-ruin/10 text-blue-ruin',
  positive: 'bg-emerald-100 text-emerald-800',
  warning: 'bg-amber-100 text-amber-800',
  negative: 'bg-red-100 text-red-800'
};

export function OrderStatusBadge({ status, type }: OrderStatusBadgeProps) {
  if (!status) return null;
  const map = type === 'fulfillment' ? FULFILLMENT_LABELS : FINANCIAL_LABELS;
  const entry = map[status] ?? {
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
