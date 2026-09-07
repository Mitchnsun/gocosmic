import { afterEach, describe, expect, it, vi } from 'vitest';

import { ZoneIntervention } from '@/components/ZoneIntervention';
import { getStationBorderClass } from '@/components/ZoneIntervention/ZoneIntervention.utils';

import { render } from '../test-utils';

const defaultProps = {
  label: 'Our service area',
  availability: 'Available',
  stations: [
    { name: 'Annecy', meta: 'Base · 74' },
    { name: 'Geneva', meta: 'Switzerland' },
    { name: 'Haute-Savoie', meta: 'France' },
    { name: 'Lake Geneva region', meta: 'Léman · CH/FR' },
  ],
};

describe('ZoneIntervention', () => {
  const originalMatchMedia = window.matchMedia;

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
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

  it('renders all 4 station names', () => {
    const { getByText } = render(<ZoneIntervention {...defaultProps} />);
    expect(getByText('Annecy')).toBeInTheDocument();
    expect(getByText('Geneva')).toBeInTheDocument();
    expect(getByText('Haute-Savoie')).toBeInTheDocument();
    expect(getByText('Lake Geneva region')).toBeInTheDocument();
  });

  it('renders all 4 station meta strings', () => {
    const { getByText } = render(<ZoneIntervention {...defaultProps} />);
    expect(getByText('Base · 74')).toBeInTheDocument();
    expect(getByText('Switzerland')).toBeInTheDocument();
    expect(getByText('France')).toBeInTheDocument();
    expect(getByText('Léman · CH/FR')).toBeInTheDocument();
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

  it('renders exactly 4 list items', () => {
    const { getAllByRole } = render(<ZoneIntervention {...defaultProps} />);
    const items = getAllByRole('listitem');
    expect(items).toHaveLength(4);
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

describe('getStationBorderClass', () => {
  it('returns no border classes for the first station', () => {
    expect(getStationBorderClass(0)).toBe('');
  });

  it('returns a top border on mobile and a left border from sm for the second station', () => {
    expect(getStationBorderClass(1)).toBe('border-t sm:border-t-0 sm:border-l');
  });

  it('returns a top border below lg and a left border from lg for the third station', () => {
    expect(getStationBorderClass(2)).toBe('border-t lg:border-t-0 lg:border-l');
  });

  it('returns a top border on mobile, a left border from sm, no top border from lg for the fourth station', () => {
    expect(getStationBorderClass(3)).toBe('border-t sm:border-l lg:border-t-0');
  });

  it('returns only a top border for the first cell of a second row (5th station)', () => {
    expect(getStationBorderClass(4)).toBe('border-t');
  });

  it('returns a top border and a left border from sm for a 6th station', () => {
    expect(getStationBorderClass(5)).toBe('border-t sm:border-l');
  });
});
