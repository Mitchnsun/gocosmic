import appDevelopment from '../messages/fr/app-development.json';
import common from '../messages/fr/common.json';
import contentPages from '../messages/fr/content-pages.json';
import footer from '../messages/fr/footer.json';
import freeMockup from '../messages/fr/free-mockup.json';
import home from '../messages/fr/home.json';
import navigation from '../messages/fr/navigation.json';
import pricing from '../messages/fr/pricing.json';
import projects from '../messages/fr/projects.json';
import services from '../messages/fr/services.json';
import showcaseWebsite from '../messages/fr/showcase-website.json';
import websiteForAssociations from '../messages/fr/website-for-associations.json';
import websiteForFreelancers from '../messages/fr/website-for-freelancers.json';
import websiteForTradespeople from '../messages/fr/website-for-tradespeople.json';
import websiteRedesign from '../messages/fr/website-redesign.json';

/**
 * The French messages the pages published in French only read, including their own files, imported statically:
 * a template-string `import()` makes Vite emit a `\0vite` helper module that crashes the coverage HTML report.
 */
export const FRENCH_MESSAGES: Record<string, unknown> = {
  ...common,
  ...navigation,
  ...footer,
  ...freeMockup,
  ...home,
  ...pricing,
  ...projects,
  ...services,
  ...contentPages,
  ...showcaseWebsite,
  ...appDevelopment,
  ...websiteRedesign,
  ...websiteForAssociations,
  ...websiteForTradespeople,
  ...websiteForFreelancers,
};
