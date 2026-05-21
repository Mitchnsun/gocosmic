import LogoOrbitalDot from '@/components/Header/LogoOrbitalDot';

import { render } from '../../test-utils';

describe('LogoOrbitalDot', () => {
  it('renders the orbital wrapper when reduceMotion is false', () => {
    const { container } = render(<LogoOrbitalDot reduceMotion={false} />);
    expect(container.firstChild).toBeInTheDocument();
    expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
  });

  it('renders nothing when reduceMotion is true', () => {
    const { container } = render(<LogoOrbitalDot reduceMotion={true} />);
    expect(container.firstChild).toBeNull();
  });
});
