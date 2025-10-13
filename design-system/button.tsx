'use client';

import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from './lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center cursor-pointer rounded-full transition-colors disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-neutral-950 text-neutral-50 hover:bg-neutral-800',
        aerospace: 'bg-aerospace text-neutral-50 hover:bg-aerospace/90',
        chocolate: 'bg-chocolate text-neutral-50 hover:bg-chocolate/90',
        'cosmic-latte': 'bg-cosmic-latte text-space hover:bg-cosmic-latte/90 hover:text-space/90',
        ghost: 'bg-ghost text-neutral-900 hover:bg-violet-50',
        jungle: 'bg-jungle text-white hover:bg-jungle/90',
        'misty-rose': 'bg-misty-rose text-space hover:bg-misty-rose/80',
        'outer-space': 'bg-outer-space text-neutral-50 hover:bg-outer-space/90',
        royal: 'bg-royal text-neutral-50 hover:bg-royal/90',
        space: 'bg-space text-neutral-50 hover:bg-space/90',
      },
      size: {
        default: 'font-normal text-base px-6 py-2',
        sm: 'font-light text-sm px-4 py-1',
        lg: 'font-bold text-lg px-8 py-2',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, onClick, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';

    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} onClick={onClick} {...props} />;
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
