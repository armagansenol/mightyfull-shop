'use client';

import s from './header.module.scss';

import { Cross1Icon, HamburgerMenuIcon } from '@radix-ui/react-icons';
import cn from 'clsx';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import CartModal from '@/components/cart-test/modal';
import { IconLogo } from '@/components/icons';
import { Link } from '@/components/utility/link';
import { routes } from '@/lib/constants';
import { useLenisStore } from '@/lib/store/lenis';
import { useTheme } from '@/lib/store/theme';
import Lenis from 'lenis';

// interface HeaderProps {
//   shopMenu?: ProductCollection[];
// }

export default function Header() {
// props: HeaderProps
  const { primaryColor, secondaryColor, tertiaryColor } = useTheme();
  const [hamburgerOpen, setHamburgerOpen] = useState(false);
  const { lenis } = useLenisStore();
  const [hidden, setHidden] = useState(false);
  const pathname = usePathname();

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
      <header
        className={cn(
          s.header,
          'flex items-center justify-between tablet:justify-stretch',
          {
            [s.hidden]: hidden
          }
        )}
        style={
          {
            '--primary': primaryColor,
            '--secondary': secondaryColor,
            '--tertiary': tertiaryColor
          } as React.CSSProperties
        }
      >
        <Link href="/" className={cn(s.logoC, 'cursor-pointer')}>
          <IconLogo
            primary={primaryColor}
            secondary={secondaryColor}
            tertiary={tertiaryColor}
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
              'flex flex-col tablet:flex-row items-center justify-between gap-20'
            )}
          >
            <div className={cn(s.navItem)}>
              <Link href="mailto:kamola@mightyfull.com">Contact Us</Link>
            </div>
            <div
              className="hidden tablet:block cursor-pointer"
              // onClick={() => setOpen(true)}
            >
              <CartModal />
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}
