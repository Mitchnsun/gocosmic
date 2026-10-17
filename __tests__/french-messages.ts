import common from '../messages/fr/common.json';
import contentPages from '../messages/fr/content-pages.json';
import footer from '../messages/fr/footer.json';
import navigation from '../messages/fr/navigation.json';
import pricing from '../messages/fr/pricing.json';
import projects from '../messages/fr/projects.json';
import services from '../messages/fr/services.json';
import showcaseWebsite from '../messages/fr/showcase-website.json';

/**
 * The French messages the pages published in French only read, including their own files, imported statically:
 * a template-string `import()` makes Vite emit a `\0vite` helper module that crashes the coverage HTML report.
 */
export const FRENCH_MESSAGES: Record<string, unknown> = {
  ...common,
  ...navigation,
  ...footer,
  ...pricing,
  ...projects,
  ...services,
  ...contentPages,
  ...showcaseWebsite,
};
