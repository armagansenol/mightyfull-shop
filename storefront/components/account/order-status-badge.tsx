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
  neutral: 'border-blue-ruin bg-sugar-milk text-blue-ruin',
  positive: 'border-emerald-700 bg-emerald-50 text-emerald-900',
  warning: 'border-amber-700 bg-amber-50 text-amber-900',
  negative: 'border-red-700 bg-red-50 text-red-900'
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
        'inline-flex items-center px-2.5 py-0.5 text-xs font-semibold rounded-full whitespace-nowrap border-[1.5px]',
        VARIANT_CLASSES[entry.variant]
      )}
    >
      {entry.label}
    </span>
  );
}
