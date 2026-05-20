import { vi } from 'vitest';

import Offers, { generateMetadata } from '@/app/[locale]/offers/page';

import { render } from '../test-utils';

// Mock next-intl/server
vi.mock('next-intl/server', async () => {
  const actual = await vi.importActual('next-intl/server');
  const { default: commonMessages } = await import('../../messages/en/common.json');
  const { default: offersMessages } = await import('../../messages/en/offers.json');

  const allMessages = { ...commonMessages, ...offersMessages };

  function getNestedValue(obj: Record<string, unknown>, path: string): string {
    return (
      (path.split('.').reduce((acc: unknown, key) => {
        // eslint-disable-next-line security/detect-object-injection
        if (acc && typeof acc === 'object') return (acc as Record<string, unknown>)[key];
        return undefined;
      }, obj) as string) ?? path
    );
  }

  return {
    ...actual,
    getLocale: vi.fn().mockResolvedValue('en'),
    getMessages: vi.fn().mockResolvedValue(allMessages),
    getTranslations: vi
      .fn()
      .mockResolvedValue((key: string) => getNestedValue(allMessages.offers as Record<string, unknown>, key)),
  };
});

describe('Offers Page', () => {
  it('should render the offers page with all three offers', async () => {
    const { getByRole, getByText } = render(await Offers());

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
        title: 'Our Offers | Web & Mobile Development | Annecy · Geneva | Go Cosmic',
        description:
          'Tailored web and mobile development offers for businesses in Annecy, Geneva, and Haute-Savoie. Choose your perfect development package.',
        alternates: {
          canonical: 'https://www.gocosmic.dev/en/offers',
        },
        openGraph: {
          title: 'Our Offers | Web & Mobile Development | Annecy · Geneva | Go Cosmic',
          description:
            'Tailored web and mobile development offers for businesses in Annecy, Geneva, and Haute-Savoie. Choose your perfect development package.',
          images: ['/og-default-en.jpg'],
        },
        twitter: {
          card: 'summary_large_image',
          title: 'Our Offers | Web & Mobile Development | Annecy · Geneva | Go Cosmic',
          description:
            'Tailored web and mobile development offers for businesses in Annecy, Geneva, and Haute-Savoie. Choose your perfect development package.',
          images: ['/twitter-card-en.jpg'],
        },
      });
    });
  });
});
