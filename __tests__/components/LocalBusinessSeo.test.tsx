import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import LocalBusinessSeo from '@/components/JsonLd/LocalBusinessSeo';

const jsonLdScriptMock = vi.fn((props: unknown) => (
  <script data-testid="local-business-json-ld" data-props={JSON.stringify(props)} />
));

vi.mock('next-seo', () => ({
  JsonLdScript: (props: unknown) => jsonLdScriptMock(props),
}));

describe('LocalBusinessSeo', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render ProfessionalService JSON-LD', () => {
    render(<LocalBusinessSeo />);

    expect(screen.getByTestId('local-business-json-ld')).toBeInTheDocument();
    expect(jsonLdScriptMock).toHaveBeenCalledWith({
      scriptKey: 'local-business-json-ld',
      data: {
        '@context': 'https://schema.org',
        '@type': 'ProfessionalService',
        '@id': 'https://www.gocosmic.dev/#company',
        name: 'Go Cosmic',
        description: 'Agence de développement web & mobile basée à Annecy, intervenant à Genève et en Haute-Savoie.',
        url: 'https://www.gocosmic.dev',
        telephone: '+33-6-XX-XX-XX-XX',
        address: {
          '@type': 'PostalAddress',
          streetAddress: '',
          addressLocality: 'Annecy',
          addressRegion: 'Auvergne-Rhône-Alpes',
          postalCode: '74000',
          addressCountry: 'FR',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 45.8992,
          longitude: 6.1294,
        },
        areaServed: ['Annecy', 'Genève', 'Haute-Savoie'],
        sameAs: ['https://www.linkedin.com/in/matthieucomperat/'],
      },
    });
  });
});
