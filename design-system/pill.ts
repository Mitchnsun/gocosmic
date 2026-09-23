import { buttonVariants } from './button.variants';
import { cn } from './lib/utils';

/** Glow and hover lift of the primary pill; reduced motion keeps the pill still. */
const PRIMARY_MOTION =
  'shadow-[0_0_32px_rgb(255_79_0/0.4)] transition-transform duration-200 ease-[cubic-bezier(.16,1,.3,1)] hover:scale-[1.04] focus-visible:ring-2 focus-visible:ring-ghost focus-visible:ring-offset-2 focus-visible:ring-offset-void focus-visible:outline-none motion-reduce:transition-none motion-reduce:hover:scale-100';

/** The one primary action of a screen: orange pill, dark label, soft glow. */
export const primaryPill = (className?: string) =>
  cn(buttonVariants({ variant: 'aerospace', size: 'pill' }), 'hover:bg-aerospace', PRIMARY_MOTION, className);

/** Secondary action next to a primary pill: outlined, no glow. */
export const ghostPill = (className?: string) =>
  cn(
    buttonVariants({ variant: 'outline', size: 'pill' }),
    'font-medium focus-visible:ring-2 focus-visible:ring-ghost focus-visible:outline-none',
    className
  );

/** Layout rhythm shared by the page sections: 1280 px container and fluid vertical padding. */
export const CONTAINER = 'mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8';
export const SECTION_Y = 'py-[clamp(4rem,8vw,7.5rem)]';
