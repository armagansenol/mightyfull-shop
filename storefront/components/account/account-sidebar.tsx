'use client';

import {
  Home01Icon,
  Logout03Icon,
  MapPinIcon,
  Package01Icon,
  RepeatIcon,
  UserAccountIcon
} from '@hugeicons/core-free-icons';
import type { IconSvgElement } from '@hugeicons/react';
import { HugeiconsIcon } from '@hugeicons/react';
import { usePathname } from 'next/navigation';
import { AccountThemeToggle } from '@/components/account/account-theme-toggle';
import { Link } from '@/components/utility/link';
import { cn } from '@/lib/utils';

interface AccountNavItem {
  label: string;
  href: string;
  icon: IconSvgElement;
  prefetch?: boolean;
}

const NAV_ITEMS: AccountNavItem[] = [
  { label: 'Overview', href: '/account', icon: Home01Icon, prefetch: true },
  {
    label: 'Orders',
    href: '/account/orders',
    icon: Package01Icon,
    prefetch: true
  },
  {
    label: 'Subscriptions',
    href: '/account/subscriptions',
    icon: RepeatIcon,
    prefetch: true
  },
  {
    label: 'Addresses',
    href: '/account/addresses',
    icon: MapPinIcon,
    prefetch: true
  },
  {
    label: 'Profile',
    href: '/account/profile',
    icon: UserAccountIcon,
    prefetch: true
  }
];

export function AccountSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/account') return pathname === '/account';
    return pathname.startsWith(href);
  };

  return (
    <nav
      aria-label="Account navigation"
      className={cn(
        'flex md:flex-col gap-1.5 md:w-64 md:shrink-0',
        'rounded-2xl border border-blue-ruin/20 bg-cerulean/18 p-2 md:p-3',
        'overflow-x-auto md:overflow-visible',
        'snap-x snap-mandatory md:snap-none',
        'md:sticky md:top-24 md:self-start'
      )}
    >
      {NAV_ITEMS.map((item) => {
        const active = isActive(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            prefetch={item.prefetch}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'group inline-flex items-center gap-2.5 shrink-0 md:shrink',
              'h-11 md:h-10 px-4 md:px-3.5 rounded-xl whitespace-nowrap snap-start',
              'text-sm font-bold cursor-pointer transition-colors duration-200',
              'focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-ruin/60 focus-visible:ring-offset-2 focus-visible:ring-offset-sugar-milk',
              active
                ? 'bg-blue-ruin text-sugar-milk'
                : 'text-blue-ruin hover:bg-columbia-blue/30'
            )}
          >
            <HugeiconsIcon
              icon={item.icon}
              size={18}
              strokeWidth={active ? 2 : 1.75}
              aria-hidden="true"
              className={cn(
                'shrink-0',
                active ? 'text-sugar-milk' : 'text-blue-ruin/80'
              )}
            />
            <span>{item.label}</span>
          </Link>
        );
      })}

      <div
        className="hidden md:block h-px bg-blue-ruin/15 my-2"
        aria-hidden="true"
      />

      <AccountThemeToggle />

      {/*
        Logout MUST be a hard browser navigation: /account/logout is a
        route handler that issues Set-Cookie headers and then redirects
        the browser through Shopify's logout endpoint. Next.js Link does
        client-side routing which doesn't reliably persist Set-Cookie
        nor follow cross-origin redirects, so we use a plain anchor.
      */}
      <a
        href="/account/logout"
        className={cn(
          'inline-flex items-center gap-2.5 shrink-0 md:shrink',
          'h-11 md:h-10 px-4 md:px-3.5 rounded-xl whitespace-nowrap',
          'text-sm font-bold cursor-pointer transition-colors duration-200',
          'border border-blue-ruin/40 text-blue-ruin hover:bg-columbia-blue/35',
          'focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-ruin/60 focus-visible:ring-offset-2 focus-visible:ring-offset-sugar-milk'
        )}
      >
        <HugeiconsIcon
          icon={Logout03Icon}
          size={18}
          strokeWidth={1.75}
          aria-hidden="true"
        />
        <span>Log out</span>
      </a>
    </nav>
  );
}
