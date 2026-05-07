'use client';

import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Link } from '@/components/utility/link';

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
          <Button
            key={item.href}
            asChild
            size="sm"
            colorTheme={active ? 'blue-ruin' : 'naked-blue-ruin'}
            hoverAnimation={false}
            className="h-10 justify-start whitespace-nowrap text-sm shrink-0 md:shrink"
          >
            <Link href={item.href} aria-current={active ? 'page' : undefined}>
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
        className="h-10 justify-start whitespace-nowrap text-sm shrink-0 md:shrink md:mt-4"
      >
        <Link href="/account/logout">Log out</Link>
      </Button>
    </nav>
  );
}
