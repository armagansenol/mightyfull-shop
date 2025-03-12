import s from '@/styles/buttons.module.scss';

import { cn } from '@/lib/utils';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-xl font-bold whitespace-nowrap focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        link: 'underline-offset-4 hover:underline',
        default: s.default,
        highlighted: s.highlighted
      },
      size: {
        sm: s.sm,
        md: s.md,
        lg: s.lg,
        icon: 'h-9 w-9'
      },
      padding: {
        fat: 'px-6 tablet:px-12 rounded-lg',
        slim: 'px-5 tablet:px-none w-full rounded-md tablet:rounded-lg',
        none: 'w-full h-full rounded-lg',
        square: 'p-4'
      },
      colorTheme: {
        'blue-ruin': s['blue-ruin'],
        themed: s.themed,
        'inverted-blue-ruin': s['inverted-blue-ruin'],
        'inverted-themed': s['inverted-themed'],
        'naked-blue-ruin': s['naked-blue-ruin'],
        'naked-themed': s['naked-themed'],
        'naked-full': s['naked-full']
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'md'
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  hoverAnimation?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      hoverAnimation = true,
      variant = 'default',
      size = 'md',
      padding = 'none',
      colorTheme = 'themed',
      asChild = false,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(
          'cursor-pointer',
          { [s['hover-animation']]: hoverAnimation },
          buttonVariants({
            variant,
            size,
            padding,
            colorTheme,
            className
          })
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
