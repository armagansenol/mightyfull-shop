'use client';

import cn from 'clsx';
import type { LenisOptions } from 'lenis';

import { Header } from '@/components/header';
import { Lenis } from '@/components/lenis';
import { ColorTheme } from '@/types';

interface WrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  lenis?: boolean | LenisOptions;
  colorTheme: ColorTheme;
  headerWithPadding?: boolean;
}

export function Wrapper({
  children,
  className,
  lenis = true,
  colorTheme,
  headerWithPadding = false,
  ...props
}: WrapperProps) {
  return (
    <div
      style={
        {
          '--primary': colorTheme.primary,
          '--secondary': colorTheme.secondary,
          '--tertiary': colorTheme.tertiary
        } as React.CSSProperties
      }
    >
      <Header withPadding={headerWithPadding} />
      <main className={cn('relative flex flex-col grow', className)} {...props}>
        {children}
      </main>
      {lenis && <Lenis root options={typeof lenis === 'object' ? lenis : {}} />}
    </div>
  );
}
