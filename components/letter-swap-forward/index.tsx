'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  AnimationOptionsWithValueOverrides,
  motion,
  stagger,
  useAnimate
} from 'motion/react';
import React from 'react';

interface TextProps {
  label: string;
  reverse?: boolean;
  transition?: AnimationOptionsWithValueOverrides;
  staggerDuration?: number;
  staggerFrom?: 'first' | 'last' | 'center' | number;
  className?: string;
  onClick?: () => void;
  animationRef?: React.MutableRefObject<(() => void) | null>;
}

const LetterSwapForward = ({
  label,
  reverse = true,
  transition = {
    type: 'spring',
    duration: 0.7
  },
  staggerDuration = 0.03,
  staggerFrom = 'first',
  className,
  onClick,
  animationRef,
  ...props
}: TextProps) => {
  const [scope, animate] = useAnimate();
  const [blocked, setBlocked] = useState(false);

  const startAnimation = useCallback(() => {
    if (blocked) return;

    setBlocked(true);

    // Function to merge user transition with stagger and delay
    const mergeTransition = (
      baseTransition: AnimationOptionsWithValueOverrides
    ) => ({
      ...baseTransition,
      delay: stagger(staggerDuration, {
        from: staggerFrom
      })
    });

    animate(
      '.letter',
      { y: reverse ? '100%' : '-100%' },
      mergeTransition(transition)
    ).then(() => {
      animate(
        '.letter',
        {
          y: 0
        },
        {
          duration: 0
        }
      ).then(() => {
        setBlocked(false);
      });
    });

    animate(
      '.letter-secondary',
      {
        top: '0%'
      },
      mergeTransition(transition)
    ).then(() => {
      animate(
        '.letter-secondary',
        {
          top: reverse ? '-100%' : '100%'
        },
        {
          duration: 0
        }
      );
    });
  }, [blocked, animate, reverse, transition, staggerDuration, staggerFrom]);

  // Expose the animation function to parent via ref
  useEffect(() => {
    if (animationRef) {
      animationRef.current = startAnimation;
    }
  }, [animationRef, startAnimation]);

  // Rename hoverStart to use our reusable function
  const hoverStart = startAnimation;

  return (
    <span
      className={`flex justify-center items-center relative overflow-hidden cursor-pointer ${className} pointer-events-none tablet:pointer-events-auto`}
      onMouseEnter={hoverStart}
      onClick={onClick}
      ref={scope}
      {...props}
    >
      <span className="sr-only">{label}</span>

      {label.split('').map((letter: string, i: number) => {
        return (
          <span className="whitespace-pre relative flex" key={i}>
            <motion.span className={`relative letter`} style={{ top: 0 }}>
              {letter}
            </motion.span>
            <motion.span
              className="absolute letter-secondary"
              aria-hidden={true}
              style={{ top: reverse ? '-100%' : '100%' }}
            >
              {letter}
            </motion.span>
          </span>
        );
      })}
    </span>
  );
};

export default LetterSwapForward;
