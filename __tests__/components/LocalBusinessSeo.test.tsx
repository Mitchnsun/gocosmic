import { vi } from 'vitest';

import LocalBusinessSeo from '@/components/JsonLd/LocalBusinessSeo';

import { render } from '../test-utils';

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

  it('should render ProfessionalService JSON-LD for english locale', () => {
    const { getByTestId } = render(<LocalBusinessSeo locale="en" />);

    expect(getByTestId('local-business-json-ld')).toBeInTheDocument();
    expect(jsonLdScriptMock).toHaveBeenCalledWith({
      scriptKey: 'local-business-json-ld',
      data: {
        '@context': 'https://schema.org',
        '@type': 'ProfessionalService',
        '@id': 'https://www.gocosmic.dev/#company',
        name: 'Go Cosmic',
        description:
          'Web and mobile development agency based in Annecy, serving Geneva, French-speaking Switzerland and Haute-Savoie.',
        url: 'https://www.gocosmic.dev',
        inLanguage: 'en',
        address: {
          '@type': 'PostalAddress',
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
        areaServed: ['Annecy', 'Geneva', 'Haute-Savoie', 'Lake Geneva region', 'French-speaking Switzerland'],
        sameAs: ['https://www.linkedin.com/in/matthieucomperat/'],
      },
    });
  });

  it('should render localized ProfessionalService JSON-LD for french locale', () => {
    render(<LocalBusinessSeo locale="fr" />);

    expect(jsonLdScriptMock).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          description:
            'Agence de développement web et mobile basée à Annecy, intervenant à Genève, en Suisse romande et en Haute-Savoie.',
          inLanguage: 'fr',
          areaServed: ['Annecy', 'Genève', 'Haute-Savoie', 'Arc lémanique', 'Suisse romande'],
        }),
      })
    );
  });
});
