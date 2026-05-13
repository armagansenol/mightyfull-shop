import {
  AlertCircle,
  CheckCircle2,
  Clock,
  type LucideIcon,
  Pause,
  XCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

type Variant = 'positive' | 'warning' | 'neutral' | 'negative';

interface SubscriptionStatusBadgeProps {
  status: string | null | undefined;
}

const STATUS_INFO: Record<
  string,
  { label: string; variant: Variant; icon: LucideIcon }
> = {
  ACTIVE: { label: 'Active', variant: 'positive', icon: CheckCircle2 },
  PAUSED: { label: 'Paused', variant: 'warning', icon: Pause },
  CANCELLED: { label: 'Cancelled', variant: 'negative', icon: XCircle },
  EXPIRED: { label: 'Expired', variant: 'neutral', icon: Clock },
  FAILED: { label: 'Failed', variant: 'negative', icon: AlertCircle }
};

const VARIANT_CLASSES: Record<Variant, string> = {
  positive: 'bg-emerald-100 text-emerald-800 ring-emerald-200',
  warning: 'bg-amber-100 text-amber-900 ring-amber-200',
  neutral: 'bg-blue-ruin/10 text-blue-ruin ring-blue-ruin/20',
  negative: 'bg-red-100 text-red-800 ring-red-200'
};

export function SubscriptionStatusBadge({
  status
}: SubscriptionStatusBadgeProps) {
  if (!status) return null;
  const entry = STATUS_INFO[status] ?? {
    label: status.replace(/_/g, ' ').toLowerCase(),
    variant: 'neutral' as Variant,
    icon: Clock
  };

  const Icon = entry.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full whitespace-nowrap ring-1 ring-inset',
        VARIANT_CLASSES[entry.variant]
      )}
    >
      <Icon
        className="w-3.5 h-3.5 shrink-0"
        strokeWidth={2.25}
        aria-hidden="true"
      />
      {entry.label}
    </span>
  );
}
