import type { IconSvgElement } from '@hugeicons/react';
import { HugeiconsIcon } from '@hugeicons/react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface AccountCardProps {
  icon?: IconSvgElement;
  eyebrow?: ReactNode;
  title?: ReactNode;
  action?: ReactNode;
  footer?: ReactNode;
  children?: ReactNode;
  className?: string;
  contentClassName?: string;
  as?: 'section' | 'article' | 'div';
}

/**
 * Canonical account-area card with three layers:
 *   1. Outer surface — sugar-milk body + soft brand-tinted shadow
 *      and border, so the card lifts off the page surface.
 *   2. Header band — saturated blue-ruin with sugar-milk text and
 *      a cream-tinted icon dot. In dark mode the swap inverts to a
 *      cream band on a blue body, preserving hierarchy.
 *   3. Body — sugar-milk surface for the actual content; the parent
 *      sets the foreground color so CardActionLink and other
 *      currentColor consumers adopt the right tone in either zone.
 */
export function AccountCard({
  icon,
  eyebrow,
  title,
  action,
  footer,
  children,
  className,
  contentClassName,
  as: Tag = 'section'
}: AccountCardProps) {
  const hasHeader = Boolean(icon || eyebrow || title || action);

  return (
    <Tag
      className={cn(
        'rounded-2xl border border-blue-ruin/15 bg-sugar-milk text-blue-ruin',
        'shadow-[0_1px_2px_rgb(0_119_224_/_0.04),_0_8px_24px_-8px_rgb(0_119_224_/_0.10)]',
        'flex flex-col overflow-hidden',
        className
      )}
    >
      {hasHeader && (
        <header className="flex items-start justify-between gap-4 px-5 md:px-6 py-4 bg-blue-ruin text-sugar-milk border-b border-blue-ruin">
          <div className="flex items-start gap-3 min-w-0">
            {icon && (
              <span
                aria-hidden="true"
                className="shrink-0 mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-full bg-sugar-milk/15 text-sugar-milk"
              >
                <HugeiconsIcon icon={icon} size={18} strokeWidth={1.75} />
              </span>
            )}
            <div className="flex flex-col gap-0.5 min-w-0">
              {eyebrow && (
                <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-sugar-milk/75">
                  {eyebrow}
                </span>
              )}
              {title && (
                <h2 className="font-bomstad-display text-xl md:text-2xl text-sugar-milk leading-tight">
                  {title}
                </h2>
              )}
            </div>
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </header>
      )}
      {children !== undefined && children !== null && children !== false && (
        <div
          className={cn(
            'px-5 md:px-6 py-5 md:py-6 flex flex-col gap-3',
            contentClassName
          )}
        >
          {children}
        </div>
      )}
      {footer && (
        <div className="border-t border-blue-ruin/10 px-5 md:px-6 py-3 flex flex-wrap items-center justify-between gap-3 text-sm">
          {footer}
        </div>
      )}
    </Tag>
  );
}
