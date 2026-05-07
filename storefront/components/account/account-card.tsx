import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface AccountCardProps {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function AccountCard({
  title,
  action,
  children,
  className
}: AccountCardProps) {
  return (
    <section
      className={cn(
        'rounded-2xl border border-blue-ruin/15 bg-sugar-milk p-6 md:p-8',
        className
      )}
    >
      {(title || action) && (
        <header className="flex items-start justify-between gap-4 mb-4">
          {title && (
            <h2 className="font-bomstad-display text-xl md:text-2xl font-bold text-blue-ruin">
              {title}
            </h2>
          )}
          {action && <div className="shrink-0">{action}</div>}
        </header>
      )}
      <div className="font-poppins text-blue-ruin">{children}</div>
    </section>
  );
}
