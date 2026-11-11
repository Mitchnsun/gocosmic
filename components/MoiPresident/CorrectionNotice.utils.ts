import { formatReleaseDate } from '@/components/CaseStudy/CaseStudy.utils';
import type { Correction } from '@/data/moi-president';
import { getLanguage } from '@/i18n/locales';

import type { CorrectionProps } from './MoiPresident.types';
import type { Translator } from './MoiPresident.utils';

/**
 * The correction on show, if any: its text in the page's language, French or English, and the English one
 * elsewhere (owner, 11/11/2026), marked as such for screen readers.
 */
export function buildCorrection(
  t: Translator,
  locale: string,
  correction: Correction | null
): CorrectionProps | undefined {
  if (!correction) return undefined;
  const language = getLanguage(locale) === 'fr' ? 'fr' : 'en';

  return {
    title: t('correction.title'),
    date: t('correction.date', { date: formatReleaseDate(correction.date, locale) }),
    text: correction.text[language],
    lang: language === getLanguage(locale) ? undefined : language,
  };
}
