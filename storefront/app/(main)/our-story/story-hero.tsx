'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { useRef } from 'react';
import { IconLeftArm, IconRightArm } from '@/components/icons';
import { Img } from '@/components/utility/img';
import { cn } from '@/lib/utils';
import s from './our-story.module.css';

gsap.registerPlugin(SplitText);

export function StoryHero() {
  const rootRef = useRef<HTMLDivElement>(null);
  const wordsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const descRef = useRef<HTMLParagraphElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const leftArmRef = useRef<HTMLDivElement>(null);
  const rightArmRef = useRef<HTMLDivElement>(null);

  const setWordRef = (i: number) => (el: HTMLSpanElement | null) => {
    wordsRef.current[i] = el;
  };

  useGSAP(
    () => {
      const desc = descRef.current;
      const left = leftArmRef.current;
      const right = rightArmRef.current;
      const bg = bgRef.current;
      if (!desc || !left || !right || !bg) return;

      const words = wordsRef.current.filter(
        (el): el is HTMLSpanElement => el !== null
      );
      const arms = [left, right];

      let split: SplitText | undefined;

      const run = () => {
        split = new SplitText(desc, {
          type: 'lines',
          linesClass: 'split-line'
        });

        gsap.set([...words, ...split.lines, ...arms, bg], { opacity: 0 });
        gsap.set(words, { y: 24 });
        gsap.set(split.lines, { y: 20 });
        gsap.set(left, { x: -50, scale: 0.5, rotate: -22 });
        gsap.set(right, { x: 50, scale: 0.5, rotate: 22 });
        gsap.set(bg, { scale: 0.35 });

        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        // 1. Title words: "The" → "Mightyfull" → "Story"
        tl.to(words, {
          opacity: 1,
          y: 0,
          duration: 0.55,
          stagger: 0.18
        });

        // 2. Background lights: shining sun reveal + settle
        tl.to(
          bg,
          {
            opacity: 1,
            scale: 1.08,
            duration: 0.7,
            ease: 'power3.out'
          },
          '-=0.1'
        ).to(bg, {
          scale: 1,
          duration: 0.4,
          ease: 'power2.inOut'
        });

        // 3. Arms slide in + double-bicep flex
        tl.to(
          arms,
          {
            opacity: 1,
            x: 0,
            rotate: 0,
            scale: 1.12,
            duration: 0.55,
            ease: 'back.out(2)'
          },
          '-=0.15'
        )
          .to(arms, { scale: 0.95, duration: 0.16, ease: 'power1.in' })
          .to(arms, { scale: 1.06, duration: 0.18, ease: 'power1.out' })
          .to(arms, { scale: 1, duration: 0.2, ease: 'power1.inOut' });

        // 4. Description: staggered lines
        tl.to(
          split.lines,
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.08
          },
          '-=0.1'
        );
      };

      // SplitText needs final layout to compute line breaks. Wait for
      // web fonts to be ready so the lines match what the user will see.
      if (
        typeof document !== 'undefined' &&
        document.fonts &&
        document.fonts.status !== 'loaded'
      ) {
        document.fonts.ready.then(run);
      } else {
        run();
      }

      return () => {
        split?.revert();
      };
    },
    { scope: rootRef }
  );

  return (
    <div ref={rootRef} className={cn('flex flex-col items-center')}>
      <div className={cn(s.titleC, 'flex items-center gap-3')}>
        <div
          ref={leftArmRef}
          className={s.iconC}
          style={{ transformOrigin: '0% 100%' }}
        >
          <IconLeftArm />
        </div>
        <h1 className={s.title}>
          <span ref={setWordRef(0)}>The</span>
          <span ref={setWordRef(1)}>Mightyfull</span>
          <span ref={setWordRef(2)}>Story</span>
          <div className={s.bg} ref={bgRef}>
            <div className={s.transform}>
              <Img
                className="object-contain"
                src="/img/lightrays.png"
                height={1000}
                width={1000}
                alt="Lightrays Background Image"
              />
            </div>
          </div>
        </h1>
        <div
          ref={rightArmRef}
          className={s.iconC}
          style={{ transformOrigin: '100% 100%' }}
        >
          <IconRightArm />
        </div>
      </div>
      <p ref={descRef} className={cn(s.p, s.desc)}>
        At Mightyfull, we believe snacking should do more than just satisfy
        cravings—it should fuel your body, uplift your day, and taste
        incredible. Our journey began with a simple moment in the kitchen.
      </p>
    </div>
  );
}
