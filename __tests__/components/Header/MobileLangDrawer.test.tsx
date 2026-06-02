import { fireEvent } from '@testing-library/react';

import MobileLangDrawer from '@/components/Header/MobileLangDrawer';

import { render, screen } from '../../test-utils';

describe('MobileLangDrawer', () => {
  const onClose = vi.fn();

  beforeEach(() => {
    onClose.mockClear();
  });

  it('renders as a dialog', () => {
    render(<MobileLangDrawer onClose={onClose} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('has id="lang-drawer"', () => {
    render(<MobileLangDrawer onClose={onClose} />);
    expect(screen.getByRole('dialog')).toHaveAttribute('id', 'lang-drawer');
  });

  it('has aria-modal="true"', () => {
    render(<MobileLangDrawer onClose={onClose} />);
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
  });

  it('renders all 5 language options', () => {
    render(<MobileLangDrawer onClose={onClose} />);
    expect(screen.getByRole('button', { name: /english/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /français/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /español/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /deutsch/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /italiano/i })).toBeInTheDocument();
  });

  it('calls onClose when the close button is clicked', () => {
    render(<MobileLangDrawer onClose={onClose} />);
    fireEvent.click(screen.getByRole('button', { name: /close menu/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when Escape is pressed', () => {
    render(<MobileLangDrawer onClose={onClose} />);
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('locks body scroll on mount and restores on unmount', () => {
    const { unmount } = render(<MobileLangDrawer onClose={onClose} />);
    expect(document.body.style.overflow).toBe('hidden');
    unmount();
    expect(document.body.style.overflow).toBe('');
  });
});
