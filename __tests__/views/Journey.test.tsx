import { vi } from 'vitest';

import JourneyContent from '@/views/Journey';

import { render } from '../test-utils';

// Mock @react-three/fiber
vi.mock('@react-three/fiber', () => ({
  Canvas: function MockedCanvas({ children }: { children: React.ReactNode }) {
    return <div data-testid="three-canvas">{children}</div>;
  },
}));

// Mock MovingStarfield component
vi.mock('@/components/Journey/MovingStarfield', () => {
  return {
    default: function MockedMovingStarfield() {
      return <div data-testid="moving-starfield" />;
    },
  };
});

describe('JourneyContent Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the journey content with cosmic theme', () => {
    const { container } = render(<JourneyContent />);

    expect(container).toMatchSnapshot();
  });
});
