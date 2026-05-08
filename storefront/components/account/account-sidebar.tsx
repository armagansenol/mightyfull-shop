'use client';

import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Link } from '@/components/utility/link';
import { cn } from '@/lib/utils';

interface AccountNavItem {
  label: string;
  href: string;
  prefetch?: boolean;
}

// prefetch is set to true only for pages that exist; false for stubs
// that haven't been built yet so we don't pollute the console with 404s
// on sidebar render.
const NAV_ITEMS: AccountNavItem[] = [
  { label: 'Overview', href: '/account', prefetch: true },
  { label: 'Orders', href: '/account/orders', prefetch: true },
  { label: 'Subscriptions', href: '/account/subscriptions', prefetch: true },
  { label: 'Addresses', href: '/account/addresses', prefetch: true },
  { label: 'Profile', href: '/account/profile', prefetch: true }
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
          <Button
            key={item.href}
            asChild
            size="sm"
            colorTheme={active ? 'blue-ruin' : 'naked-blue-ruin'}
            hoverAnimation={false}
            className={cn(
              'h-11 w-auto md:w-full justify-start whitespace-nowrap text-sm px-4 shrink-0 md:shrink transition-colors',
              !active && 'hover:bg-blue-ruin/10'
            )}
          >
            <Link
              href={item.href}
              prefetch={item.prefetch}
              aria-current={active ? 'page' : undefined}
            >
              {item.label}
            </Link>
          </Button>
        );
      })}
      <Button
        asChild
        size="sm"
        colorTheme="inverted-blue-ruin"
        hoverAnimation={false}
        className="h-11 w-auto md:w-full justify-start whitespace-nowrap text-sm px-4 shrink-0 md:shrink md:mt-4"
      >
        <Link href="/account/logout" prefetch={false}>
          Log out
        </Link>
      </Button>
    </nav>
  );
}
