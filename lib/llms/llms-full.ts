import { buildHomeSection } from './full/home';
import { buildProjectsSection } from './full/projects';
import { buildServicesSection } from './full/services';
import { buildAboutSection, buildFreeMockupSection, buildLocalSection } from './full/studio';
import { buildTermsSection } from './full/terms';
import { buildContactSection, buildHeader, buildRegionsSection } from './llms.shared';
import { toTextFile } from './llms.utils';

/**
 * `/llms-full.txt`: the text of every page in one file, including what the HTML only reveals on interaction
 * (info bubbles, the second plan, every slider step), and the terms of sale.
 */
export function buildLlmsFull(bookingUrl: string | null): string {
  return toTextFile([
    ...buildHeader(),
    buildRegionsSection(),
    buildHomeSection(),
    buildServicesSection(),
    buildFreeMockupSection(),
    buildProjectsSection(),
    buildAboutSection(),
    buildLocalSection(),
    buildContactSection(bookingUrl),
    buildTermsSection(),
  ]);
}
