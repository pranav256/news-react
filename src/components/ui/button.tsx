import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex shrink-0 items-center justify-center gap-2 rounded-md text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground [@media(hover:hover)_and_(pointer:fine)]:hover:brightness-95',
        secondary:
          'bg-secondary text-secondary-foreground [@media(hover:hover)_and_(pointer:fine)]:hover:bg-muted',
        outline:
          'border border-border bg-transparent text-foreground [@media(hover:hover)_and_(pointer:fine)]:hover:bg-secondary',
        ghost: 'text-foreground [@media(hover:hover)_and_(pointer:fine)]:hover:bg-secondary',
        link: 'text-primary underline-offset-4 [@media(hover:hover)_and_(pointer:fine)]:hover:underline',
      },
      size: {
        default: 'min-h-11 px-5 py-2.5',
        sm: 'min-h-11 px-4',
        lg: 'min-h-12 px-6',
        icon: 'size-11 p-0',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
);
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        type={asChild ? undefined : 'button'}
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';
export { Button, buttonVariants };
