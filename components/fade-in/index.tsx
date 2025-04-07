'use client';

import { gsap, ScrollTrigger, useGSAP } from '@/components/gsap';
import { usePathname } from 'next/navigation';
import React, { useRef } from 'react';

interface FadeInProps {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
  className?: string;
}

export function FadeIn({
  children,
  duration = 1,
  delay = 0,
  className = ''
}: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);
      const element = ref.current;
      if (!element) return;

      gsap.fromTo(
        element,
        {
          autoAlpha: 0,
          transformStyle: 'preserve-3d',
          transformPerspective: 800,
          rotateX: 20
        },
        {
          duration: 1,
          ease: 'back.out',
          autoAlpha: 1,
          rotateX: 0,
          scrollTrigger: {
            start: 'center-=25% center+=40%',
            trigger: element,
            toggleActions: 'play none none reverse'
          }
        }
      );
    },
    {
      dependencies: [duration, delay, pathname],
      revertOnUpdate: true
    }
  );

  return (
    <div
      ref={ref}
      className={`fade-in-container ${className}`}
      style={{ opacity: 0 }}
    >
      {children}
    </div>
  );
}
