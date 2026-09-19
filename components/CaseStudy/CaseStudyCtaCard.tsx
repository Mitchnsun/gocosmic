import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/solid';

import { buttonVariants } from '@/design-system/button.variants';
import { cn } from '@/design-system/lib/utils';
import { Link } from '@/i18n/navigation';

import type { CaseStudyProps } from './CaseStudy.types';

interface CaseStudyCtaCardProps {
  /** Project-specific call-to-action. */
  cta: NonNullable<CaseStudyProps['cta']>;
  /** Optional link back to the contact page. */
  contactCta?: CaseStudyProps['contactCta'];
  /** Accent variant for the primary button. */
  accent: NonNullable<CaseStudyProps['accent']>;
}

/**
 * Closing call-to-action of a case study: a link to the live project plus an
 * optional invitation to discuss a similar one.
 *
 * @component
 */
export const CaseStudyCtaCard = ({ cta, contactCta, accent }: CaseStudyCtaCardProps) => (
  <section
    aria-labelledby="case-study-cta-heading"
    className="border-ghost/8 bg-ghost/[0.02] flex flex-col items-center gap-5 rounded-2xl border px-6 py-12 text-center lg:p-12">
    <h2
      id="case-study-cta-heading"
      className="font-display text-[clamp(1.75rem,4vw,2.75rem)] font-semibold tracking-[-0.03em] text-balance">
      {cta.title}
    </h2>
    <p className="text-ghost/55 max-w-xl text-lg leading-8">{cta.description}</p>
    <div className="mt-2 flex flex-col items-center gap-3 sm:flex-row">
      {cta.href ? (
        <a
          href={cta.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={cta.ariaLabel}
          className={cn(
            buttonVariants({ variant: accent === 'ghost' ? 'ghost' : accent }),
            'focus-visible:ring-ghost focus-visible:ring-offset-void gap-2 py-3 transition-transform duration-300 ease-out hover:scale-105 focus-visible:ring-2 focus-visible:ring-offset-2 motion-reduce:scale-100! motion-reduce:transition-none!'
          )}>
          {cta.button}
          <ArrowTopRightOnSquareIcon className="size-4" aria-hidden="true" />
        </a>
      ) : (
        <button
          type="button"
          disabled
          aria-label={cta.ariaLabel}
          className={cn(buttonVariants({ variant: accent === 'ghost' ? 'ghost' : accent }), 'gap-2 py-3')}>
          {cta.button}
        </button>
      )}
      {contactCta && (
        <Link
          href={contactCta.href}
          className="border-ghost/15 text-ghost hover:border-ghost hover:bg-ghost/5 focus-visible:ring-ghost font-display rounded-full border px-6 py-3 text-base transition-colors focus-visible:ring-2 focus-visible:outline-none">
          {contactCta.label}
        </Link>
      )}
    </div>
  </section>
);
