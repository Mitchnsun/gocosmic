import { CodeBracketIcon, PuzzlePieceIcon, RocketLaunchIcon, SparklesIcon } from '@heroicons/react/24/solid';
import { act } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { Service } from '@/components/ServicesGrid';
import { ServicesGrid } from '@/components/ServicesGrid';

import { render } from '../test-utils';

const defaultServices: Service[] = [
  {
    id: 'development',
    title: 'Stellar Development',
    description: 'Building robust and scalable apps.',
    icon: <CodeBracketIcon className="h-7 w-7" />,
    color: 'aerospace',
    features: ['React', 'Next.js', 'TypeScript'],
    link: { href: '/services#development', label: 'Learn more' },
  },
  {
    id: 'design',
    title: 'Mystical UI/UX',
    description: 'Crafting enchanting experiences.',
    icon: <SparklesIcon className="h-7 w-7" />,
    color: 'royal',
  },
  {
    id: 'ai',
    title: 'AI Powered',
    description: 'Integrating advanced AI features.',
    icon: <PuzzlePieceIcon className="h-7 w-7" />,
    color: 'jungle',
  },
  {
    id: 'launch',
    title: 'Cosmic Launch',
    description: 'Guiding your app to liftoff.',
    icon: <RocketLaunchIcon className="h-7 w-7" />,
    color: 'aerospace',
  },
];

describe('ServicesGrid', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('rendering', () => {
    it('renders without crashing', () => {
      const { container } = render(<ServicesGrid services={defaultServices} />);
      expect(container).toBeInTheDocument();
    });

    it('renders all provided service cards', () => {
      const { getByTestId } = render(<ServicesGrid services={defaultServices} />);
      for (const s of defaultServices) {
        expect(getByTestId(`service-card-${s.id}`)).toBeInTheDocument();
      }
    });

    it('renders the section with a labelled region when a title is provided', () => {
      const { getByRole } = render(<ServicesGrid services={defaultServices} title="Our Services" />);
      expect(getByRole('region', { name: 'Our Services' })).toBeInTheDocument();
    });

    it('renders subtitle and eyebrow when provided', () => {
      const { getByText } = render(
        <ServicesGrid services={defaultServices} eyebrow="[ SERVICES · 04 ]" subtitle="Four pillars" />
      );
      expect(getByText('[ SERVICES · 04 ]')).toBeInTheDocument();
      expect(getByText('Four pillars')).toBeInTheDocument();
    });

    it('applies the id prop on the section element', () => {
      const { container } = render(<ServicesGrid id="services" services={defaultServices} />);
      expect(container.querySelector('#services')).toBeInTheDocument();
    });
  });

  describe('service content', () => {
    it('renders title and description for each service', () => {
      const { getByText } = render(<ServicesGrid services={defaultServices} />);
      expect(getByText('Stellar Development')).toBeInTheDocument();
      expect(getByText('Building robust and scalable apps.')).toBeInTheDocument();
      expect(getByText('Mystical UI/UX')).toBeInTheDocument();
    });

    it('renders the optional features list', () => {
      const { getByText, getByLabelText } = render(<ServicesGrid services={defaultServices} />);
      const list = getByLabelText('Stellar Development features');
      expect(list).toBeInTheDocument();
      expect(getByText('React')).toBeInTheDocument();
      expect(getByText('Next.js')).toBeInTheDocument();
      expect(getByText('TypeScript')).toBeInTheDocument();
    });

    it('does not render a features list when features are omitted', () => {
      const { queryByLabelText } = render(<ServicesGrid services={defaultServices} />);
      expect(queryByLabelText('AI Powered features')).not.toBeInTheDocument();
    });

    it('renders the optional link with an accessible label', () => {
      const { getByRole } = render(<ServicesGrid services={defaultServices} />);
      const link = getByRole('link', { name: /Learn more — Stellar Development/i });
      expect(link).toHaveAttribute('href', '/services#development');
    });

    it('does not render a link when not provided', () => {
      const { queryAllByRole } = render(<ServicesGrid services={defaultServices} />);
      expect(queryAllByRole('link')).toHaveLength(1);
    });

    it('applies the color token class on the icon wrapper', () => {
      const { getByTestId } = render(<ServicesGrid services={defaultServices} />);
      expect(getByTestId('service-icon-development').className).toContain('text-aerospace');
      expect(getByTestId('service-icon-design').className).toContain('text-royal');
      expect(getByTestId('service-icon-ai').className).toContain('text-jungle');
    });
  });

  describe('layout', () => {
    it('uses 4-column responsive grid by default', () => {
      const { container } = render(<ServicesGrid services={defaultServices} />);
      const list = container.querySelector('ul');
      expect(list?.className).toContain('lg:grid-cols-4');
    });

    it('honors a custom columns prop', () => {
      const { container } = render(<ServicesGrid services={defaultServices} columns={2} />);
      const list = container.querySelector('ul');
      expect(list?.className).toContain('sm:grid-cols-2');
      expect(list?.className).not.toContain('grid-cols-4');
    });

    it('supports a horizontal layout variant', () => {
      const { container } = render(<ServicesGrid services={defaultServices} layout="horizontal" />);
      const list = container.querySelector('ul');
      expect(list?.className).toContain('flex');
    });
  });

  describe('animation', () => {
    it('reveals cards after the IntersectionObserver fires with stagger delay', () => {
      const { getByTestId } = render(<ServicesGrid services={defaultServices} staggerDelay={100} />);

      // Cards start hidden (opacity 0)
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

      const { getByTestId } = render(<ServicesGrid services={defaultServices} />);
      expect(getByTestId('service-card-development')).toHaveStyle({ opacity: '1' });
      expect(getByTestId('service-card-launch')).toHaveStyle({ opacity: '1' });
    });
  });
});
