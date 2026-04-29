'use client';

import cn from 'clsx';
import dynamic from 'next/dynamic';
import { useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import type { Store } from '@/types';

import s from './store-locator.module.css';

const StoreLocatorMap = dynamic(
  () => import('./map').then((mod) => mod.StoreLocatorMap),
  {
    ssr: false,
    loading: () => <div className={s.mapPlaceholder}>Loading map…</div>
  }
);

interface StoreLocatorProps {
  stores: Store[];
}

function buildHaystack(store: Store) {
  return [
    store.retailer,
    store.title,
    store.address,
    store.addressLine2,
    store.city,
    store.state,
    store.zip,
    store.country
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

export function StoreLocator({ stores }: StoreLocatorProps) {
  const [searchInput, setSearchInput] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [activeId, setActiveId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = appliedSearch.trim().toLowerCase();
    if (!q) return stores;
    return stores.filter((store) => buildHaystack(store).includes(q));
  }, [appliedSearch, stores]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setAppliedSearch(searchInput);
  };

  return (
    <div className={s.section}>
      <div className={s.layout}>
        <div className="space-y-3">
          <form className={s.searchForm} onSubmit={handleSubmit}>
            <input
              type="text"
              className={s.searchInput}
              placeholder="Enter address or zipcode"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              aria-label="Search stores by address or zipcode"
            />
            <Button
              type="submit"
              size="sm"
              padding="fat"
              colorTheme="blue-ruin"
              hoverAnimation={false}
              className="rounded-full text-sm h-10"
            >
              Search
            </Button>
          </form>

          <div className={s.list}>
            {filtered.length === 0 ? (
              <p className={s.empty}>
                No stores found. Try a different city or zipcode.
              </p>
            ) : (
              filtered.map((store) => {
                const cityLine = [store.city, store.state, store.zip]
                  .filter(Boolean)
                  .join(', ');
                return (
                  <button
                    type="button"
                    key={store._id}
                    className={cn(s.listItem, {
                      [s.active]: activeId === store._id
                    })}
                    onClick={() => setActiveId(store._id)}
                  >
                    <p className={s.retailer}>
                      {store.retailer || store.title || 'Store'}
                    </p>
                    {store.address && (
                      <p className={s.addressLine}>{store.address}</p>
                    )}
                    {store.addressLine2 && (
                      <p className={s.addressLine}>{store.addressLine2}</p>
                    )}
                    {cityLine && <p className={s.addressLine}>{cityLine}</p>}
                    {!store.location && (
                      <p className={s.hint}>Map pin coming soon</p>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        <div className={s.mapWrap}>
          {stores.length === 0 ? (
            <div className={s.mapPlaceholder}>No store locations yet.</div>
          ) : (
            <StoreLocatorMap
              stores={filtered}
              activeId={activeId}
              onSelect={setActiveId}
            />
          )}
        </div>
      </div>
    </div>
  );
}
