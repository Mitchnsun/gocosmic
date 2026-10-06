import { ArrowRightIcon } from '@heroicons/react/24/solid';

import { buttonVariants } from '@/design-system/button.variants';
import { ghostPill, primaryPill } from '@/design-system/pill';

import { SAMPLE } from './DesignSystemShowcase.copy';

/** The pill helpers, then every `buttonVariants()` variant. Buttons do nothing: they are samples. */
export function ButtonGallery() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <button type="button" className={primaryPill()}>
        {SAMPLE.primary}
        <ArrowRightIcon className="size-4" aria-hidden="true" />
      </button>
      <button type="button" className={ghostPill()}>
        {SAMPLE.secondary}
      </button>
      <button type="button" className={buttonVariants({ variant: 'default' })}>
        {SAMPLE.neutral}
      </button>
      <button type="button" className={buttonVariants({ variant: 'link', size: 'inline' })}>
        {SAMPLE.link}
      </button>
      <button type="button" className={buttonVariants({ variant: 'royal' })}>
        royal
      </button>
      <button type="button" className={buttonVariants({ variant: 'jungle' })}>
        jungle
      </button>
    </div>
  );
}
