import deCommon from '../messages/de/common.json';
import dePage from '../messages/de/moi-president.json';
import enCommon from '../messages/en/common.json';
import enPage from '../messages/en/moi-president.json';
import enLegal from '../messages/en/moi-president-legal.json';
import esCommon from '../messages/es/common.json';
import esPage from '../messages/es/moi-president.json';
import frCommon from '../messages/fr/common.json';
import frPage from '../messages/fr/moi-president.json';
import frLegal from '../messages/fr/moi-president-legal.json';
import itCommon from '../messages/it/common.json';
import itPage from '../messages/it/moi-president.json';

/**
 * What Moi Président's pages read in every language: the shared messages, its presentation page and, in French and
 * English, its legal pages. Imported statically: a template-string `import()` makes Vite emit a `\0vite` helper
 * module that crashes the coverage HTML report.
 */
export const MOI_PRESIDENT_MESSAGES: Record<string, Record<string, unknown>> = {
  en: { ...enCommon, ...enPage, ...enLegal },
  fr: { ...frCommon, ...frPage, ...frLegal },
  es: { ...esCommon, ...esPage },
  de: { ...deCommon, ...dePage },
  it: { ...itCommon, ...itPage },
};
