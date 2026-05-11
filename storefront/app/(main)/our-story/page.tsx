'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useRef } from 'react';
import { Container } from '@/components/container';
import { Marquee } from '@/components/marquee';
import { Img } from '@/components/utility/img';
import { Wrapper } from '@/components/wrapper';
import { cn } from '@/lib/utils';
import s from './our-story.module.css';
import { StoryHero } from './story-hero';

gsap.registerPlugin(ScrollTrigger, SplitText);

export default function Page() {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const splits: SplitText[] = [];

      const run = () => {
        const q = <T extends HTMLElement = HTMLElement>(sel: string) =>
          Array.from(root.querySelectorAll<T>(sel));

        // ── Reveal each line, staggered ────────────────────────────────────
        q<HTMLElement>('[data-anim-lines]').forEach((el) => {
          const split = new SplitText(el, {
            type: 'lines',
            linesClass: 'split-line'
          });
          splits.push(split);
          gsap.set(split.lines, { opacity: 0, y: 24 });
          gsap.to(split.lines, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.08,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 82%',
              once: true
            }
          });
        });

        // ── Reveal each word, staggered (for big headings) ─────────────────
        q<HTMLElement>('[data-anim-words]').forEach((el) => {
          const split = new SplitText(el, {
            type: 'words',
            wordsClass: 'split-word'
          });
          splits.push(split);
          gsap.set(split.words, { opacity: 0, y: 36 });
          gsap.to(split.words, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.07,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 82%',
              once: true
            }
          });
        });

        // ── Mom-and-son card: fade + slight slide + scale ──────────────────
        q<HTMLElement>('[data-anim-mom]').forEach((el) => {
          gsap.set(el, { opacity: 0, x: -40, scale: 0.94 });
          gsap.to(el, {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 80%',
              once: true
            }
          });
        });

        // ── Cookie / family photo / helmet: simple opacity fade-in ─────────
        q<HTMLElement>(
          '[data-anim-cookie], [data-anim-fullimg], [data-anim-helmet]'
        ).forEach((el) => {
          gsap.set(el, { opacity: 0 });
          gsap.to(el, {
            opacity: 1,
            duration: 0.9,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              once: true
            }
          });
        });

        // ── Generic fade-up reveal ─────────────────────────────────────────
        q<HTMLElement>('[data-anim-fade-up]').forEach((el) => {
          gsap.set(el, { opacity: 0, y: 40 });
          gsap.to(el, {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              once: true
            }
          });
        });

        ScrollTrigger.refresh();
      };

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
        splits.forEach((sp) => sp.revert());
      };
    },
    { scope: rootRef }
  );

  return (
    <div ref={rootRef}>
      <Wrapper>
        {/* Section 1: Intro */}
        <section className={cn(s.intro, 'flex flex-col items-stretch')}>
          <Container>
            <StoryHero />
            <div
              className={cn(
                s.bottom,
                'flex flex-col items-center md:grid grid-cols-12 gap-5 md:gap-20'
              )}
            >
              <div className="col-span-6">
                <div className={s.imgC} data-anim-mom>
                  <Img
                    className="object-contain"
                    src="/img/mom-n-son.png"
                    height={1000}
                    width={1000}
                    alt="Mom and Son"
                  />
                </div>
              </div>
              <div className={cn(s.p, s.textC, 'col-span-6')}>
                <p data-anim-lines>
                  When my son casually said,{' '}
                  <strong className="italic">
                    &ldquo;Mom, I need to bulk up for football!&rdquo;
                  </strong>{' '}
                  I realized that &lsquo;bulking up&rsquo; wasn&rsquo;t about
                  buying bigger clothes—it was about nourishing him properly.
                  <br />
                  <br />
                  Frustrated by protein snacks that were tasteless or overly
                  processed, I set out to create something better: a cookie that
                  not only packs a nutritional punch but also tastes like a
                  homemade treat.
                </p>
              </div>
            </div>
            <div className={cn(s.cookieC, 'z-10')} data-anim-cookie>
              <Img
                className="object-contain"
                src="/img/c-pb-choco-oatie.png"
                height={500}
                width={500}
                alt="Cookie"
              />
            </div>
          </Container>
        </section>
        {/* Section 2: Full Image */}
        <section className={s.fullImgC}>
          <div className="absolute inset-0" data-anim-fullimg>
            <Img
              className="object-cover"
              src="/img/mighty-fam.jpg"
              fill
              sizes="100vw"
              alt="Lady holding a cookie"
            />
          </div>
        </section>
        {/* Section 3: Differences */}
        <Container as="section" className={s.differences}>
          <h2 data-anim-words>The Mightyfull Difference</h2>
          <div className="flex flex-col items-center md:items-start md:grid grid-cols-2 gap-5 md:gap-28">
            <div>
              <p className={s.p} data-anim-lines>
                Mightyfull Cookies are all about flavor, without the fuss.
                They&apos;re gluten-free, dairy-free, whey-free, and soy-free,
                so you can snack with confidence. These chewy, indulgent
                cookies deliver everything you crave—no artificial junk, just
                pure deliciousness.
              </p>
            </div>
            <div>
              <p className={s.p} data-anim-lines>
                With just the right touch of sweetness and a satisfying bite,
                each cookie is packed with enough protein to keep you fueled
                all day. They&apos;re perfect for anyone who wants to snack
                smarter without sacrificing taste.
              </p>
            </div>
          </div>
        </Container>
        {/* Section 4: Mission */}
        <section className={s.missionWrapper}>
          <Container
            className={cn(
              s.mission,
              'flex flex-col-reverse items-stretch md:grid grid-cols-12'
            )}
          >
            <div className={cn(s.text, 'col-span-6')}>
              <h2 data-anim-words>Our Mission</h2>
              <p data-anim-lines>
                We&apos;re on a mission to make healthy snacking easy,
                delicious, and accessible for everyone.
                <br />
                <br />
                Whether you&apos;re hitting the gym, powering through a busy
                workday, or simply craving something sweet, Mightyfull&apos;s
                got you. We believe that when you feel good about what
                you&apos;re eating, you feel ready to take on anything.
              </p>
            </div>
            <div className={cn(s.imageCol, 'col-span-6')}>
              <div className={cn(s.imgC, 'relative w-full h-full')}>
                <div className="absolute inset-0" data-anim-helmet>
                  <Img
                    className="w-full h-full object-cover"
                    src="/img/mightyfull-helmet.jpg"
                    alt="Mightyfull Helmet"
                    fill
                    sizes="50vw"
                  />
                </div>
              </div>
            </div>
          </Container>
        </section>
        {/* Section 5: What's Next */}
        <section className={cn(s.whatsNext, 'flex flex-col items-center')}>
          <div
            className={cn(s.titleC, 'w-full flex items-center justify-center')}
            data-anim-fade-up
          >
            <Marquee repeat={4}>
              <div className="flex items-center gap-20 mr-20">
                <h2>What&apos;s Next for Mightyfull?</h2>
                <span className={cn('block relative', s.iconC)}>
                  <Img
                    className="w-full h-full object-contain"
                    src="/img/c-pb-choco-oatie.png"
                    alt="Cookie"
                    fill
                    sizes="20vw"
                  />
                </span>
              </div>
            </Marquee>
          </div>
          <Container className="flex flex-col items-center">
            <p data-anim-lines>
              We&apos;re committed to growing our community and empowering
              others. As a women-owned brand, we believe in supporting fellow
              women entrepreneurs and giving back. As we scale, we plan to
              partner with small, women-owned businesses to help drive growth
              and create new opportunities in the industry.
            </p>
            <p data-anim-lines>
              <strong>
                So, the next time you&apos;re looking for a snack that&apos;s
                free of everything you don&apos;t want and packed with
                everything you do, remember Mightyfull.
              </strong>
            </p>
          </Container>
        </section>
      </Wrapper>
    </div>
  );
}
