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
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render WebSite JSON-LD', () => {
    render(<WebsiteSeo />);

    expect(screen.getByTestId('website-json-ld')).toBeInTheDocument();
    expect(jsonLdScriptMock).toHaveBeenCalledWith({
      scriptKey: 'website-json-ld',
      data: {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        url: 'https://www.gocosmic.dev',
      },
    });
  });
});
