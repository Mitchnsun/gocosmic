import type { TimelineStep } from '@/components/ProcessTimeline';
import { ProcessTimeline } from '@/components/ProcessTimeline';

import { render } from '../test-utils';

const defaultSteps: TimelineStep[] = [
  {
    id: 'discovery',
    label: 'T-30',
    title: 'Discover',
    description: 'Audit, goals, constraints.',
    color: 'aerospace',
  },
  {
    id: 'design',
    label: 'T-20',
    title: 'Design',
    description: 'Wireframes, prototypes.',
    color: 'aerospace',
  },
  {
    id: 'build',
    label: 'T-10',
    title: 'Build',
    description: 'TypeScript, tests.',
    color: 'aerospace',
  },
  {
    id: 'launch',
    label: 'T-0',
    title: 'Launch',
    description: 'Monitoring, performance.',
    color: 'aerospace',
  },
];

const stepsWithFeatures: TimelineStep[] = [
  {
    id: 'discovery',
    label: 'T-30',
    title: 'Discover',
    description: 'Audit, goals, constraints.',
    features: ['Market analysis', 'User research', 'Requirements'],
    color: 'aerospace',
  },
];

describe('ProcessTimeline', () => {
  describe('rendering', () => {
    it('renders without crashing', () => {
      const { container } = render(<ProcessTimeline steps={defaultSteps} />);
      expect(container).toBeInTheDocument();
    });

    it('renders the section element', () => {
      const { getByRole } = render(<ProcessTimeline steps={defaultSteps} title="Our Process" />);
      expect(getByRole('region', { name: 'Our Process' })).toBeInTheDocument();
    });

    it('renders with an id prop', () => {
      const { container } = render(<ProcessTimeline id="process" steps={defaultSteps} />);
      expect(container.querySelector('#process')).toBeInTheDocument();
    });
  });

  describe('header content', () => {
    it('renders the title when provided', () => {
      const { getByRole } = render(<ProcessTimeline steps={defaultSteps} title="Four phases. No drama." />);
      expect(getByRole('heading', { level: 2 })).toBeInTheDocument();
    });

    it('renders the subtitle when provided', () => {
      const { getByText } = render(<ProcessTimeline steps={defaultSteps} subtitle="From idea to reality" />);
      expect(getByText('From idea to reality')).toBeInTheDocument();
    });

    it('renders the eyebrow when provided', () => {
      const { getByText } = render(<ProcessTimeline steps={defaultSteps} eyebrow="[ PROCESS ]" />);
      expect(getByText('[ PROCESS ]')).toBeInTheDocument();
    });

    it('does not render header section when no title, subtitle, or eyebrow', () => {
      const { queryByRole } = render(<ProcessTimeline steps={defaultSteps} />);
      expect(queryByRole('heading', { level: 2 })).not.toBeInTheDocument();
    });
  });

  describe('steps rendering', () => {
    it('renders the correct number of steps', () => {
      const { getAllByRole } = render(<ProcessTimeline steps={defaultSteps} />);
      expect(getAllByRole('listitem')).toHaveLength(defaultSteps.length);
    });

    it('renders step titles', () => {
      const { getByText } = render(<ProcessTimeline steps={defaultSteps} />);
      expect(getByText('Discover')).toBeInTheDocument();
      expect(getByText('Design')).toBeInTheDocument();
      expect(getByText('Build')).toBeInTheDocument();
      expect(getByText('Launch')).toBeInTheDocument();
    });

    it('renders step labels', () => {
      const { getByText } = render(<ProcessTimeline steps={defaultSteps} />);
      expect(getByText('T-30')).toBeInTheDocument();
      expect(getByText('T-20')).toBeInTheDocument();
      expect(getByText('T-10')).toBeInTheDocument();
      expect(getByText('T-0')).toBeInTheDocument();
    });

    it('renders step descriptions when showDescription is true (default)', () => {
      const { getByText } = render(<ProcessTimeline steps={defaultSteps} />);
      expect(getByText('Audit, goals, constraints.')).toBeInTheDocument();
    });

    it('hides step descriptions when showDescription is false', () => {
      const { queryByText } = render(<ProcessTimeline steps={defaultSteps} showDescription={false} />);
      expect(queryByText('Audit, goals, constraints.')).not.toBeInTheDocument();
    });

    it('renders feature lists when provided and showDescription is true', () => {
      const { getByText } = render(<ProcessTimeline steps={stepsWithFeatures} />);
      expect(getByText('Market analysis')).toBeInTheDocument();
      expect(getByText('User research')).toBeInTheDocument();
      expect(getByText('Requirements')).toBeInTheDocument();
    });

    it('hides feature lists when showDescription is false', () => {
      const { queryByText } = render(<ProcessTimeline steps={stepsWithFeatures} showDescription={false} />);
      expect(queryByText('Market analysis')).not.toBeInTheDocument();
    });

    it('renders dots for each step', () => {
      const { getByTestId } = render(<ProcessTimeline steps={defaultSteps} />);
      expect(getByTestId('dot-discovery')).toBeInTheDocument();
      expect(getByTestId('dot-design')).toBeInTheDocument();
      expect(getByTestId('dot-build')).toBeInTheDocument();
      expect(getByTestId('dot-launch')).toBeInTheDocument();
    });
  });

  describe('layouts', () => {
    it('renders horizontal layout by default', () => {
      const { getByRole } = render(<ProcessTimeline steps={defaultSteps} />);
      const list = getByRole('list');
      expect(list).toHaveClass('grid');
    });

    it('renders vertical layout when specified', () => {
      const { getByRole } = render(<ProcessTimeline steps={defaultSteps} layout="vertical" />);
      const list = getByRole('list');
      expect(list).toHaveClass('pl-8');
    });

    it('renders compact layout when specified', () => {
      const { getAllByRole } = render(<ProcessTimeline steps={defaultSteps} layout="compact" />);
      expect(getAllByRole('listitem')).toHaveLength(defaultSteps.length);
    });

    it('renders SVG path in vertical layout', () => {
      const { container } = render(<ProcessTimeline steps={defaultSteps} layout="vertical" />);
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('does not render SVG path in horizontal layout', () => {
      const { container } = render(<ProcessTimeline steps={defaultSteps} layout="horizontal" />);
      expect(container.querySelector('svg')).not.toBeInTheDocument();
    });
  });

  describe('color variants', () => {
    it('applies aerospace color class to dots', () => {
      const { getByTestId } = render(<ProcessTimeline steps={defaultSteps} />);
      const dot = getByTestId('dot-discovery');
      expect(dot.className).toContain('bg-aerospace');
    });

    it('applies royal color class when specified', () => {
      const steps = [{ id: 'step1', label: 'T-1', title: 'Step', color: 'royal' as const }];
      const { getByTestId } = render(<ProcessTimeline steps={steps} />);
      expect(getByTestId('dot-step1').className).toContain('bg-royal');
    });

    it('applies jungle color class when specified', () => {
      const steps = [{ id: 'step1', label: 'T-1', title: 'Step', color: 'jungle' as const }];
      const { getByTestId } = render(<ProcessTimeline steps={steps} />);
      expect(getByTestId('dot-step1').className).toContain('bg-jungle');
    });

    it('applies default color class when color is default', () => {
      const steps = [{ id: 'step1', label: 'T-1', title: 'Step', color: 'default' as const }];
      const { getByTestId } = render(<ProcessTimeline steps={steps} />);
      expect(getByTestId('dot-step1').className).toContain('bg-slate-400');
    });

    it('applies default color when no color specified', () => {
      const steps = [{ id: 'step1', label: 'T-1', title: 'Step' }];
      const { getByTestId } = render(<ProcessTimeline steps={steps} />);
      expect(getByTestId('dot-step1').className).toContain('bg-slate-400');
    });
  });

  describe('accessibility', () => {
    it('renders a list with accessible label from title', () => {
      const { getByRole } = render(<ProcessTimeline steps={defaultSteps} title="Our Process" />);
      expect(getByRole('list', { name: 'Our Process' })).toBeInTheDocument();
    });

    it('renders a list with default accessible label when no title', () => {
      const { getByRole } = render(<ProcessTimeline steps={defaultSteps} />);
      expect(getByRole('list', { name: 'Process timeline' })).toBeInTheDocument();
    });

    it('marks decorative dots as aria-hidden', () => {
      const { getByTestId } = render(<ProcessTimeline steps={defaultSteps} />);
      expect(getByTestId('dot-discovery')).toHaveAttribute('aria-hidden', 'true');
    });

    it('renders feature lists with accessible aria-label', () => {
      const { getByRole } = render(<ProcessTimeline steps={stepsWithFeatures} />);
      expect(getByRole('list', { name: 'Discover features' })).toBeInTheDocument();
    });
  });

  describe('reduced motion', () => {
    it('shows content immediately when prefers-reduced-motion is set', () => {
      // Override matchMedia to simulate prefers-reduced-motion
      const originalMatchMedia = window.matchMedia;
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: (query: string) => ({
          matches: query === '(prefers-reduced-motion: reduce)',
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        }),
      });

      const { getByText } = render(<ProcessTimeline steps={defaultSteps} respectReducedMotion={true} />);
      expect(getByText('Discover')).toBeInTheDocument();

      // Restore
      Object.defineProperty(window, 'matchMedia', { writable: true, value: originalMatchMedia });
    });

    it('ignores reduced motion when respectReducedMotion is false', () => {
      const { getByText } = render(<ProcessTimeline steps={defaultSteps} respectReducedMotion={false} />);
      expect(getByText('Discover')).toBeInTheDocument();
    });
  });

  describe('vertical layout with features', () => {
    it('renders features in vertical layout', () => {
      const { getByText } = render(<ProcessTimeline steps={stepsWithFeatures} layout="vertical" />);
      expect(getByText('Market analysis')).toBeInTheDocument();
      expect(getByText('User research')).toBeInTheDocument();
    });

    it('hides features in vertical layout when showDescription is false', () => {
      const { queryByText } = render(
        <ProcessTimeline steps={stepsWithFeatures} layout="vertical" showDescription={false} />
      );
      expect(queryByText('Market analysis')).not.toBeInTheDocument();
    });
  });

  describe('props', () => {
    it('accepts and applies custom className', () => {
      const { container } = render(<ProcessTimeline steps={defaultSteps} className="my-custom-class" />);
      expect(container.firstChild).toHaveClass('my-custom-class');
    });

    it('renders with an empty steps array without crashing', () => {
      const { container } = render(<ProcessTimeline steps={[]} />);
      expect(container).toBeInTheDocument();
    });

    it('renders with a single step', () => {
      const { getAllByRole } = render(<ProcessTimeline steps={[defaultSteps[0]!]} />);
      expect(getAllByRole('listitem')).toHaveLength(1);
    });

    it('handles steps without optional fields', () => {
      const minimalSteps = [{ id: 'min', label: 'T-0', title: 'Minimal' }];
      const { getByText } = render(<ProcessTimeline steps={minimalSteps} />);
      expect(getByText('Minimal')).toBeInTheDocument();
    });
  });
});
