import { useTranslations } from 'next-intl';

import { SectionHeading } from '@/components/SectionHeading';
import { Link } from '@/i18n/navigation';

/** The three moments of a free mockup, announced next to the form. */
const STEPS = ['brief', 'design', 'deliver'] as const;

/**
 * Left-hand column of the free mockup page: what the offer is, how it unfolds
 * and what happens to the data a visitor sends.
 */
export function FreeMockupPitch() {
  const t = useTranslations('freeMockup');

  return (
    <div className="flex flex-col gap-6">
      <SectionHeading
        level={1}
        eyebrow={t('eyebrow')}
        title={t('title')}
        titleId="free-mockup-heading"
        titleClassName="text-[clamp(2.25rem,4.5vw,3.75rem)] leading-[1.02]"
        lead={t('intro')}
      />

      <section aria-labelledby="free-mockup-steps-heading" className="border-line rounded-2xl border p-6">
        <h2 id="free-mockup-steps-heading" className="font-display text-fg text-base font-semibold">
          {t('steps.title')}
        </h2>
        <ol className="mt-4 flex flex-col gap-4">
          {STEPS.map((step, index) => (
            <li key={step} className="flex gap-4">
              <span className="text-fg-3 pt-0.5 font-mono text-xs tracking-widest tabular-nums" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span>
                <span className="font-display text-fg block text-sm font-medium">{t(`steps.items.${step}.title`)}</span>
                <span className="text-fg-2 mt-1 block text-sm">{t(`steps.items.${step}.description`)}</span>
              </span>
            </li>
          ))}
        </ol>
      </section>

      <p className="text-fg-3 text-sm">
        {t('privacy_notice')}{' '}
        <Link
          href="/privacy"
          className="text-fg-2 hover:text-fg focus-visible:ring-aerospace-ink rounded underline underline-offset-4 transition-colors focus-visible:ring-2 focus-visible:outline-none">
          {t('privacy_link')}
        </Link>
        .
      </p>
    </div>
  );
}
