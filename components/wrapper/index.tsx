'use client';

import s from './wrapper.module.css';

import cn from 'clsx';
import type { LenisOptions } from 'lenis';

import { Header } from '@/components/header';
import { Lenis } from '@/components/lenis';
import { ColorTheme } from '@/types';
import { useLayoutData } from '@/context/layout-data';
import { defaultColorTheme } from '@/lib/constants';
import { useEffect } from 'react';

interface WrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  lenis?: boolean | LenisOptions;
  colorTheme?: ColorTheme;
}

export function Wrapper({
  children,
  className,
  lenis = true,
  colorTheme = defaultColorTheme,
  ...props
}: WrapperProps) {
  const { noticebar } = useLayoutData();

  useEffect(() => {
    document.body.style.setProperty('--primary', colorTheme?.primary);
    document.body.style.setProperty('--secondary', colorTheme?.secondary);
    document.body.style.setProperty('--tertiary', colorTheme?.tertiary);

    return () => {
      document.body.style.removeProperty('--primary');
      document.body.style.removeProperty('--secondary');
      document.body.style.removeProperty('--tertiary');
    };
  }, [colorTheme]);

  return (
    <div
      className={cn(s.wrapper, 'flex flex-col', {
        [s.withNoticebar]: noticebar.active
      })}
      style={
        {
          '--primary': colorTheme.primary,
          '--secondary': colorTheme.secondary,
          '--tertiary': colorTheme.tertiary
        } as React.CSSProperties
      }
    >
      <Header />
      <main className={cn('relative flex flex-col grow', className)} {...props}>
        {children}
      </main>
      {lenis && <Lenis root options={typeof lenis === 'object' ? lenis : {}} />}
    </div>
  );
}
