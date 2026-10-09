import { createTranslator } from 'next-intl';
import { describe, expect, it, vi } from 'vitest';

import { buildCaseStudyMetadata } from '@/components/CaseStudy/CaseStudy.metadata';

vi.mock('next-intl/server', () => ({
  getTranslations: async ({ locale, namespace }: { locale: string; namespace: string }) => {
    const { MESSAGES_BY_LOCALE } = await import('../../messages-by-locale');
    return createTranslator({ locale, messages: MESSAGES_BY_LOCALE[locale], namespace });
  },
}));

describe('buildCaseStudyMetadata', () => {
  it('titles the page with the project name and kind, and describes it with its card', async () => {
    const metadata = await buildCaseStudyMetadata('en', 'daily-fortune');

    expect(metadata.title).toBe('Daily Fortune · Mobile app | Cosmic Studio');
    expect(metadata.description).toBe(
      'A short message every morning to start the day on the right foot. It is our first app, available on the App Store and Google Play.'
    );
    expect(metadata.alternates?.canonical).toBe('https://www.gocosmic.dev/en/projects/daily-fortune');
    expect(metadata.openGraph).toMatchObject({ type: 'article' });
  });

  it('uses the localized route and copy', async () => {
    const metadata = await buildCaseStudyMetadata('fr', 'psc-supersprint');

    expect(metadata.title).toBe('PSC Supersprint · App web | Cosmic Studio');
    expect(metadata.alternates?.canonical).toBe('https://www.gocosmic.dev/fr/projets/psc-supersprint');
  });
});
