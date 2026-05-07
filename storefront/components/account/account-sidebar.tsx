'use client';

import { usePathname } from 'next/navigation';
import { Link } from '@/components/utility/link';
import { cn } from '@/lib/utils';

interface AccountNavItem {
  label: string;
  href: string;
}

const NAV_ITEMS: AccountNavItem[] = [
  { label: 'Overview', href: '/account' },
  { label: 'Orders', href: '/account/orders' },
  { label: 'Subscriptions', href: '/account/subscriptions' },
  { label: 'Addresses', href: '/account/addresses' },
  { label: 'Profile', href: '/account/profile' }
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
      className="flex md:flex-col gap-2 md:gap-1 overflow-x-auto md:overflow-visible md:w-56 md:shrink-0 -mx-4 md:mx-0 px-4 md:px-0 pb-2 md:pb-0"
    >
      {NAV_ITEMS.map((item) => {
        const active = isActive(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'shrink-0 md:shrink rounded-lg px-4 py-2.5 text-sm font-poppins font-medium transition-colors whitespace-nowrap',
              active
                ? 'bg-blue-ruin text-sugar-milk'
                : 'text-blue-ruin hover:bg-blue-ruin/10'
            )}
          >
            {item.label}
          </Link>
        );
      })}
      <Link
        href="/account/logout"
        className="shrink-0 md:shrink md:mt-4 rounded-lg px-4 py-2.5 text-sm font-poppins font-medium border border-blue-ruin/20 text-blue-ruin hover:bg-blue-ruin hover:text-sugar-milk transition-colors whitespace-nowrap text-center md:text-left"
      >
        Log out
      </Link>
    </nav>
  );
}
