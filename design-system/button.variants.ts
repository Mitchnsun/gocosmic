import { cva } from 'class-variance-authority';

/**
 * Button styles. Screens mostly go through the `primaryPill()` / `ghostPill()`
 * helpers in `pill.ts`; use the variants directly for anything else.
 */
export const buttonVariants = cva(
  'inline-flex items-center justify-center cursor-pointer rounded-full transition-colors disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        /** Quiet neutral action. */
        default: 'bg-line text-fg hover:bg-line-2',
        /** The one main action of a screen. Dark text on orange: white only reaches 3.2:1, below WCAG AA. */
        primary: 'bg-aerospace text-void shadow-[0_0_32px_rgb(255_79_0/0.4)] hover:bg-aerospace/90',
        /** Secondary action: outlined, no fill. */
        ghost: 'border border-line-2 bg-transparent text-fg hover:border-fg hover:bg-line',
        /** Text action inside content, followed by an arrow. Pair with the `inline` size. */
        link: 'text-aerospace-ink rounded-none underline-offset-4 hover:underline',
        /* Plain accent fills, picked by the closing call-to-action's `accentColor`. */
        aerospace: 'bg-aerospace text-void hover:bg-aerospace/90',
        // Light label on royal in both themes: dark ink would drop to 3.4:1.
        // eslint-disable-next-line no-restricted-syntax
        royal: 'bg-royal text-ghost hover:bg-royal/90',
        jungle: 'bg-ok text-on-ok hover:bg-ok/90',
      },
      size: {
        default: 'font-normal text-base px-6 py-2',
        sm: 'font-light text-sm px-4 py-1',
        lg: 'font-bold text-lg px-8 py-2',
        icon: 'h-10 w-10',
        pill: 'h-12 gap-2.5 px-6 font-display text-base font-semibold',
        inline: 'gap-1.5 p-0 font-display font-semibold',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);
