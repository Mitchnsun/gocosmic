import { getLocalizedLocalBusinessData } from '@/components/JsonLd/JsonLd.utils';
import type { LegalSection } from '@/components/LegalDocument';
import { getCanonicalUrl } from '@/i18n/canonical';
import { LANGUAGES } from '@/i18n/locales';
import { BRAND_NAME, CONTACT_EMAIL, LEGACY_BRAND_NAME, SITE_URL, STUDIO_BASES, SUPPORT_EMAIL } from '@/lib/config';

import { EN } from './llms.messages';
import { link, list, pageUrl, section } from './llms.utils';

/**
 * How agents may use the files, worded and approved by the studio: the one sentence of `/llms.txt` and
 * `/llms-full.txt` that is not copy from the site.
 */
export const AGENT_USAGE =
  'AI assistants and agents may quote and summarise this content, linking to the page it comes from. Prices are net: Cosmic Studio is not registered for VAT.';

const LANGUAGE_NAMES = new Intl.DisplayNames('en', { type: 'language' });

/** Title, summary, usage note and who the studio is: the opening of both files. */
export function buildHeader(): string[] {
  return [
    `# ${BRAND_NAME}`,
    `> ${EN.common('meta.description')}`,
    AGENT_USAGE,
    getLocalizedLocalBusinessData('en').description,
    `${EN.about('lead')} Formerly ${LEGACY_BRAND_NAME}.`,
  ];
}

/** Home page of every language, in the regional or the Swiss version. */
const versionLinks = (swiss: boolean) =>
  LANGUAGES.map((language) =>
    link(LANGUAGE_NAMES.of(language) ?? language, getCanonicalUrl(swiss ? `${language}-CH` : language, '/'))
  ).join(' · ');

/** The two versions of every page, which agents cannot tell apart from the URLs alone. */
export function buildRegionsSection(): string {
  const terms = EN.legal.raw('terms.sections') as LegalSection[];
  // "Price and billing": which currency applies to which client.
  const currencies = terms[3]?.body[5];

  return section('Languages and regions', [
    list([
      `${EN.navigation('region.eu')}, studio base in ${STUDIO_BASES.fr.city}: ${versionLinks(false)}`,
      `${EN.navigation('region.ch')}, studio base in ${STUDIO_BASES.ch.city}: ${versionLinks(true)}`,
    ]),
    `${currencies} The amounts are the same in both currencies.`,
    `The links below point to the English version, in euros. The ${link('sitemap', `${SITE_URL}/sitemap.xml`)} lists every page in every version.`,
  ]);
}

/** Every way to reach the studio; the call booking only once its calendar is configured. */
export function buildContactSection(bookingUrl: string | null): string {
  const t = EN.contact;

  return section(EN.footer('link_contact'), [
    t('meta.description'),
    list([
      link(EN.navigation('contact_label'), pageUrl('/contact')),
      `${t('details.email_label')}: ${link(CONTACT_EMAIL, `mailto:${CONTACT_EMAIL}`)}`,
      `${t('details.support_label')}: ${link(SUPPORT_EMAIL, `mailto:${SUPPORT_EMAIL}`)}`,
      ...(bookingUrl ? [`${link(t('booking.title'), bookingUrl)}, ${t('booking.via')}`] : []),
      `${t('details.where_label')}: ${t('details.where.fr')}`,
    ]),
  ]);
}
