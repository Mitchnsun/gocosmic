import { fireEvent } from '@testing-library/react';

import MobileMenuButton from '@/components/Header/MobileMenuButton';

import { render, screen } from '../../test-utils';

describe('MobileMenuButton', () => {
  const noop = vi.fn();
  const buttonRef = { current: null } as unknown as React.RefObject<HTMLButtonElement | null>;

  it('renders a button', () => {
    render(<MobileMenuButton isOpen={false} onToggle={noop} buttonRef={buttonRef} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('has aria-label "Open menu" when closed', () => {
    render(<MobileMenuButton isOpen={false} onToggle={noop} buttonRef={buttonRef} />);
    expect(screen.getByRole('button')).toHaveAccessibleName('Open menu');
  });

  it('has aria-label "Close menu" when open', () => {
    render(<MobileMenuButton isOpen={true} onToggle={noop} buttonRef={buttonRef} />);
    expect(screen.getByRole('button')).toHaveAccessibleName('Close menu');
  });

  it('has aria-expanded=false when closed', () => {
    render(<MobileMenuButton isOpen={false} onToggle={noop} buttonRef={buttonRef} />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'false');
  });

  it('has aria-expanded=true when open', () => {
    render(<MobileMenuButton isOpen={true} onToggle={noop} buttonRef={buttonRef} />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'true');
  });

  it('has aria-controls="mobile-menu"', () => {
    render(<MobileMenuButton isOpen={false} onToggle={noop} buttonRef={buttonRef} />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-controls', 'mobile-menu');
  });

  it('calls onToggle when clicked', () => {
    const onToggle = vi.fn();
    render(<MobileMenuButton isOpen={false} onToggle={onToggle} buttonRef={buttonRef} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it('renders two bar spans', () => {
    const { container } = render(<MobileMenuButton isOpen={false} onToggle={noop} buttonRef={buttonRef} />);
    expect(container.querySelectorAll('span')).toHaveLength(2);
  });

  it('applies extra className', () => {
    render(<MobileMenuButton isOpen={false} onToggle={noop} buttonRef={buttonRef} className="md:hidden" />);
    expect(screen.getByRole('button')).toHaveClass('md:hidden');
  });
});
