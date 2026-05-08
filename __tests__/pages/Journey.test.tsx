import { screen } from '@testing-library/react';
import { vi } from 'vitest';

import JourneyPage, { generateMetadata } from '@/app/[locale]/journey/page';

import { render } from '../test-utils';

// Mock next-intl/server
vi.mock('next-intl/server', () => ({
  getLocale: vi.fn().mockResolvedValue('en'),
  getMessages: vi.fn().mockResolvedValue({
    meta: {
      title: 'Cosmic Journey - Go Cosmic | Annecy · Geneva',
      description:
        'Embark on an immersive 3D cosmic journey through the stars. Experience the unique approach of Go Cosmic, your web development partner in Annecy and Geneva.',
    },
    journey: {
      title: 'Welcome to your Cosmic Journey',
      subtitle: 'You are now traveling through the stars',
    },
  }),
  getTranslations: vi.fn().mockResolvedValue((key: string) => {
    const map: Record<string, string> = {
      'meta.title': 'Cosmic Journey - Go Cosmic | Annecy · Geneva',
      'meta.description':
        'Embark on an immersive 3D cosmic journey through the stars. Experience the unique approach of Go Cosmic, your web development partner in Annecy and Geneva.',
    };
    // eslint-disable-next-line security/detect-object-injection
    return map[key] ?? key;
  }),
}));

// Mock the dynamic import and components
vi.mock('next/dynamic', () => ({
  default: vi.fn((importFn, options) => {
    // Create a mock component that accepts props and renders the loading state
    const MockDynamicComponent = (props: Record<string, unknown>) => {
      if (options?.loading) {
        return options.loading();
      }
      return (
        <div data-testid="journey-content" data-props={JSON.stringify(props)}>
          Journey Content
        </div>
      );
    };
    return MockDynamicComponent;
  }),
}));

// Mock the Loader component
vi.mock('@/components/Loader', () => ({
  Loader: vi.fn(({ className, fullScreen }) => (
    <div data-testid="loader" className={className} data-fullscreen={fullScreen} role="status" aria-label="Loading" />
  )),
}));

describe('Journey Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should display loading message with proper accessibility', async () => {
    render(await JourneyPage());

    // Verify status role for loading indicator
    const statusElement = screen.getByRole('status');
    expect(statusElement).toBeInTheDocument();
  });

  describe('generateMetadata', () => {
    it('should generate metadata with correct title and description', async () => {
      const params = Promise.resolve({ locale: 'en' });
      const metadata = await generateMetadata({ params });

      expect(metadata).toEqual({
        title: 'Cosmic Journey - Go Cosmic | Annecy · Geneva',
        description:
          'Embark on an immersive 3D cosmic journey through the stars. Experience the unique approach of Go Cosmic, your web development partner in Annecy and Geneva.',
        alternates: {
          canonical: 'https://www.gocosmic.dev/en/journey',
        },
        openGraph: {
          title: 'Cosmic Journey - Go Cosmic | Annecy · Geneva',
          description:
            'Embark on an immersive 3D cosmic journey through the stars. Experience the unique approach of Go Cosmic, your web development partner in Annecy and Geneva.',
          images: ['/og-default-en.jpg'],
        },
        twitter: {
          card: 'summary_large_image',
          title: 'Cosmic Journey - Go Cosmic | Annecy · Geneva',
          description:
            'Embark on an immersive 3D cosmic journey through the stars. Experience the unique approach of Go Cosmic, your web development partner in Annecy and Geneva.',
          images: ['/twitter-card-en.jpg'],
        },
      });
    });
  });
});
