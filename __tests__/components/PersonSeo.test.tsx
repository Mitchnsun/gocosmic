import { useLocale } from 'next-intl';
import { vi } from 'vitest';

import PersonSeo from '@/components/JsonLd/PersonSeo';

import { render } from '../test-utils';

const jsonLdScriptMock = vi.fn((props: unknown) => (
  <script data-testid="person-json-ld" data-props={JSON.stringify(props)} />
));

vi.mock('next-seo', () => ({
  JsonLdScript: (props: unknown) => jsonLdScriptMock(props),
}));

vi.mock('next-intl', async (importOriginal) => {
  const actual = await importOriginal<typeof import('next-intl')>();
  return {
    ...actual,
    useLocale: vi.fn().mockReturnValue('en'),
  };
});

vi.mock('@/i18n/canonical', () => ({
  getCanonicalUrl: (locale: string, path: string) => `https://www.gocosmic.dev/${locale}${path}`,
}));

describe('PersonSeo', () => {
  beforeEach(() => {
    vi.mocked(useLocale).mockReturnValue('en');
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render Person JSON-LD script', () => {
    const { getByTestId } = render(<PersonSeo />);

    expect(getByTestId('person-json-ld')).toBeInTheDocument();
    expect(jsonLdScriptMock).toHaveBeenCalledWith(
      expect.objectContaining({
        scriptKey: 'person-jsonld',
        data: expect.objectContaining({
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: 'Matthieu Compérat',
        }),
      })
    );
  });

  it('should include correct sameAs and address', () => {
    render(<PersonSeo />);

    expect(jsonLdScriptMock).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          sameAs: ['https://www.linkedin.com/in/matthieucomperat/'],
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Annecy',
            addressCountry: 'FR',
          },
        }),
      })
    );
  });

  it('should use English job title for en locale', () => {
    vi.mocked(useLocale).mockReturnValue('en');
    render(<PersonSeo />);

    expect(jsonLdScriptMock).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ jobTitle: 'Freelance Web & Mobile Developer' }),
      })
    );
  });

  it('should use French job title for fr locale', () => {
    vi.mocked(useLocale).mockReturnValue('fr');
    render(<PersonSeo />);

    expect(jsonLdScriptMock).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ jobTitle: 'Développeur Web & Mobile Freelance' }),
      })
    );
  });

  it('should use Spanish job title for es locale', () => {
    vi.mocked(useLocale).mockReturnValue('es');
    render(<PersonSeo />);

    expect(jsonLdScriptMock).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ jobTitle: 'Desarrollador Web y Móvil Freelance' }),
      })
    );
  });

  it('should use German job title for de locale', () => {
    vi.mocked(useLocale).mockReturnValue('de');
    render(<PersonSeo />);

    expect(jsonLdScriptMock).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ jobTitle: 'Freelancer für Web- und Mobile-Entwicklung' }),
      })
    );
  });

  it('should use Italian job title for it locale', () => {
    vi.mocked(useLocale).mockReturnValue('it');
    render(<PersonSeo />);

    expect(jsonLdScriptMock).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ jobTitle: 'Sviluppatore Web e Mobile Freelance' }),
      })
    );
  });

  it('should default to French job title for unknown locale', () => {
    vi.mocked(useLocale).mockReturnValue('ja' as ReturnType<typeof useLocale>);
    render(<PersonSeo />);

    expect(jsonLdScriptMock).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ jobTitle: 'Développeur Web & Mobile Freelance' }),
      })
    );
  });

  it('should build the url using the locale', () => {
    vi.mocked(useLocale).mockReturnValue('fr');
    render(<PersonSeo />);

    expect(jsonLdScriptMock).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ url: 'https://www.gocosmic.dev/fr/about' }),
      })
    );
  });
});
