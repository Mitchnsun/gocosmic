'use client';

import { useTranslations } from 'next-intl';

import { primaryPill } from '@/design-system/pill';
import { Link } from '@/i18n/navigation';

/** Where the guide stops for a need outside the simulator: a sentence and a link to the contact page. The guide announces it. */
export function GuideOutcome({ outcome }: { outcome: 'contact' | 'quote' }) {
  const t = useTranslations('pricing.guide');

  return (
    <div className="border-line flex flex-col gap-4 border-t pt-6">
      <p className="text-fg max-w-[60ch]">{t(`${outcome}_outcome.text`)}</p>
      <Link href="/contact" className={primaryPill('w-fit')}>
        {t(`${outcome}_outcome.cta`)}
      </Link>
    </div>
  );
}
