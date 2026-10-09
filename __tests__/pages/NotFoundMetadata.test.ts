import { createTranslator } from 'next-intl';
import { describe, expect, it, vi } from 'vitest';

import { generateMetadata as generateLayoutMetadata } from '@/app/[locale]/layout';
import { generateMetadata as generateNotFoundMetadata } from '@/app/[locale]/not-found';

vi.mock('next/font/google', () => {
  const font = () => ({ variable: 'font' });
  return { Inter: font, Space_Grotesk: font, Space_Mono: font };
});

vi.mock('next-intl/server', () => ({
  getTranslations: async (options: string | { locale?: string; namespace: string }) => {
    const { locale = 'fr', namespace } = typeof options === 'string' ? { namespace: options } : options;
    const { MESSAGES_BY_LOCALE } = await import('../messages-by-locale');
    // eslint-disable-next-line security/detect-object-injection
    return createTranslator({ locale, messages: MESSAGES_BY_LOCALE[locale], namespace });
  },
}));

describe('not-found metadata', () => {
  it('has its own title and description, and no social card borrowed from the homepage', async () => {
    const metadata = await generateNotFoundMetadata();

    expect(metadata.title).toBe('Page introuvable | Cosmic Studio');
    expect(metadata.description).toMatch(/^Le lien est peut-être ancien/);
    expect(metadata.openGraph).toBeNull();
    expect(metadata.twitter).toBeNull();
  });
});

describe('layout fallback metadata', () => {
  it('describes the site without claiming the homepage URL', async () => {
    const metadata = await generateLayoutMetadata({ params: Promise.resolve({ locale: 'en' }) });

    expect(metadata.metadataBase?.toString()).toBe('https://www.gocosmic.dev/');
    expect(metadata.title).toBe('Websites for craftspeople, associations and independents | Cosmic Studio');
    expect(metadata.alternates).toBeUndefined();
    expect(metadata.openGraph).toMatchObject({ siteName: 'Cosmic Studio', locale: 'en_US', url: undefined });
    expect(metadata.twitter).toMatchObject({ card: 'summary_large_image' });
  });
});
