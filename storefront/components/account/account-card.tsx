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
 * Brutalist-leaning card:
 *   - Outer surface: thick blue-ruin border, sugar-milk body, no shadow.
 *   - Header is an inset "island" — a solid blue-ruin block with the
 *     same border radius as the outer surface, separated from the
 *     border by margin so it visually floats inside the card.
 *   - Body and footer share consistent radii and a thick divider rule.
 *
 * In dark mode the token swap inverts: a cream island on a blue body,
 * preserving the same hierarchy.
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
        'rounded-xl border-2 border-blue-ruin bg-sugar-milk text-blue-ruin',
        'flex flex-col',
        className
      )}
    >
      {hasHeader && (
        <header className="m-3 md:m-4 px-4 md:px-5 py-3.5 md:py-4 rounded-xl bg-blue-ruin text-sugar-milk flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 min-w-0">
            {icon && (
              <span
                aria-hidden="true"
                className="shrink-0 mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-full border-2 border-sugar-milk text-sugar-milk"
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
            !hasHeader && 'pt-5 md:pt-6',
            hasHeader && 'pt-1 md:pt-2',
            contentClassName
          )}
        >
          {children}
        </div>
      )}
      {footer && (
        <div className="border-t-2 border-blue-ruin px-5 md:px-6 py-3 flex flex-wrap items-center justify-between gap-3 text-sm">
          {footer}
        </div>
      )}
    </Tag>
  );
}
