'use client';

import { CheckIcon } from '@heroicons/react/24/solid';
import { useEffect, useRef } from 'react';

import { cn } from '@/design-system/lib/utils';
import { usePrefersReducedMotion } from '@/lib/hooks/usePrefersReducedMotion';

/** Props for the post-submission confirmation panel. */
export interface ContactFormSuccessProps {
  /** Confirmation headline. */
  title: string;
  /** Supporting sentence. */
  description: string;
  /** Label of the button that returns to the form. */
  backLabel: string;
  /** Called when the visitor wants to send another message. */
  onBack: () => void;
  /** Additional classes for the wrapper. */
  className?: string;
}

/**
 * Confirmation screen shown in place of the form after a successful
 * submission. Focus moves to the panel so screen readers announce the result;
 * the check-mark pulse is dropped under reduced motion.
 *
 * @component
 */
export const ContactFormSuccess = ({ title, description, backLabel, onBack, className }: ContactFormSuccessProps) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion(true);

  useEffect(() => {
    panelRef.current?.focus();
  }, []);

  return (
    <div
      ref={panelRef}
      tabIndex={-1}
      role="status"
      aria-live="polite"
      data-reduced-motion={prefersReducedMotion ? 'true' : 'false'}
      className={cn('flex flex-col items-center gap-5 py-10 text-center focus:outline-none', className)}>
      <span
        className={cn(
          'border-jungle/40 text-jungle relative flex size-16 items-center justify-center rounded-full border'
        )}
        aria-hidden="true">
        {!prefersReducedMotion && <span className="bg-jungle/20 absolute inset-0 animate-ping rounded-full" />}
        <CheckIcon className="relative size-8" />
      </span>
      <h3 className="font-display text-ghost text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">{title}</h3>
      <p className="text-ghost/55 max-w-md text-base leading-7">{description}</p>
      <button
        type="button"
        onClick={onBack}
        className="border-ghost/15 text-ghost hover:border-ghost hover:bg-ghost/5 focus-visible:ring-ghost font-display mt-2 cursor-pointer rounded-full border px-6 py-2.5 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none">
        {backLabel}
      </button>
    </div>
  );
};
