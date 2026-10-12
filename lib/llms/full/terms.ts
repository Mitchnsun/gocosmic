import type { LegalSection } from '@/components/LegalDocument';

import { EN } from '../llms.messages';
import { link, pageUrl, section } from '../llms.utils';

/** The terms of sale, word for word: the only legal page the studio lets agents quote. */
export function buildTermsSection(): string {
  const t = EN.legal;
  const sections = (t.raw('terms.sections') as LegalSection[]).map(({ title, body }) => section(title, body, 3));

  return section(link(EN.footer('terms'), pageUrl('/terms')), [t('terms.updated'), t('terms.intro'), ...sections]);
}
