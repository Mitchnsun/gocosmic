import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import WebsiteSeo from '@/components/JsonLd/WebsiteSeo';

const jsonLdScriptMock = vi.fn((props: unknown) => (
  <script data-testid="website-json-ld" data-props={JSON.stringify(props)} />
));

vi.mock('next-seo', () => ({
  JsonLdScript: (props: unknown) => jsonLdScriptMock(props),
}));

describe('WebsiteSeo', () => {
  const originalEnableSiteSearch = process.env.NEXT_PUBLIC_ENABLE_SITE_SEARCH;

  afterEach(() => {
    process.env.NEXT_PUBLIC_ENABLE_SITE_SEARCH = originalEnableSiteSearch;
    vi.clearAllMocks();
  });

  it('should not render JSON-LD when site search is disabled', () => {
    process.env.NEXT_PUBLIC_ENABLE_SITE_SEARCH = 'false';

    const { container } = render(<WebsiteSeo />);

    expect(container.firstChild).toBeNull();
    expect(jsonLdScriptMock).not.toHaveBeenCalled();
  });

  it('should render WebSite and SearchAction JSON-LD when site search is enabled', () => {
    process.env.NEXT_PUBLIC_ENABLE_SITE_SEARCH = 'true';

    render(<WebsiteSeo />);

    expect(screen.getByTestId('website-json-ld')).toBeInTheDocument();
    expect(jsonLdScriptMock).toHaveBeenCalledWith({
      scriptKey: 'website-sitelinks-searchbox',
      data: {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        url: 'https://www.gocosmic.dev',
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://www.gocosmic.dev/search?q={search_term_string}',
          'query-input': 'required name=search_term_string',
        },
      },
    });
  });
});
