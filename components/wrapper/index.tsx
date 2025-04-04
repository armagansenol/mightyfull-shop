'use client';

import s from './wrapper.module.css';

import cn from 'clsx';
import type { LenisOptions } from 'lenis';

import { Header } from '@/components/header';
import { Lenis } from '@/components/lenis';
import { ColorTheme } from '@/types';
import { useLayoutData } from '@/context/layout-data';
import { defaultColorTheme } from '@/lib/constants';

interface WrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  lenis?: boolean | LenisOptions;
  colorTheme?: ColorTheme;
  headerWithPadding?: boolean;
}

export function Wrapper({
  children,
  className,
  lenis = true,
  colorTheme = defaultColorTheme,
  headerWithPadding = false,
  ...props
}: WrapperProps) {
  const { noticebar } = useLayoutData();

  return (
    <div
      className={cn(s.wrapper, 'flex flex-col')}
      style={
        {
          '--primary': colorTheme.primary,
          '--secondary': colorTheme.secondary,
          '--tertiary': colorTheme.tertiary
        } as React.CSSProperties
      }
    >
      <Header withPadding={headerWithPadding} />
      <main
        className={cn('relative flex flex-col grow', className, {
          [s.withNoticebar]: noticebar.active
        })}
        {...props}
      >
        {children}
      </main>
      {lenis && <Lenis root options={typeof lenis === 'object' ? lenis : {}} />}
    </div>
  );
}
