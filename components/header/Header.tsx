'use client';

import s from './header.module.scss';

import { cn } from '@/lib/utils';
import { Cross1Icon, HamburgerMenuIcon } from '@radix-ui/react-icons';
import Lenis from 'lenis';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import CartModal from '@/components/cart-test/modal';
import { ComesInGoesOutUnderline } from '@/components/comes-in-goes-out';
import { IconLogo } from '@/components/icons';
import { Noticebar } from '@/components/noticebar';
import { Link } from '@/components/utility/link';
import { routes } from '@/lib/constants';
import { useLenisStore } from '@/lib/store/lenis';
import { useTheme } from '@/lib/store/theme';
import { ProductCollection } from '@/types';

interface HeaderProps {
  shopMenu: ProductCollection[];
  announcement: string;
}

export default function Header(props: HeaderProps) {
  console.log(props);

  const { primaryColor, secondaryColor, tertiaryColor } = useTheme();
  const { lenis } = useLenisStore();
  const pathname = usePathname();

  const [hamburgerOpen, setHamburgerOpen] = useState(false);
  const [noticebarHidden, setNoticebarHidden] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    setHamburgerOpen(false);
  }, [pathname]);

  useEffect(() => {
    return hamburgerOpen ? lenis?.stop() : lenis?.start();
  }, [hamburgerOpen, lenis]);

  useEffect(() => {
    const handleEvents = (e: Lenis) => {
      if (lenis?.direction === 1 && e.actualScroll > window.innerHeight / 2) {
        setHidden(true);
      } else {
        setHidden(false);
      }

      if (e.actualScroll > window.innerHeight / 5) {
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
    <>
      <div
        className={cn(
          s.cpBadge,
          'fixed bottom-0 left-0 bg-black text-lime-300 text-sm font-bold p-2'
        )}
      >
        CLIENT PREVIEW
      </div>
      <header
        className={cn(s.header, 'flex flex-col', {
          [s.hidden]: hidden
        })}
        style={
          {
            '--primary': primaryColor,
            '--secondary': secondaryColor,
            '--tertiary': tertiaryColor
          } as React.CSSProperties
        }
      >
        <div
          className={cn(s.noticebarC, {
            [s.hide]: noticebarHidden
          })}
        >
          <Noticebar announcement={props.announcement} />
        </div>
        <div
          className={cn(
            s.inner,
            'flex items-center justify-between tablet:justify-stretch relative'
          )}
        >
          <Link
            href="/"
            className={cn(
              s.logoC,
              'flex items-center justify-center cursor-pointer'
            )}
          >
            <IconLogo
              primary={primaryColor}
              secondary={secondaryColor}
              tertiary={tertiaryColor}
            />
          </Link>
          <div className="flex items-center gap-5">
            <div className="flex tablet:hidden">
              <CartModal />
            </div>
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
                <Link href={`/${routes.shop.url}`}>
                  <ComesInGoesOutUnderline label={routes.shop.ui} />
                </Link>
              </div>
              <div className={s.navItem}>
                <Link href={`/${routes.ourStory.url}`}>
                  <ComesInGoesOutUnderline label={routes.ourStory.ui} />
                </Link>
              </div>
            </div>
            <div
              className={cn(
                s.nav,
                'flex flex-col tablet:flex-row items-center justify-between gap-20'
              )}
            >
              <div className={cn(s.navItem)}>
                <Link href="mailto:kamola@mightyfull.com">
                  <ComesInGoesOutUnderline label="Contact Us" />
                </Link>
              </div>
              <div
                className="hidden tablet:block cursor-pointer"
                // onClick={() => setOpen(true)}
              >
                <CartModal />
              </div>
            </div>
          </nav>
        </div>
      </header>
    </>
  );
}
