import { type AbstractIntlMessages, createTranslator } from 'next-intl';

import about from '@/messages/en/about.json';
import common from '@/messages/en/common.json';
import contact from '@/messages/en/contact.json';
import footer from '@/messages/en/footer.json';
import freeMockup from '@/messages/en/free-mockup.json';
import home from '@/messages/en/home.json';
import legal from '@/messages/en/legal.json';
import local from '@/messages/en/local.json';
import navigation from '@/messages/en/navigation.json';
import pricing from '@/messages/en/pricing.json';
import projects from '@/messages/en/projects.json';
import pscSupersprint from '@/messages/en/psc-supersprint.json';
import services from '@/messages/en/services.json';

/** A plain-text translator: rich-text tags (`<em>`, `<link>`) are dropped, their content kept. */
export interface Translator {
  (key: string, values?: Record<string, string | number>): string;
  raw: (key: string) => unknown;
  has: (key: string) => boolean;
}

const PLAIN_TAGS = { em: (chunks: string) => chunks, link: (chunks: string) => chunks };

/** The calls made on next-intl's translator, with keys built at runtime instead of typed against the messages. */
interface UntypedTranslator {
  markup: (key: string, values: Record<string, unknown>) => string;
  raw: (key: string) => unknown;
  has: (key: string) => boolean;
}

function translator(messages: Record<string, unknown>, namespace?: string): Translator {
  // The message files hold arrays too (tags, paragraphs), which `AbstractIntlMessages` does not describe.
  const t = createTranslator({
    locale: 'en',
    messages: messages as AbstractIntlMessages,
    namespace,
  }) as unknown as UntypedTranslator;
  const translate = (key: string, values?: Record<string, string | number>) =>
    t.markup(key, { ...values, ...PLAIN_TAGS });

  return Object.assign(translate, { raw: (key: string) => t.raw(key), has: (key: string) => t.has(key) });
}

/**
 * English copy of the site, one translator per message file, scoped to its namespace as the pages read it.
 * Imported statically: the files are built without a request, so they read the messages on their own.
 */
export const EN = {
  about: translator(about, 'about'),
  common: translator(common),
  contact: translator(contact, 'contact'),
  footer: translator(footer, 'footer'),
  freeMockup: translator(freeMockup, 'freeMockup'),
  home: translator(home, 'homepage'),
  legal: translator(legal, 'legal'),
  local: translator(local, 'local'),
  navigation: translator(navigation, 'navigation'),
  pricing: translator(pricing, 'pricing'),
  /** Case study pages, keyed by each project's `i18nKey`. */
  projects: translator({ ...projects, ...pscSupersprint }),
  projectsList: translator(projects, 'projectsList'),
  services: translator(services, 'services'),
};
