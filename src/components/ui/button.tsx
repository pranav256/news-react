import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// Delphi Button — extracted from delphi.ai
// Primary: tangerine pill with glassy inset highlights
// Secondary: white pill on cream with soft pillow shadow
// Ghost: borderless, soft hover
// Default radius: rounded-full (pill); icon size = 48x48 circle

const buttonVariants = cva(
  [
    "relative inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "text-sm font-medium",
    "rounded-full transition-[background,box-shadow,transform] duration-150 ease-out",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "disabled:pointer-events-none disabled:opacity-50",
    "active:scale-[0.98]",
  ].join(" "),
  {
    variants: {
      variant: {
        // Primary pill with glassy inset (hover = primary darkened)
        default:
          "bg-primary text-primary-foreground " +
          "shadow-[var(--shadow-tangerine-inset)] " +
           "[@media(hover:hover)_and_(pointer:fine)]:hover:bg-[color-mix(in_oklch,var(--primary)_82%,black_18%)]",
        // White pill on cream — pillow shadow
        secondary:
          "bg-card text-foreground " +
          "shadow-[var(--shadow-pillow)] " +
           "[@media(hover:hover)_and_(pointer:fine)]:hover:bg-secondary",
        // Outline — translucent, thin border
        outline:
          "border border-border bg-card/60 text-foreground backdrop-blur " +
           "[@media(hover:hover)_and_(pointer:fine)]:hover:bg-card",
        // Ghost — flat, surface hover
        ghost:
          "text-foreground " +
           "[@media(hover:hover)_and_(pointer:fine)]:hover:bg-secondary",
        // Destructive — same glassy inset as primary, rim derived from --destructive
        destructive:
          "bg-destructive text-destructive-foreground " +
          "shadow-[var(--shadow-destructive-inset)] " +
           "[@media(hover:hover)_and_(pointer:fine)]:hover:bg-[color-mix(in_oklch,var(--destructive)_90%,black_10%)]",
        // Link — blue secondary brand
         link: "text-primary underline-offset-4 [@media(hover:hover)_and_(pointer:fine)]:hover:underline rounded-none",
      },
      size: {
        default: "h-11 px-6 py-2.5",
        sm: "h-9 px-4 text-xs",
        lg: "h-14 px-8 text-base",
        icon: "h-12 w-12 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        type={asChild ? undefined : "button"}
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
