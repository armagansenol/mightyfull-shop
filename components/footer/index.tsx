'use client';

import s from './footer.module.scss';

import cn from 'clsx';

import { IconCloud, socialIcons } from '@/components/icons';
import { Parallax } from '@/components/parallax';
import { Img } from '@/components/utility/img';
import { Link } from '@/components/utility/link';
import { useLayoutData } from '@/context/layout-data';
import { SocialMedia } from '@/types';

import c1 from '@/public/img/c1.png';
import c3 from '@/public/img/c3.png';
import c4 from '@/public/img/c4.png';
import c5 from '@/public/img/c5.png';

export function Footer() {
  const { socialLinks } = useLayoutData();
  const currentYear = new Date().getFullYear();

  const cookies = [
    {
      src: c1,
      rotation: 'rotate-[190deg]',
      className: s.cookie1,
      alt: 'Cookie Crumb 1'
    },
    {
      src: c3,
      rotation: '-rotate-6',
      className: s.cookie2,
      alt: 'Cookie Crumb 2'
    },
    {
      src: c3,
      rotation: '-rotate-90',
      className: s.cookie3,
      alt: 'Cookie Crumb 3'
    },
    {
      src: c4,
      rotation: '-rotate-6',
      className: s.cookie4,
      alt: 'Cookie Crumb 4'
    },
    {
      src: c5,
      rotation: 'rotate-6',
      className: s.cookie5,
      alt: 'Cookie Crumb 5'
    }
  ];

  return (
    <footer
      className={cn(s.footer, 'flex flex-col items-stretch justify-center')}
    >
      <div className={s.cloud}>
        <IconCloud fill="var(--blue-ruin)" />
      </div>
      <div className="flex flex-col tablet:flex-row items-center tablet:items-end justify-between">
        <div className={cn(s.actions, 'col-span-6')}>
          <h6>
            Stay mighty. <br />
            Stay full.
          </h6>
          <p>
            Be the first to know about new products, brand uptades, exclusive
            events, and more!
          </p>
        </div>
        <nav className={cn(s.nav, 'flex flex-col gap-10 tablet:gap-5')}>
          <Link href={`/shop`} className={s.navItem}>
            Shop
          </Link>
          <Link href={`/our-story`} className={s.navItem}>
            Our Story
          </Link>
          <Link href={`/contact`} className={s.navItem}>
            Contact Us
          </Link>
          <Link href={`/faq`} className={s.navItem}>
            FAQ
          </Link>
        </nav>
      </div>
      <div
        className={cn(
          s.copyright,
          'flex flex-col items-center tablet:flex-row tablet:items-center justify-between gap-10 tablet:gap-20'
        )}
      >
        <span className={s.c}>
          © {currentYear} Mightyfull, All Rights Reserved
        </span>
        <div className={cn(s.social, 'flex items-center space-x-4')}>
          {socialLinks.map((item, i) => {
            return (
              <Link
                className="w-8 h-8 cursor-pointer"
                href={item.url}
                key={i}
                aria-label={`Visit our ${item.platform} page`}
              >
                {socialIcons[item.platform as SocialMedia]('var(--white)')}
              </Link>
            );
          })}
        </div>
        <span className={cn(s.signature, 'ml-0 tablet:ml-auto')}>
          Credited to{' '}
          <Link
            className={cn(s.link, 'underline')}
            href="https://justdesignfx.com"
          >
            JUST DESIGN FX
          </Link>
        </span>
      </div>
      {cookies.map((cookie, index) => (
        <div key={index} className={cn(s.cookie, cookie.className)}>
          <Parallax>
            <Img
              alt={cookie.alt}
              className={cn('object-contain', cookie.rotation)}
              src={cookie.src}
              loading="lazy"
            />
          </Parallax>
        </div>
      ))}
    </footer>
  );
}
