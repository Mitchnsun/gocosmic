import { screen } from '@testing-library/react';
import { vi } from 'vitest';

import JourneyPage from '@/app/[locale]/journey/page';

import { render } from '../test-utils';

// Mock the dynamic import and components
vi.mock('next/dynamic', () => ({
  default: vi.fn((importFn, options) => {
    // Create a mock component that renders the loading state
    const MockDynamicComponent = () => {
      if (options?.loading) {
        return options.loading();
      }
      return <div data-testid="journey-content">Journey Content</div>;
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
});
