import { useTranslations } from 'next-intl';

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
      <p className="text-aerospace text-2xs flex items-center gap-2 font-mono tracking-[0.24em] uppercase">
        <span className="bg-aerospace h-1.5 w-1.5 rounded-full" aria-hidden="true" />
        {t('eyebrow')}
      </p>
      <h1 className="font-display text-[clamp(2.25rem,6vw,4rem)] leading-[1.05] font-bold tracking-[-0.03em] text-balance">
        {t('title')}
      </h1>
      <p className="text-ghost/55 max-w-xl text-lg">{t('intro')}</p>

      <section aria-labelledby="free-mockup-steps-heading" className="border-ghost/8 rounded-2xl border p-6">
        <h2 id="free-mockup-steps-heading" className="font-display text-ghost text-base font-semibold">
          {t('steps.title')}
        </h2>
        <ol className="mt-4 flex flex-col gap-4">
          {STEPS.map((step, index) => (
            <li key={step} className="flex gap-4">
              <span className="text-ghost/35 pt-0.5 font-mono text-xs tracking-widest tabular-nums" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span>
                <span className="font-display text-ghost block text-sm font-medium">
                  {t(`steps.items.${step}.title`)}
                </span>
                <span className="text-ghost/55 mt-1 block text-sm">{t(`steps.items.${step}.description`)}</span>
              </span>
            </li>
          ))}
        </ol>
      </section>

      <p className="text-ghost/35 text-sm">
        {t('privacy_notice')}{' '}
        <Link href="/privacy" className="hover:text-ghost/55 underline transition">
          {t('privacy_link')}
        </Link>
        .
      </p>
    </div>
  );
}
