'use client';

import cn from 'clsx';
import NextLink, { LinkProps as NextLinkProps } from 'next/link';
import React, { forwardRef, useMemo } from 'react';

interface LinkProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>,
    NextLinkProps {
  ariaLabel?: string;
  children: React.ReactNode;
  prefetch?: boolean;
}

const Link: React.ForwardRefRenderFunction<HTMLAnchorElement, LinkProps> = (
  {
    href,
    children,
    className,
    scroll = true,
    ariaLabel,
    prefetch = true,
    ...props
  },
  ref
) => {
  const isProtocol = useMemo(
    () =>
      typeof href === 'string' &&
      (href.startsWith('mailto:') || href.startsWith('tel:')),
    [href]
  );
  const isAnchor = useMemo(
    () => typeof href === 'string' && href.startsWith('#'),
    [href]
  );
  const isExternal = useMemo(
    () => typeof href === 'string' && href.startsWith('http'),
    [href]
  );

  if (href === undefined) {
    return (
      <button
        type="button"
        className={className}
        {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
        ref={ref as React.Ref<HTMLButtonElement>}
      >
        {children}
      </button>
    );
  }

  if (isProtocol || isExternal) {
    return (
      <a
        href={href.toString()}
        className={className}
        target="_blank"
        rel="noopener noreferrer"
        ref={ref}
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <NextLink
      href={href}
      passHref={isAnchor}
      scroll={scroll}
      aria-label={ariaLabel}
      className={cn('cursor-pointer', className)}
      ref={ref}
      {...props}
      prefetch={prefetch}
    >
      {children}
    </NextLink>
  );
};

const ForwardedLink = forwardRef(Link);

ForwardedLink.displayName = 'Link';

export { ForwardedLink as Link };
