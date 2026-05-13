'use client';

import { ArrowDown01Icon, ArrowUp01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';

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

  const sortIcon =
    initialSort === 'oldest' ? ArrowUp01Icon : ArrowDown01Icon;

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div
        role="tablist"
        aria-label="Filter by status"
        className="inline-flex flex-wrap gap-1 rounded-lg border border-blue-ruin/20 bg-cerulean/15 p-1 w-fit"
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
              className={
                isActive
                  ? 'inline-flex h-8 items-center justify-center px-3 rounded-md bg-blue-ruin text-sugar-milk text-sm font-semibold cursor-pointer'
                  : 'inline-flex h-8 items-center justify-center px-3 rounded-md text-sm font-semibold text-blue-ruin hover:bg-cerulean/30 cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-ruin/60'
              }
            >
              {option.label}
            </button>
          );
        })}
      </div>

      <label className="inline-flex items-center gap-2 self-start md:self-auto">
        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-ruin/60">
          Sort by
        </span>
        <div className="relative">
          <select
            value={initialSort}
            onChange={(e) =>
              handleSort(e.target.value as SubscriptionSortKey)
            }
            disabled={isPending}
            className="appearance-none h-9 pl-3 pr-8 rounded-md border border-blue-ruin/30 bg-sugar-milk text-blue-ruin text-sm font-semibold cursor-pointer focus-visible:outline-hidden focus-visible:border-blue-ruin focus-visible:ring-2 focus-visible:ring-blue-ruin/20"
            aria-label="Sort subscriptions"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <HugeiconsIcon
            icon={sortIcon}
            size={14}
            strokeWidth={2}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-blue-ruin/60 pointer-events-none"
            aria-hidden="true"
          />
        </div>
      </label>
    </div>
  );
}
