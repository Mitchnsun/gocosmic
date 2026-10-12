import { CODE_HANDOVER_MONTHS } from '@/lib/pricing/offers';

import { EN } from '../llms.messages';
import { item, keysOf, link, pageUrl, section, valuesOf } from '../llms.utils';

const PROCESS_STEPS = ['discovery', 'design', 'build', 'launch'] as const;

/** The homepage: who the studio works for, why a studio, its process and the person behind it. */
export function buildHomeSection(): string {
  const t = EN.home;
  const months = String(CODE_HANDOVER_MONTHS);

  return section(link(EN.navigation('home_menu'), pageUrl('/')), [
    t('hero.subtitle'),
    section(
      t('audience.title'),
      [
        keysOf(t.raw('audience.items'))
          .map((key) => item(t(`audience.items.${key}.title`), t(`audience.items.${key}.description`)))
          .join('\n'),
      ],
      3
    ),
    section(
      t('why.title'),
      [
        t('why.lead'),
        keysOf(t.raw('why.reasons'))
          .map((key) => item(t(`why.reasons.${key}.title`), t(`why.reasons.${key}.description`, { months })))
          .join('\n'),
      ],
      3
    ),
    section(
      t('process.title'),
      [
        t('process.subtitle'),
        PROCESS_STEPS.map((step) =>
          item(`${t(`process.${step}.label`)} · ${t(`process.${step}.title`)}`, t(`process.${step}.description`))
        ).join('\n'),
      ],
      3
    ),
    section(t('studio.title'), valuesOf(t.raw('studio.paragraphs')), 3),
  ]);
}
