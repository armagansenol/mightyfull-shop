'use client';

import { gsap, ScrollTrigger, useGSAP } from '@/components/gsap';
import { usePathname } from 'next/navigation';
import React, { useRef } from 'react';

interface ParallaxProps {
  children: React.ReactNode;
  speed?: number;
  direction?: 'vertical' | 'horizontal';
  className?: string;
}

export default function Parallax({
  children,
  speed = 1,
  direction = 'vertical',
  className = ''
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);
      const element = ref.current;
      if (!element) return;

      gsap.to(element, {
        yPercent: direction === 'vertical' ? -100 * speed : 0,
        xPercent: direction === 'horizontal' ? -100 * speed : 0,
        ease: 'none',
        scrollTrigger: {
          trigger: element,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
          refreshPriority: 100
        }
      });
    },
    {
      dependencies: [speed, direction, pathname],
      revertOnUpdate: true
    }
  );

  return (
    <div ref={ref} className={`parallax-container ${className}`}>
      {children}
    </div>
  );
}
