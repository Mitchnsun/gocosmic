import { vi } from 'vitest';

import MovingStarfield from '@/components/Journey/MovingStarfield';
import { render } from '../test-utils';

// Mock @react-three/drei
vi.mock('@react-three/drei', () => ({
  Stars: vi.fn(),
}));

// Mock @react-three/fiber hooks
vi.mock('@react-three/fiber', () => ({
  useFrame: vi.fn(),
}));

// Mock react hooks
vi.mock('react', async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>;
  return {
    ...actual,
    useRef: vi.fn(() => ({ current: null })),
  };
});

describe('MovingStarfield Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render multiple Stars components with correct configurations', async () => {
    const { useFrame } = await import('@react-three/fiber');
    const { Stars } = await import('@react-three/drei');

    render(<MovingStarfield />);

    // should use useFrame for animation
    expect(useFrame).toHaveBeenCalled();

    // Should render 6 Stars components total (3 per group × 2 groups)
    expect(Stars).toHaveBeenCalledTimes(6);

    // Check first Stars configuration (should appear twice)
    expect(Stars).toHaveBeenCalledWith(
      {
        radius: 200,
        depth: 400,
        count: 2000,
        factor: 2,
        saturation: 0,
        speed: 0,
      },
      undefined
    );

    // Check second Stars configuration (should appear twice)
    expect(Stars).toHaveBeenCalledWith(
      {
        radius: 120,
        depth: 250,
        count: 1500,
        factor: 3,
        saturation: 0.3,
        speed: 0,
      },
      undefined
    );

    // Check third Stars configuration (should appear twice)
    expect(Stars).toHaveBeenCalledWith(
      {
        radius: 100,
        depth: 150,
        count: 500,
        factor: 5,
        saturation: 0.1,
        speed: 0,
      },
      undefined
    );
  });
});
