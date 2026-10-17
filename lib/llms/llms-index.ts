import { buildCaseStudyMeta } from '@/components/CaseStudy/CaseStudy.utils';
import { BASE_PRICE } from '@/components/PricingSimulator/constants';
import { PROJECTS } from '@/data/projects';
import { SITE_URL } from '@/lib/config';

import { EN } from './llms.messages';
import { buildContactSection, buildHeader, buildRegionsSection } from './llms.shared';
import { inBothCurrencies, link, list, pageUrl, section, toTextFile } from './llms.utils';

/** The site's main pages, with the label of their footer link and the description they give search engines. */
const pages = () => [
  [link(EN.navigation('home_menu'), pageUrl('/')), EN.home('hero.subtitle')],
  [
    link(EN.footer('link_services'), pageUrl('/services')),
    EN.services('meta.description', { price: inBothCurrencies(BASE_PRICE) }),
  ],
  [
    link(EN.footer('link_pricing'), pageUrl('/pricing')),
    EN.pricingPage('meta.description', { price: inBothCurrencies(BASE_PRICE) }),
  ],
  [link(EN.footer('free_mockup_page'), pageUrl('/free-mockup')), EN.freeMockup('meta.description')],
  [link(EN.footer('link_projects'), pageUrl('/projects')), EN.projectsList('meta.description')],
  [link(EN.footer('link_about'), pageUrl('/about')), EN.about('meta.description')],
  [link(EN.footer('story_page'), pageUrl('/story')), EN.story('meta.description')],
  [link(EN.footer('local_page'), pageUrl('/local')), EN.local('meta.description')],
];

/** Each case study: its client, kind and dates, then the description of its card. */
const caseStudies = () =>
  PROJECTS.map((project) => {
    const meta = buildCaseStudyMeta(project.slug, EN.projectsList, 'en').join(' · ');
    const title = EN.projectsList(`items.${project.i18nKey}.title`);
    return `${link(title, pageUrl(project.href))}: ${meta}. ${EN.projectsList(`items.${project.i18nKey}.description`)}`;
  });

/**
 * `/llms.txt` (llmstxt.org): what the studio does, how the site is organised and where each answer lives,
 * built from the same copy and data as the pages.
 */
export function buildLlmsIndex(bookingUrl: string | null): string {
  return toTextFile([
    ...buildHeader(),
    buildRegionsSection(),
    section('Pages', [list(pages().map(([page, description]) => `${page}: ${description}`))]),
    section('Case studies', [list(caseStudies())]),
    buildContactSection(bookingUrl),
    section('Optional', [
      list([
        `${link('Full content', `${SITE_URL}/llms-full.txt`)}: the text of every page in one file, with the details and price of each option and the terms of sale`,
        `${link(EN.footer('terms'), pageUrl('/terms'))}: ${EN.legal('terms.meta.description')}`,
      ]),
    ]),
  ]);
}
