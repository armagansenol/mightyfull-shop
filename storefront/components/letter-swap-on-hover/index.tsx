'use client';

import { useRef } from 'react';

import LetterSwapForward from '@/components/letter-swap-forward';

export function LetterSwapOnHover({ label }: { label: string }) {
  const animationRef = useRef<(() => void) | null>(null);

  const triggerAnimation = () => {
    if (animationRef.current) {
      animationRef.current();
    }
  };

  return (
    <div
      className="w-full h-full flex items-center justify-center"
      onMouseEnter={triggerAnimation}
    >
      <LetterSwapForward label={label} animationRef={animationRef} />
    </div>
  );
}
