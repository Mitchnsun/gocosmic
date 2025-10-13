import { render, screen } from '@testing-library/react';

import LinkedInIcon from '@/components/icons/LinkedInIcon';

describe('LinkedInIcon Component', () => {
  it('should render the LinkedIn icon correctly', () => {
    render(<LinkedInIcon data-testid="linkedin-icon" />);

    const icon = screen.getByTestId('linkedin-icon');
    expect(icon).toBeInTheDocument();
    expect(icon).toBeInstanceOf(SVGSVGElement);
    expect(icon).toHaveAttribute('viewBox', '0 0 24 24');
    expect(icon).toHaveAttribute('fill', 'currentColor');
    expect(icon).toHaveAttribute('aria-hidden', 'true');
  });

  it('should apply className prop correctly', () => {
    render(<LinkedInIcon className="test-class h-4 w-4" data-testid="linkedin-icon" />);

    const icon = screen.getByTestId('linkedin-icon');
    expect(icon).toHaveClass('test-class', 'h-4', 'w-4');
  });

  it('should spread additional props to the SVG element', () => {
    render(<LinkedInIcon data-testid="linkedin-icon" id="custom-id" role="img" />);

    const icon = screen.getByTestId('linkedin-icon');
    expect(icon).toHaveAttribute('id', 'custom-id');
    expect(icon).toHaveAttribute('role', 'img');
  });
});
