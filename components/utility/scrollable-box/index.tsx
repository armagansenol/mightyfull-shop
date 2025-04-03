import s from './scrollable-box.module.scss';

import { gsap } from '@/components/gsap';
import cn from 'clsx';
import Lenis from 'lenis';
import { ReactNode, useRef, useState } from 'react';
import { useIsomorphicLayoutEffect } from 'usehooks-ts';

type Props = {
  children: ReactNode;
  wrapperClassName?: string;
  contentClassName?: string;
  infinite?: boolean;
  reset?: boolean;
  scrollTo?: string | null;
  orientation?: 'vertical' | 'horizontal';
};

const ScrollableBox = ({
  children,
  wrapperClassName,
  contentClassName,
  infinite,
  reset,
  scrollTo = null,
  orientation = 'vertical'
}: Props) => {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (!wrapperRef.current) return;
    if (!contentRef.current) return;

    const lenis = new Lenis({
      wrapper: wrapperRef.current, // element which has overflow
      content: contentRef.current, // usually wrapper's direct child
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
      orientation: orientation,
      gestureOrientation: orientation,
      smoothWheel: true,
      infinite
    });
    setLenis(lenis);

    return () => {
      lenis.destroy();
    };
  }, []);

  useIsomorphicLayoutEffect(() => {
    function update(time: number) {
      lenis?.raf(time * 1000);
    }

    gsap.ticker.add(update);
  }, [lenis]);

  useIsomorphicLayoutEffect(() => {
    if (reset) {
      lenis?.scrollTo(0, { immediate: true });
    }
  }, [reset]);

  useIsomorphicLayoutEffect(() => {
    if (!scrollTo) return;
    lenis?.scrollTo(scrollTo);
  }, [scrollTo]);

  return (
    <div className={cn(s.scrollableBox, wrapperClassName)} ref={wrapperRef}>
      <div className={cn(s.content, contentClassName)} ref={contentRef}>
        {children}
      </div>
    </div>
  );
};

export { ScrollableBox };
