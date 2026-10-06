import { vi } from 'vitest';

import WebsiteSeo from '@/components/JsonLd/WebsiteSeo';

import { render } from '../test-utils';

const jsonLdScriptMock = vi.fn((props: unknown) => (
  <script data-testid="website-json-ld" data-props={JSON.stringify(props)} />
));

vi.mock('next-seo', () => ({
  JsonLdScript: (props: unknown) => jsonLdScriptMock(props),
}));

describe('WebsiteSeo', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render WebSite JSON-LD', () => {
    const { getByTestId } = render(<WebsiteSeo locale="fr" />);

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
        inLanguage: 'fr',
        publisher: { '@id': 'https://www.gocosmic.dev/#company' },
      },
    });
  });
});
