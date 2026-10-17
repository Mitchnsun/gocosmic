import { PROJECTS_BY_SLUG } from '@/components/CaseStudy';
import { BASE_PRICE, FORMULA_INCLUDES, FORMULA_PRICES } from '@/components/PricingSimulator/constants';
import { SHOWCASE_WEBSITE } from '@/data/content-pages';
import { CODE_HANDOVER_MONTHS } from '@/lib/pricing/offers';

import { FR } from '../llms.messages';
import { frenchPageUrl, inEurosInFrench, item, link, list, section, valuesOf } from '../llms.utils';

/** The case studies backing a French page, each with the description of its card. */
const projectLinks = (slugs: readonly (keyof typeof PROJECTS_BY_SLUG)[]) =>
  list(
    slugs.map((slug) => {
      const { href, i18nKey } = PROJECTS_BY_SLUG[slug];
      const title = FR.projectsList(`items.${i18nKey}.title`);
      return `${link(title, frenchPageUrl(href))}: ${FR.projectsList(`items.${i18nKey}.description`)}`;
    })
  );

/** The showcase website page: what such a site shows, what is included, the options, delays and examples. */
export function buildShowcaseWebsiteSection(): string {
  const t = FR.showcaseWebsite;
  const includes = FORMULA_INCLUDES.managed.map((key) => FR.pricing(`builder.base.includes.${key}`));
  const options = SHOWCASE_WEBSITE.options.map((option) =>
    item(FR.pricing(`builder.options.${option}.label`), FR.pricing(`builder.options.${option}.hint`))
  );
  const prices = { price: inEurosInFrench(BASE_PRICE), selfServicePrice: inEurosInFrench(FORMULA_PRICES.self_service) };

  return section(link(FR.contentPages('links.showcase_website.label'), frenchPageUrl('/showcase-website')), [
    t('intro.lead'),
    section(t('shows.title'), [t('shows.lead'), list(valuesOf(t.raw('shows.points')))], 3),
    section(
      t('price.title'),
      [
        t('price.lead', prices),
        section(t('price.included'), [list(includes)], 4),
        t('price.note'),
        link(t('price.action'), frenchPageUrl('/pricing')),
      ],
      3
    ),
    section(t('options.title'), [t('options.lead'), options.join('\n')], 3),
    section(
      t('timing.title'),
      [
        [
          item(t('timing.delay'), FR.services('faq.items.timing.answer')),
          item(t('timing.ownership'), t('timing.ownership_text', { months: String(CODE_HANDOVER_MONTHS) })),
        ].join('\n'),
      ],
      3
    ),
    section(t('projects.title'), [t('projects.lead'), projectLinks(SHOWCASE_WEBSITE.projects)], 3),
  ]);
}
