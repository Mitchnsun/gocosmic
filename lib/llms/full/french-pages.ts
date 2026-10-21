import { formatReleaseDate, PROJECTS_BY_SLUG } from '@/components/CaseStudy';
import { BASE_PRICE, FORMULA_INCLUDES, FORMULA_PRICES } from '@/components/PricingSimulator/constants';
import { APP_DEVELOPMENT, SHOWCASE_WEBSITE, WEBSITE_REDESIGN } from '@/data/content-pages';
import { CODE_HANDOVER_MONTHS } from '@/lib/pricing/offers';

import { FR } from '../llms.messages';
import { frenchPageUrl, inEurosInFrench, item, link, list, section, valuesOf } from '../llms.utils';
import { projectLinks } from './french-pages.shared';

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

/** The app development page: what the studio builds, how a quoted project runs, the day-rate guidance, its apps. */
export function buildAppDevelopmentSection(): string {
  const t = FR.appDevelopment;

  return section(link(FR.contentPages('links.app_development.label'), frenchPageUrl('/app-development')), [
    t('intro.lead'),
    section(t('builds.title'), [t('builds.lead'), list(valuesOf(t.raw('builds.points')))], 3),
    section(t('how.title'), [t('how.lead'), list(valuesOf(t.raw('how.points')))], 3),
    section(t('guidance.title'), [t('guidance.lead'), list(valuesOf(t.raw('guidance.points')))], 3),
    section(t('projects.title'), [t('projects.lead'), projectLinks(APP_DEVELOPMENT.projects)], 3),
  ]);
}

/** The website redesign page: the free review, the two paths, leaving Wix or WordPress, redirects, and its sources. */
export function buildWebsiteRedesignSection(): string {
  const t = FR.websiteRedesign;
  const { year, latestRelease } = PROJECTS_BY_SLUG.coachnpulse;
  const { consulted, items } = WEBSITE_REDESIGN.sources;

  return section(link(FR.contentPages('links.website_redesign.label'), frenchPageUrl('/website-redesign')), [
    t('intro.lead'),
    section(
      t('start.title'),
      [
        t('start.lead'),
        [item(t('start.audit'), t('start.audit_text')), item(t('start.mockup'), t('start.mockup_text'))].join('\n'),
      ],
      3
    ),
    section(
      t('paths.title'),
      [
        t('paths.lead'),
        [
          item(t('paths.keep'), t('paths.keep_text')),
          item(t('paths.rebuild'), t('paths.rebuild_text', { price: inEurosInFrench(BASE_PRICE) })),
          item(t('paths.custom'), t('paths.custom_text')),
        ].join('\n'),
        link(FR.home('pricing.all'), `${frenchPageUrl('/services')}#pricing`),
      ],
      3
    ),
    section(
      t('leave.title'),
      [
        t('leave.lead'),
        [
          item(t('leave.wix_site'), t('leave.wix_site_text')),
          item(t('leave.wix_domain'), t('leave.wix_domain_text')),
          item(t('leave.wordpress'), t('leave.wordpress_text')),
        ].join('\n'),
        t('leave.domain_note'),
      ],
      3
    ),
    section(t('redirects.title'), [t('redirects.lead'), t('redirects.volume')], 3),
    section(
      t('projects.title', { year: String(year) }),
      [
        t('projects.lead', { version: latestRelease.version, date: formatReleaseDate(latestRelease.date, 'fr') }),
        projectLinks(WEBSITE_REDESIGN.projects),
      ],
      3
    ),
    section(
      FR.contentPages('sources.title'),
      [
        list(items.map(({ key, href }) => link(t(`sources.${key}`), href))),
        FR.contentPages('sources.consulted', { date: formatReleaseDate(consulted, 'fr') }),
      ],
      3
    ),
  ]);
}
