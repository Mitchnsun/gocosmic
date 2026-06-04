import { afterEach, describe, expect, it, vi } from 'vitest';

import { ZoneIntervention } from '@/components/ZoneIntervention';

import { render } from '../test-utils';

const defaultProps = {
  label: 'Our service area',
  availability: 'Available',
  stations: [
    { name: 'Annecy', meta: 'Base · 74' },
    { name: 'Geneva', meta: 'Lake Geneva' },
    { name: 'Haute-Savoie', meta: 'France' },
  ],
};

describe('ZoneIntervention', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the label', () => {
    const { getByText } = render(<ZoneIntervention {...defaultProps} />);
    expect(getByText('Our service area')).toBeInTheDocument();
  });

  it('renders the availability text', () => {
    const { getByText } = render(<ZoneIntervention {...defaultProps} />);
    expect(getByText('Available')).toBeInTheDocument();
  });

  it('renders all 3 station names', () => {
    const { getByText } = render(<ZoneIntervention {...defaultProps} />);
    expect(getByText('Annecy')).toBeInTheDocument();
    expect(getByText('Geneva')).toBeInTheDocument();
    expect(getByText('Haute-Savoie')).toBeInTheDocument();
  });

  it('renders all 3 station meta strings', () => {
    const { getByText } = render(<ZoneIntervention {...defaultProps} />);
    expect(getByText('Base · 74')).toBeInTheDocument();
    expect(getByText('Lake Geneva')).toBeInTheDocument();
    expect(getByText('France')).toBeInTheDocument();
  });

  it('contains no 📍 emoji in the rendered output', () => {
    const { container } = render(<ZoneIntervention {...defaultProps} />);
    expect(container.innerHTML).not.toContain('📍');
  });

  it('contains no class with "blue" or "gray" in the rendered output', () => {
    const { container } = render(<ZoneIntervention {...defaultProps} />);
    // Check all elements for blue-* or gray-* classes
    const allElements = container.querySelectorAll('[class]');
    allElements.forEach((el) => {
      const classList = el.getAttribute('class') ?? '';
      expect(classList).not.toMatch(/\bblue-/);
      expect(classList).not.toMatch(/\bgray-/);
    });
  });

  it('renders a section with aria-labelledby="zone-heading"', () => {
    const { container } = render(<ZoneIntervention {...defaultProps} />);
    const section = container.querySelector('section[aria-labelledby="zone-heading"]');
    expect(section).toBeInTheDocument();
  });

  it('renders exactly 3 list items', () => {
    const { getAllByRole } = render(<ZoneIntervention {...defaultProps} />);
    const items = getAllByRole('listitem');
    expect(items).toHaveLength(3);
  });

  it('applies a custom className to the section', () => {
    const { container } = render(<ZoneIntervention {...defaultProps} className="my-custom-class" />);
    const section = container.querySelector('section');
    expect(section).toHaveClass('my-custom-class');
  });

  describe('reduced-motion: animate-ping present by default', () => {
    it('shows animate-ping when matchMedia reports no reduced motion preference', () => {
      window.matchMedia = vi.fn().mockReturnValue({
        matches: false,
        media: '(prefers-reduced-motion: reduce)',
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      });

      const { container } = render(<ZoneIntervention {...defaultProps} />);
      expect(container.querySelector('.animate-ping')).toBeInTheDocument();
    });
  });

  describe('reduced-motion: animate-ping removed when preference is set', () => {
    it('omits animate-ping when matchMedia reports reduced motion preference', () => {
      window.matchMedia = vi.fn().mockReturnValue({
        matches: true,
        media: '(prefers-reduced-motion: reduce)',
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      });

      const { container } = render(<ZoneIntervention {...defaultProps} />);
      expect(container.querySelector('.animate-ping')).not.toBeInTheDocument();
    });

    it('shows animate-ping when respectReducedMotion=false regardless of user preference', () => {
      window.matchMedia = vi.fn().mockReturnValue({
        matches: true,
        media: '(prefers-reduced-motion: reduce)',
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      });

      const { container } = render(<ZoneIntervention {...defaultProps} respectReducedMotion={false} />);
      expect(container.querySelector('.animate-ping')).toBeInTheDocument();
    });
  });
});
