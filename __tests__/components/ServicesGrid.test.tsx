import { act } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ServicesGrid } from '@/components/ServicesGrid';

import { render } from '../test-utils';

describe('ServicesGrid', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('rendering', () => {
    it('renders without crashing', () => {
      const { container } = render(<ServicesGrid />);
      expect(container).toBeInTheDocument();
    });

    it('renders all four service cards', () => {
      const { getByTestId } = render(<ServicesGrid />);
      for (const id of ['development', 'design', 'ai', 'launch']) {
        expect(getByTestId(`service-card-${id}`)).toBeInTheDocument();
      }
    });

    it('renders the section as a labelled region', () => {
      const { getByRole } = render(<ServicesGrid />);
      expect(getByRole('region', { name: 'Our Cosmic Services' })).toBeInTheDocument();
    });

    it('renders the eyebrow and subtitle from translations', () => {
      const { getByText } = render(<ServicesGrid />);
      expect(getByText('[ SERVICES · 04 ]')).toBeInTheDocument();
      expect(
        getByText('Four pillars to launch your product into orbit — design, build, ship, grow.')
      ).toBeInTheDocument();
    });

    it('renders with the hardcoded section id', () => {
      const { container } = render(<ServicesGrid />);
      expect(container.querySelector('#services')).toBeInTheDocument();
    });
  });

  describe('service content', () => {
    it('renders title and description for each service', () => {
      const { getByText } = render(<ServicesGrid />);
      expect(getByText('Stellar Development')).toBeInTheDocument();
      expect(getByText('Mystical UI/UX Design')).toBeInTheDocument();
      expect(getByText('AI Powered')).toBeInTheDocument();
      expect(getByText('Cosmic Launch')).toBeInTheDocument();
    });

    it('renders the features list for each service', () => {
      const { getByLabelText } = render(<ServicesGrid />);
      expect(getByLabelText('Stellar Development features')).toBeInTheDocument();
      expect(getByLabelText('Mystical UI/UX Design features')).toBeInTheDocument();
      expect(getByLabelText('AI Powered features')).toBeInTheDocument();
      expect(getByLabelText('Cosmic Launch features')).toBeInTheDocument();
    });

    it('renders links to the services page for each card', () => {
      const { getAllByRole } = render(<ServicesGrid />);
      const links = getAllByRole('link');
      expect(links).toHaveLength(4);
      expect(links[0]).toHaveAttribute('href', '/services#development');
      expect(links[1]).toHaveAttribute('href', '/services#design');
      expect(links[2]).toHaveAttribute('href', '/services#ai');
      expect(links[3]).toHaveAttribute('href', '/services#launch');
    });

    it('applies the color token class on each icon wrapper', () => {
      const { getByTestId } = render(<ServicesGrid />);
      expect(getByTestId('service-icon-development').className).toContain('text-jungle');
      expect(getByTestId('service-icon-design').className).toContain('text-royal');
      expect(getByTestId('service-icon-ai').className).toContain('text-yellow-400');
      expect(getByTestId('service-icon-launch').className).toContain('text-blue-400');
    });
  });

  describe('layout', () => {
    it('uses a 4-column responsive grid', () => {
      const { container } = render(<ServicesGrid />);
      const list = container.querySelector('ul');
      expect(list?.className).toContain('lg:grid-cols-4');
    });
  });

  describe('animation', () => {
    it('reveals cards after the IntersectionObserver fires with stagger delay', () => {
      const { getByTestId } = render(<ServicesGrid />);

      const first = getByTestId('service-card-development');
      expect(first).toHaveStyle({ opacity: '0' });

      act(() => {
        vi.advanceTimersByTime(0);
      });
      expect(getByTestId('service-card-development')).toHaveStyle({ opacity: '1' });

      act(() => {
        vi.advanceTimersByTime(100);
      });
      expect(getByTestId('service-card-design')).toHaveStyle({ opacity: '1' });

      act(() => {
        vi.advanceTimersByTime(200);
      });
      expect(getByTestId('service-card-launch')).toHaveStyle({ opacity: '1' });
    });

    it('renders cards visible immediately when prefers-reduced-motion is set', () => {
      const mockMatchMedia = vi.fn().mockImplementation((query: string) => ({
        matches: query.includes('reduce'),
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));
      Object.defineProperty(window, 'matchMedia', { writable: true, value: mockMatchMedia });

      const { getByTestId } = render(<ServicesGrid />);
      expect(getByTestId('service-card-development')).toHaveStyle({ opacity: '1' });
      expect(getByTestId('service-card-launch')).toHaveStyle({ opacity: '1' });
    });
  });
});
