import { ArrowRight01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from '@/components/utility/link';

interface CardActionLinkProps {
  href: string;
  children: ReactNode;
  prefetch?: boolean;
}

/**
 * Secondary link rendered in the corner of an account card header
 * (e.g. "View all", "Manage", "View details"). Pinned to its content
 * width so flex justify-between leaves it at the right edge; muted by
 * default with full-color hover; trailing chevron from hugeicons.
 */
export function CardActionLink({
  href,
  children,
  prefetch = false
}: CardActionLinkProps) {
  return (
    <Button
      asChild
      variant="link"
      size="sm"
      colorTheme="naked-blue-ruin"
      hoverAnimation={false}
      // Adopt surrounding color via currentColor + opacity, so the link
      // reads correctly both on the cream card body (blue-ruin parent)
      // and inside the saturated blue header band (sugar-milk parent).
      className="h-auto w-auto p-0 underline underline-offset-4 text-sm font-medium inline-flex items-center gap-1 opacity-80 hover:opacity-100 transition-opacity"
    >
      <Link href={href} prefetch={prefetch}>
        <span>{children}</span>
        <HugeiconsIcon
          icon={ArrowRight01Icon}
          size={14}
          strokeWidth={2}
          aria-hidden="true"
        />
      </Link>
    </Button>
  );
}
