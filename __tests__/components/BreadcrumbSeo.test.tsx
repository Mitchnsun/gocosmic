import { useLocale } from 'next-intl';
import { vi } from 'vitest';

import BreadcrumbSeo from '@/components/JsonLd/BreadcrumbSeo';

import { render } from '../test-utils';

const jsonLdScriptMock = vi.fn<(props: unknown) => null>(() => null);

vi.mock('@/components/JsonLd/JsonLd', () => ({
  JsonLd: (props: unknown) => jsonLdScriptMock(props),
}));

vi.mock('next-intl', async (importOriginal) => {
  const actual = await importOriginal<typeof import('next-intl')>();
  return { ...actual, useLocale: vi.fn().mockReturnValue('en') };
});

describe('BreadcrumbSeo', () => {
  afterEach(() => {
    vi.mocked(useLocale).mockReturnValue('en');
    vi.clearAllMocks();
  });

  it('declares the trail from the home page to the page', () => {
    render(<BreadcrumbSeo route="/services" />);

    expect(jsonLdScriptMock).toHaveBeenCalledWith({
      scriptKey: 'breadcrumb-json-ld',
      data: {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.gocosmic.dev/en' },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Services & pricing',
            item: 'https://www.gocosmic.dev/en/services',
          },
        ],
      },
    });
  });

  it('names the free mockup page', () => {
    render(<BreadcrumbSeo route="/free-mockup" />);

    expect(jsonLdScriptMock).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          itemListElement: [
            expect.anything(),
            expect.objectContaining({ name: 'Free mockup', item: 'https://www.gocosmic.dev/en/free-mockup' }),
          ],
        }),
      })
    );
  });

  it.each([
    ['fr', 'https://www.gocosmic.dev/fr', 'https://www.gocosmic.dev/fr/a-propos'],
    ['fr-CH', 'https://www.gocosmic.dev/fr-ch', 'https://www.gocosmic.dev/fr-ch/a-propos'],
  ])('uses the %s URLs', (locale, home, about) => {
    vi.mocked(useLocale).mockReturnValue(locale);
    render(<BreadcrumbSeo route="/about" />);

    expect(jsonLdScriptMock).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          itemListElement: [expect.objectContaining({ item: home }), expect.objectContaining({ item: about })],
        }),
      })
    );
  });
});
