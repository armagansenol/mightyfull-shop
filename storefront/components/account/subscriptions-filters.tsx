'use client';

import { motion } from 'motion/react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

export type SubscriptionStatusFilter =
  | 'all'
  | 'active'
  | 'paused'
  | 'cancelled';
export type SubscriptionSortKey = 'next-renewal' | 'newest' | 'oldest';

interface SubscriptionsFiltersProps {
  initialStatus: SubscriptionStatusFilter;
  initialSort: SubscriptionSortKey;
}

const STATUS_OPTIONS: Array<{
  value: SubscriptionStatusFilter;
  label: string;
}> = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'paused', label: 'Paused' },
  { value: 'cancelled', label: 'Cancelled' }
];

const SORT_OPTIONS: Array<{ value: SubscriptionSortKey; label: string }> = [
  { value: 'next-renewal', label: 'Next renewal' },
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' }
];

export function SubscriptionsFilters({
  initialStatus,
  initialSort
}: SubscriptionsFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const pushParams = (next: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(next)) {
      if (value === null || value === '') {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    }
    const qs = params.toString();
    startTransition(() => {
      router.push(qs ? `${pathname}?${qs}` : pathname);
    });
  };

  const handleStatus = (value: SubscriptionStatusFilter) => {
    pushParams({ status: value === 'all' ? null : value });
  };

  const handleSort = (value: SubscriptionSortKey) => {
    pushParams({ sort: value === 'next-renewal' ? null : value });
  };

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div
        role="tablist"
        aria-label="Filter by status"
        className="relative inline-flex gap-1 rounded-full border border-blue-ruin/20 bg-cerulean/15 p-1 w-fit"
      >
        {STATUS_OPTIONS.map((option) => {
          const isActive = initialStatus === option.value;
          return (
            <button
              key={option.value}
              type="button"
              role="tab"
              aria-selected={isActive}
              disabled={isPending}
              onClick={() => handleStatus(option.value)}
              className="relative inline-flex h-8 items-center justify-center px-4 rounded-full text-sm font-semibold cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-ruin/60 transition-colors"
            >
              {isActive && (
                <motion.span
                  layoutId="subscription-filter-active"
                  aria-hidden="true"
                  className="absolute inset-0 rounded-full bg-blue-ruin"
                  transition={{
                    type: 'spring',
                    stiffness: 400,
                    damping: 32
                  }}
                />
              )}
              <span
                className={
                  isActive
                    ? 'relative z-10 text-sugar-milk'
                    : 'relative z-10 text-blue-ruin'
                }
              >
                {option.label}
              </span>
            </button>
          );
        })}
      </div>

      <div className="inline-flex items-center gap-2 self-start md:self-auto">
        <span
          id="subscription-sort-label"
          className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-ruin/60"
        >
          Sort by
        </span>
        <Select
          value={initialSort}
          onValueChange={(v) => handleSort(v as SubscriptionSortKey)}
          disabled={isPending}
        >
          <SelectTrigger
            aria-labelledby="subscription-sort-label"
            className="h-9 px-3.5 rounded-full border border-blue-ruin/30 bg-sugar-milk text-blue-ruin text-sm font-semibold cursor-pointer hover:border-blue-ruin/50 transition-colors focus-visible:outline-hidden focus-visible:border-blue-ruin focus-visible:ring-2 focus-visible:ring-blue-ruin/20 gap-2 [&>span]:line-clamp-none [&_svg]:!h-4 [&_svg]:!w-4 [&_svg]:opacity-70"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="rounded-xl border border-blue-ruin/20 bg-sugar-milk text-blue-ruin shadow-lg p-1">
            {SORT_OPTIONS.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                className="rounded-md px-3 py-1.5 text-sm font-semibold text-blue-ruin focus:bg-blue-ruin/10 data-[state=checked]:bg-blue-ruin/8 cursor-pointer"
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
