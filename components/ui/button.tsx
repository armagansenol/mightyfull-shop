import s from "@/styles/buttons.module.scss"

import { cn } from "@/lib/utils"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-xl whitespace-nowrap focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 tablet:[&_svg]:size-6 [&_svg]:shrink-0 [&>*]:pointer-events-none",
  {
    variants: {
      variant: {
        link: "underline-offset-4 hover:underline",
        default: s.default,
        naked: s.naked,
        inverted: s.inverted,
        highlighted: s.highlighted,
      },
      size: {
        sm: s.sm,
        md: s.md,
        lg: s.lg,
        icon: "h-9 w-9",
      },
      theme: {
        lean: s.lean,
        primary: s.primary,
        secondary: s.secondary,
      },
      padding: {
        fat: "py-4 px-6 tablet:py-5 tablet:px-12 rounded-lg",
        slim: "py-2 px-5 tablet:py-3 tablet:px-none w-full rounded-md tablet:rounded-lg",
        none: "w-full h-full rounded-lg",
        square: "p-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", padding = "fat", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(
          "cursor-pointer",
          buttonVariants({
            variant,
            size,
            padding,
            className,
          })
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
