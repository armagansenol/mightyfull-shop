'use client';

import { Search, X } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export type OrderStatusFilter = 'all' | 'open' | 'fulfilled' | 'cancelled';

interface OrdersFiltersProps {
  initialQuery: string;
  initialStatus: OrderStatusFilter;
}

const STATUS_OPTIONS: Array<{ value: OrderStatusFilter; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'open', label: 'Open' },
  { value: 'fulfilled', label: 'Fulfilled' },
  { value: 'cancelled', label: 'Cancelled' }
];

export function OrdersFilters({
  initialQuery,
  initialStatus
}: OrdersFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState(initialQuery);

  const pushParams = (next: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(next)) {
      if (value === null || value === '') {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    }
    // Reset pagination when filters change.
    params.delete('after');
    const qs = params.toString();
    startTransition(() => {
      router.push(qs ? `${pathname}?${qs}` : pathname);
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    pushParams({ q: query.trim() || null });
  };

  const handleStatus = (value: OrderStatusFilter) => {
    pushParams({ status: value === 'all' ? null : value });
  };

  const handleClear = () => {
    setQuery('');
    pushParams({ q: null });
  };

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <search className="flex items-center gap-2 flex-1 max-w-md">
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 w-full"
        >
          <div className="relative flex-1">
            <Search
              aria-hidden="true"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-ruin/60"
              strokeWidth={1.75}
            />
            <Input
              type="search"
              inputMode="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by order number (e.g. 1042)"
              disabled={isPending}
              aria-label="Search orders by number"
              className="h-10 pl-9 pr-9 border border-blue-ruin/30 rounded-md bg-white text-blue-ruin font-medium placeholder:text-blue-ruin/40 focus-visible:border-blue-ruin focus-visible:ring-2 focus-visible:ring-blue-ruin/20"
            />
            {query && (
              <button
                type="button"
                onClick={handleClear}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-6 w-6 items-center justify-center rounded-full text-blue-ruin/60 hover:text-blue-ruin focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-ruin/60"
              >
                <X className="w-3.5 h-3.5" strokeWidth={2} />
              </button>
            )}
          </div>
          <Button
            type="submit"
            colorTheme="blue-ruin"
            size="sm"
            padding="fat"
            hoverAnimation={false}
            disabled={isPending}
            className="h-10"
          >
            Search
          </Button>
        </form>
      </search>

      <div
        role="tablist"
        aria-label="Filter by status"
        className="inline-flex flex-wrap gap-1 rounded-lg border border-blue-ruin/20 bg-cerulean/15 p-1"
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
                  ? 'inline-flex h-8 items-center justify-center px-3 rounded-md bg-blue-ruin text-sugar-milk text-sm font-semibold'
                  : 'inline-flex h-8 items-center justify-center px-3 rounded-md text-sm font-semibold text-blue-ruin hover:bg-cerulean/30 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-ruin/60'
              }
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
