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
        <header className="px-5 md:px-6 pt-5 md:pt-6 pb-3 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 min-w-0">
            {icon && (
              <span
                aria-hidden="true"
                className="shrink-0 mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-blue-ruin/20 bg-blue-ruin/[0.06] text-blue-ruin"
              >
                <HugeiconsIcon icon={icon} size={18} strokeWidth={1.75} />
              </span>
            )}
            <div className="flex flex-col gap-0.5 min-w-0">
              {eyebrow && (
                <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-account-subtle">
                  {eyebrow}
                </span>
              )}
              {title && (
                <h2 className="font-bomstad-display text-xl md:text-2xl text-blue-ruin leading-tight text-wrap-balance">
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
