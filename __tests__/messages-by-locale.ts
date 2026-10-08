import deCommon from '../messages/de/common.json';
import deProjects from '../messages/de/projects.json';
import enCommon from '../messages/en/common.json';
import enProjects from '../messages/en/projects.json';
import esCommon from '../messages/es/common.json';
import esProjects from '../messages/es/projects.json';
import frCommon from '../messages/fr/common.json';
import frProjects from '../messages/fr/projects.json';
import itCommon from '../messages/it/common.json';
import itProjects from '../messages/it/projects.json';

/**
 * Common and projects messages of every locale, imported statically: a template-string `import()`
 * makes Vite emit a `\0vite` helper module that crashes the coverage HTML report.
 */
export const MESSAGES_BY_LOCALE: Record<string, Record<string, unknown>> = {
  en: { ...enCommon, ...enProjects },
  fr: { ...frCommon, ...frProjects },
  es: { ...esCommon, ...esProjects },
  de: { ...deCommon, ...deProjects },
  it: { ...itCommon, ...itProjects },
};
