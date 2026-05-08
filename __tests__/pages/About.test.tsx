import { vi } from 'vitest';

import About, { generateMetadata } from '@/app/[locale]/about/page';

import { render } from '../test-utils';

// Mock next-intl/server
vi.mock('next-intl/server', () => ({
  getMessages: vi.fn().mockResolvedValue({
    meta: {
      title: 'About Go Cosmic - Web Agency in Annecy & Geneva',
      description:
        'Discover Go Cosmic, a web and mobile development agency based in Annecy, serving Geneva and Haute-Savoie. Meet Matthieu Compérat, our developer.',
    },
  }),
}));

describe('About Page', () => {
  it('should render the about page correctly', () => {
    const { container, getByText } = render(<About />);

    expect(
      getByText(/based in annecy, we work across geneva and haute-savoie — on-site or remotely/i)
    ).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it('should render person json-ld for matthieu comperat', () => {
    const { container } = render(<About />);
    const personJsonLdScript = container.querySelector('script#person-jsonld');

    expect(personJsonLdScript).toBeInTheDocument();
    expect(personJsonLdScript).toHaveAttribute('type', 'application/ld+json');

    const parsedJsonLd = JSON.parse(personJsonLdScript?.textContent ?? '{}') as Record<string, unknown>;

    expect(parsedJsonLd['@type']).toBe('Person');
    expect(parsedJsonLd.name).toBe('Matthieu Compérat');
    expect(parsedJsonLd.url).toBe('https://www.gocosmic.dev/en/about');
    expect(parsedJsonLd.jobTitle).toBe('Freelance Web & Mobile Developer');
  });

  describe('generateMetadata', () => {
    it('should generate metadata with correct title and description', async () => {
      const params = Promise.resolve({ locale: 'en' });
      const metadata = await generateMetadata({ params });

      expect(metadata).toEqual({
        title: 'About Go Cosmic - Web Agency in Annecy & Geneva',
        description:
          'Discover Go Cosmic, a web and mobile development agency based in Annecy, serving Geneva and Haute-Savoie. Meet Matthieu Compérat, our developer.',
        alternates: {
          canonical: 'https://www.gocosmic.dev/en/about',
        },
      });
    });
  });
});
