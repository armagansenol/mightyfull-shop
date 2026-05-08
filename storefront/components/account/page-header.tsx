import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
  className
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        'flex flex-col gap-4 md:flex-row md:items-end md:justify-between',
        className
      )}
    >
      <div className="flex flex-col gap-2 min-w-0">
        {eyebrow && (
          <div className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-ruin/70">
            {eyebrow}
          </div>
        )}
        <h1 className="font-bomstad-display text-3xl md:text-4xl font-bold text-blue-ruin leading-[1.05]">
          {title}
        </h1>
        {description && (
          <p className="text-sm md:text-base text-blue-ruin/75 max-w-prose">
            {description}
          </p>
        )}
      </div>
      {action && (
        <div className="shrink-0 flex items-center gap-2">{action}</div>
      )}
    </header>
  );
}
