import { vi } from 'vitest';

import Offers, { generateMetadata } from '@/app/[locale]/offers/page';

import { render } from '../test-utils';

// Mock next-intl/server
vi.mock('next-intl/server', async () => {
  const actual = await vi.importActual('next-intl/server');
  return {
    ...actual,
    getTranslations: vi.fn().mockResolvedValue((key: string) => {
      if (key === 'title') return 'Our Cosmic Offers';
      if (key === 'subtitle') return 'Choose the perfect solution tailored to your project needs';
      return key;
    }),
  };
});

describe('Offers Page', () => {
  it('should render the offers page with all three offers', () => {
    const { getByRole, getByText } = render(<Offers />);

    // Check main heading
    expect(getByRole('heading', { name: /our cosmic offers/i, level: 1 })).toBeInTheDocument();

    // Check all three offer sections
    expect(getByRole('heading', { name: /solo cosmic developer/i, level: 2 })).toBeInTheDocument();
    expect(getByRole('heading', { name: /complete cosmic team/i, level: 2 })).toBeInTheDocument();
    expect(getByRole('heading', { name: /developer \+ designer duo/i, level: 2 })).toBeInTheDocument();

    // Check CTA section
    expect(getByRole('heading', { name: /ready to start your cosmic project/i })).toBeInTheDocument();
    expect(getByText(/let's talk about your project/i)).toBeInTheDocument();

    // Check some key content from each offer
    expect(getByText(/perfect for startups and small projects/i)).toBeInTheDocument();
    expect(getByText(/full-stack solutions for complex projects/i)).toBeInTheDocument();
    expect(getByText(/complete digital experience package/i)).toBeInTheDocument();
  });

  describe('generateMetadata', () => {
    it('should generate metadata with correct title and description', async () => {
      const params = Promise.resolve({ locale: 'en' });
      const metadata = await generateMetadata({ params });

      expect(metadata).toEqual({
        title: 'Our Cosmic Offers',
        description: 'Choose the perfect solution tailored to your project needs',
      });
    });
  });
});
