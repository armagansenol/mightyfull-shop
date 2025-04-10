'use client';

import s from './animated-card.module.scss';

import cx from 'clsx';
import { useRef } from 'react';

import { CustomizedPortableText } from '@/components/customized-portable-text';
import { gsap, ScrollTrigger, useGSAP } from '@/components/gsap';
import { Img } from '@/components/utility/img';
import { AnimatedCardProps } from '@/types';

export function AnimatedCard(props: AnimatedCardProps) {
  const ref = useRef(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  const { contextSafe } = useGSAP(
    () => {
      if (ScrollTrigger.isTouch) return;

      const duration = 1;

      tl.current = gsap
        .timeline({ paused: true })
        .to(
          '.gsap-package',
          {
            yPercent: -100,
            duration,
            ease: 'back.inOut(1.7)'
          },
          's'
        )
        .to(
          '.gsap-cookie',
          {
            yPercent: -100,
            duration,
            delay: 0.4,
            ease: 'back.out(1.7)'
          },
          's'
        )
        .to(
          '.gsap-bg',
          {
            backgroundColor: props.product.colorTheme.tertiary
          },
          's'
        )
        .to(
          '.gsap-text',
          {
            scale: 1,
            y: 0,
            duration,
            ease: 'back.inOut(1.7)'
          },
          's'
        )
        .to(
          '.gsap-img-cookie',
          {
            scale: 1,
            duration
          },
          's'
        );
    },
    { scope: ref }
  );

  const mouseIn = contextSafe(() => {
    if (ScrollTrigger.isTouch) return;
    tl.current?.play();
  });
  const mouseOut = contextSafe(() => {
    if (ScrollTrigger.isTouch) return;
    tl.current?.reverse();
  });

  return (
    <div
      ref={ref}
      className={cx(s.animatedCard, 'animated-card')}
      onMouseEnter={mouseIn}
      onMouseLeave={mouseOut}
    >
      <div className={cx(s.bg, 'gsap-bg')}></div>
      <div
        className={cx(
          s.package,
          'gsap-package',
          'flex flex-col items-center justify-center'
        )}
      >
        <div className={s.imgC}>
          <Img
            className="object-contain"
            src={props.imgPackage.url}
            height={props.imgPackage.height}
            width={props.imgPackage.width}
            alt="Picture of a Cookie Package"
            priority
          />
        </div>
      </div>
      <div
        className={cx(s.cookie, 'gsap-cookie', 'flex flex-col items-center')}
      >
        <div
          className={cx(s.text, 'gsap-text')}
          style={{ color: props.product.colorTheme.primary }}
        >
          {props.displayTitle.length > 0 && (
            <CustomizedPortableText content={props.displayTitle} />
          )}
        </div>
        <div className={cx(s.imgC, 'gsap-img-cookie')}>
          <Img
            className="object-contain"
            src={props.imgCookie.url}
            height={props.imgCookie.height}
            width={props.imgCookie.width}
            alt="Picture of a Cookie"
          />
        </div>
      </div>
    </div>
  );
}
