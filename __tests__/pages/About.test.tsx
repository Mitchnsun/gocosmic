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
    const { container } = render(<About />);

    expect(container).toMatchSnapshot();
  });

  describe('generateMetadata', () => {
    it('should generate metadata with correct title and description', async () => {
      const params = Promise.resolve({ locale: 'en' });
      const metadata = await generateMetadata({ params });

      expect(metadata).toEqual({
        title: 'About Go Cosmic - Web Agency in Annecy & Geneva',
        description:
          'Discover Go Cosmic, a web and mobile development agency based in Annecy, serving Geneva and Haute-Savoie. Meet Matthieu Compérat, our developer.',
      });
    });
  });
});
