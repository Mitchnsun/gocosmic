import { vi } from 'vitest';

import WebsiteSeo from '@/components/JsonLd/WebsiteSeo';

import { render } from '../test-utils';

const jsonLdScriptMock = vi.fn((props: unknown) => (
  <div data-testid="website-json-ld" data-props={JSON.stringify(props)} />
));

vi.mock('@/components/JsonLd/JsonLd', () => ({
  JsonLd: (props: unknown) => jsonLdScriptMock(props),
}));

describe('WebsiteSeo', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render WebSite JSON-LD', () => {
    const { getByTestId } = render(<WebsiteSeo />);

    expect(getByTestId('website-json-ld')).toBeInTheDocument();
    expect(jsonLdScriptMock).toHaveBeenCalledWith({
      scriptKey: 'website-json-ld',
      data: {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': 'https://www.gocosmic.dev/#website',
        url: 'https://www.gocosmic.dev',
        name: 'Cosmic Studio',
        alternateName: 'Go Cosmic',
        inLanguage: ['en', 'fr', 'es', 'de', 'it'],
        publisher: { '@id': 'https://www.gocosmic.dev/#company' },
      },
    });
  });
});
