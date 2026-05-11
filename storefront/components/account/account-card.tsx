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
        'rounded-xl border border-blue-ruin/20 bg-sugar-milk text-blue-ruin',
        'flex flex-col transition-[border-color,background-color,transform] duration-300 ease-out',
        className
      )}
    >
      {hasHeader && (
        <header className="px-5 md:px-6 pt-5 md:pt-6 pb-4 flex items-center justify-between gap-4">
          <div
            className={cn(
              'grid items-center gap-3.5 min-w-0',
              icon
                ? 'grid-cols-[2.75rem_minmax(0,1fr)]'
                : 'grid-cols-[minmax(0,1fr)]'
            )}
          >
            {icon && (
              <span
                aria-hidden="true"
                className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-blue-ruin/25 bg-blue-ruin/[0.05] text-blue-ruin"
              >
                <HugeiconsIcon icon={icon} size={19} strokeWidth={1.75} />
              </span>
            )}
            <div className="flex min-w-0 flex-col justify-center gap-1">
              {eyebrow && (
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] leading-none text-account-subtle">
                  {eyebrow}
                </span>
              )}
              {title && (
                <h2 className="font-bomstad-display text-xl md:text-2xl text-blue-ruin leading-[0.98] text-wrap-balance">
                  {title}
                </h2>
              )}
            </div>
          </div>
          {action && <div className="shrink-0 self-center">{action}</div>}
        </header>
      )}
      {children !== undefined && children !== null && children !== false && (
        <div
          className={cn(
            'px-5 md:px-6 py-5 md:py-6 flex flex-col gap-4',
            !hasHeader && 'pt-5 md:pt-6',
            hasHeader && 'pt-0',
            contentClassName
          )}
        >
          {children}
        </div>
      )}
      {footer && (
        <div className="border-t border-blue-ruin/15 px-5 md:px-6 py-3 flex flex-wrap items-center justify-between gap-3 text-sm">
          {footer}
        </div>
      )}
    </Tag>
  );
}
