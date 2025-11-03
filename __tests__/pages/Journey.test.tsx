import { screen } from '@testing-library/react';
import { vi } from 'vitest';

import JourneyPage, { generateMetadata } from '@/app/[locale]/journey/page';

import { render } from '../test-utils';

// Mock next-intl/server
vi.mock('next-intl/server', () => ({
  getMessages: vi.fn().mockResolvedValue({
    journey: {
      meta: {
        title: 'Cosmic Journey - Explore the Stars with Go Cosmic',
        description:
          'Embark on an immersive 3D cosmic journey through the stars. Experience the unique approach of Go Cosmic with interactive space exploration.',
      },
    },
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

  it('should display loading message with proper accessibility', () => {
    render(<JourneyPage />);

    // Verify status role for loading indicator
    const statusElement = screen.getByRole('status');
    expect(statusElement).toBeInTheDocument();
  });

  describe('generateMetadata', () => {
    it('should generate metadata with correct title and description', async () => {
      const params = Promise.resolve({ locale: 'en' });
      const metadata = await generateMetadata({ params });

      expect(metadata).toEqual({
        title: 'Cosmic Journey - Explore the Stars with Go Cosmic',
        description:
          'Embark on an immersive 3D cosmic journey through the stars. Experience the unique approach of Go Cosmic with interactive space exploration.',
      });
    });
  });
});
