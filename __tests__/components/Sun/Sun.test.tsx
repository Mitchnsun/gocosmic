import { render } from '@testing-library/react';

import { Sun } from '@/components/Sun';

describe('Sun', () => {
  it('draws a decorative disc and halo at the hero size by default', () => {
    const { container } = render(<Sun />);
    const sun = container.firstElementChild as HTMLElement;

    expect(sun).toHaveAttribute('aria-hidden', 'true');
    expect(sun).toHaveStyle({ width: 'min(56vw, 700px)' });
    expect(sun.style.getPropertyValue('--sun-intensity')).toBe('1');
    expect(sun.querySelector('.sun-disc')).toBeInTheDocument();
    expect(sun.querySelector('.sun-halo')).not.toHaveClass('animate-planet-glow');
  });

  it('takes a size, an intensity, a slow pulse and positioning classes', () => {
    const { container } = render(<Sun size="320px" intensity={0.5} pulse className="absolute top-0" />);
    const sun = container.firstElementChild as HTMLElement;

    expect(sun).toHaveStyle({ width: '320px' });
    expect(sun.style.getPropertyValue('--sun-intensity')).toBe('0.5');
    expect(sun).toHaveClass('absolute', 'top-0');
    expect(sun).not.toHaveClass('relative');
    expect(sun.querySelector('.sun-halo')).toHaveClass('animate-planet-glow');
  });
});
