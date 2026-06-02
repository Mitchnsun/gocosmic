import MountainSkyline from '@/components/Header/MountainSkyline';

import { render } from '../../test-utils';

describe('MountainSkyline', () => {
  it('renders a decorative SVG', () => {
    const { container } = render(<MountainSkyline />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(svg).toHaveAttribute('role', 'presentation');
  });

  it('accepts a className prop', () => {
    const { container } = render(<MountainSkyline className="test-class" />);
    expect(container.querySelector('svg')).toHaveClass('test-class');
  });
});
