import {
  buildWebsiteForAssociationsSection,
  buildWebsiteForFreelancersSection,
  buildWebsiteForTradespeopleSection,
} from './full/french-audiences';
import {
  buildAppDevelopmentSection,
  buildShowcaseWebsiteSection,
  buildWebsiteRedesignSection,
} from './full/french-pages';
import { buildHomeSection } from './full/home';
import { buildPricingPageSection } from './full/pricing-page';
import { buildProjectsSection } from './full/projects';
import { buildServicesSection } from './full/services';
import { buildAboutSection, buildFreeMockupSection, buildLocalSection, buildStorySection } from './full/studio';
import { buildTermsSection } from './full/terms';
import { buildContactSection, buildHeader, buildRegionsSection } from './llms.shared';
import { toTextFile } from './llms.utils';

/**
 * `/llms-full.txt`: the text of every page in one file, including what the HTML only reveals on interaction
 * (info bubbles, the second plan, every slider step), the pages published in French only, in French, and the
 * terms of sale.
 */
export function buildLlmsFull(bookingUrl: string | null): string {
  return toTextFile([
    ...buildHeader(),
    buildRegionsSection(),
    buildHomeSection(),
    buildServicesSection(),
    buildPricingPageSection(),
    buildFreeMockupSection(),
    buildProjectsSection(),
    buildAboutSection(),
    buildStorySection(),
    buildLocalSection(),
    buildShowcaseWebsiteSection(),
    buildAppDevelopmentSection(),
    buildWebsiteRedesignSection(),
    buildWebsiteForAssociationsSection(),
    buildWebsiteForTradespeopleSection(),
    buildWebsiteForFreelancersSection(),
    buildContactSection(bookingUrl),
    buildTermsSection(),
  ]);
}
