import { buttonVariants } from './button.variants';
import { cn } from './lib/utils';

/** Hover lift of the primary pill; reduced motion keeps the pill still. */
const PRIMARY_MOTION =
  'transition-transform duration-200 ease-[cubic-bezier(.16,1,.3,1)] hover:scale-[1.04] focus-visible:ring-2 focus-visible:ring-fg focus-visible:ring-offset-2 focus-visible:ring-offset-bg focus-visible:outline-none motion-reduce:transition-none motion-reduce:hover:scale-100';

/** The one primary action of a screen: orange pill, dark label, soft glow. */
export const primaryPill = (className?: string) =>
  cn(buttonVariants({ variant: 'primary', size: 'pill' }), 'hover:bg-aerospace', PRIMARY_MOTION, className);

/** Secondary action next to a primary pill: outlined, no glow. */
export const ghostPill = (className?: string) =>
  cn(
    buttonVariants({ variant: 'ghost', size: 'pill' }),
    'font-medium focus-visible:ring-2 focus-visible:ring-fg focus-visible:outline-none',
    className
  );

/** Layout rhythm shared by the page sections: 1280 px container and fluid vertical padding. */
export const CONTAINER = 'mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8';
export const SECTION_Y = 'py-[clamp(3.5rem,6.5vw,6rem)]';
