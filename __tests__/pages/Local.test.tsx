import { vi } from 'vitest';

import LocalPage, { generateMetadata } from '@/app/[locale]/local/page';

import { render, screen } from '../test-utils';

vi.mock('next-intl/server', () => ({
  getTranslations: vi.fn().mockResolvedValue((key: string) => {
    if (key === 'meta.title') return 'Web & Mobile Developer Annecy • Geneva | Go Cosmic';
    if (key === 'meta.description')
      return 'Matthieu Compérat, freelance developer based in Annecy. Web and mobile app development for Annecy, Geneva, and Haute-Savoie businesses.';
    return key;
  }),
}));

describe('Local Page', () => {
  it('should render the local seo page content', () => {
    render(<LocalPage />);

    expect(
      screen.getByRole('heading', { level: 1, name: /web & mobile developer in annecy and geneva/i })
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /coverage area/i })).toBeInTheDocument();
    expect(screen.getByText(/annecy & haute-savoie/i)).toBeInTheDocument();
    expect(screen.getByText(/geneva & lake geneva region/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /contact your local web developer/i })).toHaveAttribute('href', '/contact');
  });

  describe('generateMetadata', () => {
    it('should generate metadata with local SEO title and description', async () => {
      const params = Promise.resolve({ locale: 'en' });
      const metadata = await generateMetadata({ params });

      expect(metadata).toEqual({
        title: 'Web & Mobile Developer Annecy • Geneva | Go Cosmic',
        description:
          'Matthieu Compérat, freelance developer based in Annecy. Web and mobile app development for Annecy, Geneva, and Haute-Savoie businesses.',
        alternates: {
          canonical: 'https://www.gocosmic.dev/en/web-mobile-developer-annecy-geneva',
        },
      });
    });
  });
});
