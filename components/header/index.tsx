'use client';

import s from './header.module.scss';

import cn from 'clsx';
import Lenis from 'lenis';
import { useLenis } from 'lenis/react';
import { CircleUserRound } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Cart } from '@/components/cart/cart';
import { IconLogo } from '@/components/icons';
import { Noticebar } from '@/components/noticebar';
import { Link } from '@/components/utility/link';
import { routes } from '@/lib/constants';
import { Cross1Icon, HamburgerMenuIcon } from '@radix-ui/react-icons';
import { useLayoutData } from '@/context/layout-data';

interface HeaderProps {
  withPadding?: boolean;
}

export function Header({ withPadding = false }: HeaderProps) {
  const [hamburgerOpen, setHamburgerOpen] = useState(false);
  const [noticebarHidden, setNoticebarHidden] = useState(false);
  const [headerHidden, setHeaderHidden] = useState(false);
  const lenis = useLenis();
  const pathname = usePathname();
  const { noticebar } = useLayoutData();

  useEffect(() => {
    setHamburgerOpen(false);
  }, [pathname]);

  useEffect(() => {
    return hamburgerOpen ? lenis?.stop() : lenis?.start();
  }, [hamburgerOpen, lenis]);

  useEffect(() => {
    const handleEvents = (e: Lenis) => {
      if (lenis?.direction === 1 && e.actualScroll > window.innerHeight / 2) {
        setHeaderHidden(true);
      } else {
        setHeaderHidden(false);
      }

      if (lenis?.direction === 1 && e.actualScroll > window.innerHeight / 4) {
        setNoticebarHidden(true);
      } else {
        setNoticebarHidden(false);
      }
    };

    lenis?.on('scroll', handleEvents);

    return () => lenis?.off('scroll', handleEvents);
  }, [lenis]);

  // const cartCookieIcon = (
  //   <div className={s.navItem}>
  //     <div className={s.iconC}>
  //       <IconCookieCart fill="var(--primary)" />
  //     </div>
  //     <div
  //       className={cn(
  //         s.amount,
  //         'flex items-center justify-center rounded-full'
  //       )}
  //     >
  //       {/* <span>{items.length}</span> */}
  //     </div>
  //   </div>
  // );

  return (
    <div
      className={cn(s.headerWrapper, 'flex flex-col', {
        [s.hidden]: headerHidden
      })}
    >
      {noticebar.active && (
        <div
          className={cn(s.noticebarWrapper, {
            [s.hidden]: noticebarHidden
          })}
        >
          <Noticebar title={noticebar.title} />
        </div>
      )}
      <header
        className={cn(s.header, 'relative flex items-center justify-between', {
          [s.withPadding]: withPadding
        })}
      >
        <Link href="/" className={cn(s.logoC, 'cursor-pointer')}>
          <IconLogo
            primary="var(--primary)"
            secondary="var(--secondary)"
            tertiary="var(--tertiary)"
          />
        </Link>
        <div className="flex items-center gap-5">
          <div className="flex tablet:hidden">{/* <CartModal /> */}</div>
          <div
            className={cn(s.trigger, 'block tablet:hidden', {
              [s.active]: hamburgerOpen
            })}
            onClick={() => setHamburgerOpen((prev) => !prev)}
          >
            {hamburgerOpen ? (
              <Cross1Icon className="w-full h-full" />
            ) : (
              <HamburgerMenuIcon className="w-full h-full" />
            )}
          </div>
        </div>
        <nav
          className={cn(
            s.navC,
            'flex flex-col tablet:flex-row items-center justify-center tablet:justify-between flex-1 gap-5 tablet:gap-0',
            {
              [s.active]: hamburgerOpen
            }
          )}
        >
          <div
            className={cn(
              s.nav,
              'flex flex-col tablet:flex-row items-center justify-between gap-5 tablet:gap-20'
            )}
          >
            <div className={s.navItem}>
              <Link href={`/${routes.shop.url}`}>{routes.shop.ui}</Link>
            </div>
            <div className={s.navItem}>
              <Link href={`/${routes.ourStory.url}`}>{routes.ourStory.ui}</Link>
            </div>
          </div>
          <div
            className={cn(
              s.nav,
              'flex flex-col tablet:flex-row items-center justify-between gap-14'
            )}
          >
            <div className={cn(s.navItem, 'cursor-pointer')}>
              <Link href={`/${routes.contact.url}`}>{routes.contact.ui}</Link>
            </div>
            <div className={cn(s.navItem, 'cursor-pointer')}>
              <Link href="https://shopify.com/67633938584/account">
                <CircleUserRound className="w-9 h-9" />
              </Link>
            </div>
            <div
              className="hidden tablet:block cursor-pointer"
              // onClick={() => setOpen(true)}
            >
              <Cart />
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
}
