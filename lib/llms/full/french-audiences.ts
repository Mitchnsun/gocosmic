import { BASE_PRICE } from '@/components/PricingSimulator/constants';
import type { AddOnKey } from '@/components/PricingSimulator/PricingSimulator.types';
import { WEBSITE_FOR_ASSOCIATIONS, WEBSITE_FOR_FREELANCERS, WEBSITE_FOR_TRADESPEOPLE } from '@/data/content-pages';

import { FR } from '../llms.messages';
import { frenchPageUrl, inEurosInFrench, item, keysOf, link, list, section, valuesOf } from '../llms.utils';
import { examplePlanText, projectLinks } from './french-pages.shared';

/** The simulator options a page recommends, each with its hint. */
function optionItems(options: readonly AddOnKey[]): string[] {
  const domain = FR.pricing('builder.options.example_domain.fr');
  return options.map((option) =>
    item(FR.pricing(`builder.options.${option}.label`), FR.pricing(`builder.options.${option}.hint`, { domain }))
  );
}

/** The page for associations and clubs: what the site gathers, the features, an example, the questions, the cases. */
export function buildWebsiteForAssociationsSection(): string {
  const t = FR.websiteForAssociations;
  const price = inEurosInFrench(BASE_PRICE);

  return section(
    link(FR.contentPages('links.website_for_associations.label'), frenchPageUrl('/website-for-associations')),
    [
      t('intro.lead'),
      section(t('needs.title'), [t('needs.lead'), list(valuesOf(t.raw('needs.points')))], 3),
      section(
        t('features.title'),
        [
          t('features.lead'),
          keysOf(t.raw('features.items'))
            .map((key) => item(t(`features.items.${key}.term`), t(`features.items.${key}.description`)))
            .join('\n'),
        ],
        3
      ),
      section(t('example.title'), [t('example.lead'), examplePlanText(WEBSITE_FOR_ASSOCIATIONS.example)], 3),
      section(
        t('questions.title'),
        [
          keysOf(t.raw('questions.items'))
            .map((key) => item(t(`questions.items.${key}.question`), t(`questions.items.${key}.answer`, { price })))
            .join('\n'),
        ],
        3
      ),
      section(t('projects.title'), [t('projects.lead'), projectLinks(WEBSITE_FOR_ASSOCIATIONS.projects)], 3),
    ]
  );
}

/** The page for tradespeople: what the site says, being found on Google, the options, an example, the free mockup. */
export function buildWebsiteForTradespeopleSection(): string {
  const t = FR.websiteForTradespeople;
  const options = optionItems(WEBSITE_FOR_TRADESPEOPLE.options);

  return section(
    link(FR.contentPages('links.website_for_tradespeople.label'), frenchPageUrl('/website-for-tradespeople')),
    [
      t('intro.lead'),
      section(t('says.title'), [t('says.lead'), list(valuesOf(t.raw('says.points')))], 3),
      section(
        t('google.title'),
        [
          t('google.lead'),
          [
            item(FR.pricing('builder.options.seo.label'), t('google.follow_up_text')),
            item(t('google.listing'), t('google.listing_text')),
          ].join('\n'),
        ],
        3
      ),
      section(
        t('features.title'),
        [
          t('features.lead'),
          [...options, item(FR.pricing('builder.pages.label'), FR.pricing('builder.pages.info'))].join('\n'),
        ],
        3
      ),
      section(t('example.title'), [t('example.lead'), examplePlanText(WEBSITE_FOR_TRADESPEOPLE.example)], 3),
      section(
        t('mockup.title'),
        [
          t('mockup.lead'),
          keysOf(FR.freeMockup.raw('steps.items'))
            .map((step) =>
              item(FR.freeMockup(`steps.items.${step}.title`), FR.freeMockup(`steps.items.${step}.description`))
            )
            .join('\n'),
        ],
        3
      ),
    ]
  );
}

/** The page for freelancers and liberal professions: what the site shows, starting small, the options, the case. */
export function buildWebsiteForFreelancersSection(): string {
  const t = FR.websiteForFreelancers;
  const options = optionItems(WEBSITE_FOR_FREELANCERS.options);

  return section(
    link(FR.contentPages('links.website_for_freelancers.label'), frenchPageUrl('/website-for-freelancers')),
    [
      t('intro.lead'),
      section(t('shows.title'), [t('shows.lead'), list(valuesOf(t.raw('shows.points'))), t('shows.ethics')], 3),
      section(
        t('grow.title'),
        [t('grow.lead', { price: inEurosInFrench(BASE_PRICE) }), list(valuesOf(t.raw('grow.points')))],
        3
      ),
      section(t('features.title'), [t('features.lead'), options.join('\n')], 3),
      section(t('example.title'), [t('example.lead'), examplePlanText(WEBSITE_FOR_FREELANCERS.example)], 3),
      section(t('projects.title'), [t('projects.lead'), projectLinks(WEBSITE_FOR_FREELANCERS.projects)], 3),
    ]
  );
}
