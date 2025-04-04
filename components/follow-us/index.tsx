'use client';

import s from './follow-us.module.scss';

import cn from 'clsx';

import { AutoScrollCarousel } from '@/components/auto-scroll-carousel';
import { socialIcons } from '@/components/icons';
import { Img } from '@/components/utility/img';
import { Link } from '@/components/utility/link';
import { useLayoutData } from '@/context/layout-data';
import { SocialLink, SocialMedia } from '@/types';

export interface FollowUsProps {
  socialLinks: SocialLink[];
  images: string[];
}

export function FollowUs() {
  const { imageCarousel, socialLinks } = useLayoutData();

  console.log('imageCarousel', imageCarousel);

  return (
    <>
      <div className="tablet:border-y-[5px] tablet:border-solid tablet:border-[var(--blue-ruin)] flex flex-col tablet:flex-row items-stretch mb-8 tablet:mb-16">
        <p
          className={cn(
            s.title,
            'tablet:border-r-[5px] tablet:border-solid tablet:border-[var(--blue-ruin)] flex items-center justify-center'
          )}
        >
          Join Our Family
        </p>
        <div
          className={cn(
            s.social,
            'col-span-9 flex items-center justify-center tablet:justify-start gap-4 tablet:gap-8'
          )}
        >
          {socialLinks.map((item, i) => {
            return (
              <Link
                className={cn(s.iconC, 'w-8 h-8 cursor-pointer')}
                href={item.url}
                key={i}
              >
                {socialIcons[item.platform as SocialMedia]('var(--blue-ruin)')}
              </Link>
            );
          })}
        </div>
      </div>
      {imageCarousel.length > 0 && (
        <AutoScrollCarousel options={{ loop: true, dragFree: true }}>
          {[...imageCarousel, ...imageCarousel].map((img, i) => {
            return (
              <div className={s.imgC} key={i}>
                <Img
                  className="object-cover"
                  src={img.url}
                  height={500}
                  width={500}
                  alt="Product Visual"
                />
              </div>
            );
          })}
        </AutoScrollCarousel>
      )}
    </>
  );
}
