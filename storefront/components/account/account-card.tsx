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
 * Canonical account-area card. Composes the brand surface
 * (rounded-2xl + sugar-milk + blue-ruin/15 border) with optional
 * icon-led header, eyebrow, title, corner action, and footer slot.
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
        'rounded-2xl border border-blue-ruin/15 bg-sugar-milk text-blue-ruin shadow-[0_1px_0_0_rgb(0_119_224_/_0.04)]',
        'flex flex-col',
        className
      )}
    >
      {hasHeader && (
        <header className="flex items-start justify-between gap-4 p-5 md:p-6 pb-4">
          <div className="flex items-start gap-3 min-w-0">
            {icon && (
              <span
                aria-hidden="true"
                className="shrink-0 mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-full bg-blue-ruin/10 text-blue-ruin"
              >
                <HugeiconsIcon icon={icon} size={18} strokeWidth={1.75} />
              </span>
            )}
            <div className="flex flex-col gap-0.5 min-w-0">
              {eyebrow && (
                <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-blue-ruin/70">
                  {eyebrow}
                </span>
              )}
              {title && (
                <h2 className="font-bomstad-display text-xl md:text-2xl text-blue-ruin leading-tight">
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
            'px-5 md:px-6 pb-5 md:pb-6 flex flex-col gap-3',
            !hasHeader && 'pt-5 md:pt-6',
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
