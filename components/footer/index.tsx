import s from './footer.module.scss';

import cn from 'clsx';

import { IconCloud, socialIcons } from '@/components/icons';
import { Parallax } from '@/components/parallax';
import { Img } from '@/components/utility/img';
import { Link } from '@/components/utility/link';
import { SocialMedia } from 'types';
import { SocialLink } from 'types/layout';

import c1 from '@/public/img/c1.png';
import c3 from '@/public/img/c3.png';
import c4 from '@/public/img/c4.png';
import c5 from '@/public/img/c5.png';

interface FooterProps {
  socialLinks: SocialLink[];
}

export async function Footer(props: FooterProps) {
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
          <Link href="mailto:kamola@mightyfull.com" className={s.navItem}>
            Contact Us
          </Link>
        </nav>
      </div>
      <div
        className={cn(
          s.copyright,
          'flex flex-col items-center tablet:flex-row tablet:items-center justify-between gap-10 tablet:gap-20'
        )}
      >
        <span className={s.c}>© 2025 Mightyfull, All Rights Reserved</span>
        <div className={cn(s.social, 'flex items-center space-x-4')}>
          {props.socialLinks.map((item, i) => {
            return (
              <Link className="w-8 h-8 cursor-pointer" href={item.url} key={i}>
                {socialIcons[item.platform as SocialMedia]}
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
      <div className={cn(s.cookie, s.cookie1)}>
        <Parallax>
          <Img
            alt="Cookie Crumb"
            className="object-contain rotate-[190deg]"
            src={c1}
          />
        </Parallax>
      </div>
      <div className={cn(s.cookie, s.cookie2)}>
        <Parallax>
          <Img
            alt="Cookie Crumb"
            className="object-contain -rotate-6"
            src={c3}
          />
        </Parallax>
      </div>
      <div className={cn(s.cookie, s.cookie3)}>
        <Parallax>
          <Img
            alt="Cookie Crumb"
            className="object-contain -rotate-90"
            src={c3}
          />
        </Parallax>
      </div>
      <div className={cn(s.cookie, s.cookie4)}>
        <Parallax>
          <Img
            alt="Cookie Crumb"
            className="object-contain -rotate-6"
            src={c4}
          />
        </Parallax>
      </div>
      <div className={cn(s.cookie, s.cookie5)}>
        <Parallax>
          <Img
            alt="Cookie Crumb"
            className="object-contain rotate-6"
            src={c5}
          />
        </Parallax>
      </div>
    </footer>
  );
}
