import { EnvelopeIcon, WrenchScrewdriverIcon } from '@heroicons/react/24/solid';
import { fireEvent } from '@testing-library/react';

import { HeaderNavItem } from '@/components/Header/constants';
import MobileMenu from '@/components/Header/MobileMenu';

import { render, screen } from '../../test-utils';

const items: HeaderNavItem[] = [
  { label: 'Services', href: '/services', ariaLabel: 'Services', icon: WrenchScrewdriverIcon },
  { label: 'Contact', href: '/contact', ariaLabel: 'Contact', icon: EnvelopeIcon },
];

describe('MobileMenu', () => {
  const onClose = vi.fn();

  beforeEach(() => {
    onClose.mockClear();
  });

  it('renders the dialog', () => {
    render(<MobileMenu onClose={onClose} items={items} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('has id="mobile-menu"', () => {
    render(<MobileMenu onClose={onClose} items={items} />);
    expect(screen.getByRole('dialog')).toHaveAttribute('id', 'mobile-menu');
  });

  it('has aria-modal="true"', () => {
    render(<MobileMenu onClose={onClose} items={items} />);
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
  });

  it('renders all navigation links', () => {
    render(<MobileMenu onClose={onClose} items={items} />);
    expect(screen.getByRole('link', { name: 'Services' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Contact' })).toBeInTheDocument();
  });

  it('calls onClose when a link is clicked', () => {
    render(<MobileMenu onClose={onClose} items={items} />);
    fireEvent.click(screen.getByRole('link', { name: 'Services' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('renders the email footer link', () => {
    render(<MobileMenu onClose={onClose} items={items} />);
    expect(screen.getByRole('link', { name: /contact@gocosmic\.dev/i })).toBeInTheDocument();
  });

  it('does not render the LanguageSwitcher (moved to header next to burger)', () => {
    render(<MobileMenu onClose={onClose} items={items} />);
    expect(screen.queryByRole('button', { name: /switch language/i })).not.toBeInTheDocument();
  });
});
