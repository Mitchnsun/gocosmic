import { act } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { Project } from '@/components/ProjectsShowcase';
import { ProjectsShowcase } from '@/components/ProjectsShowcase';

import { render, screen } from '../test-utils';

const mockProjects: Project[] = [
  {
    id: 'project-one',
    title: 'Project One',
    tagline: 'Mobile · iOS / Android',
    description: 'A mystical app with AI-powered daily fortunes.',
    tags: ['AI', 'Wellness'],
    year: 2025,
    href: '/projects/project-one',
    featured: true,
    image: { src: '/projects/project-one/hero.jpg', alt: 'Project One preview', width: 1200, height: 600 },
  },
  {
    id: 'project-two',
    title: 'Project Two',
    tagline: 'Web · Next.js',
    description: 'A modern responsive web application.',
    tags: ['Personal CV'],
    year: 2024,
    href: '/projects/project-two',
    image: { src: '/projects/project-two/hero.jpg', alt: 'Project Two preview', width: 1200, height: 600 },
  },
  {
    id: 'project-three',
    title: 'Project Three',
    tagline: 'Web · Real-time',
    description: 'Real-time competition results platform.',
    tags: ['Sport', 'Live'],
    year: 2024,
    href: '/projects/project-three',
    image: { src: '/projects/project-three/hero.jpg', alt: 'Project Three preview', width: 1200, height: 600 },
  },
];

describe('ProjectsShowcase', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('rendering', () => {
    it('renders without crashing', () => {
      const { container } = render(<ProjectsShowcase projects={mockProjects} />);
      expect(container).toBeInTheDocument();
    });

    it('renders a section element', () => {
      render(<ProjectsShowcase projects={mockProjects} title="Our Projects" />);
      expect(screen.getByRole('region', { name: 'Our Projects' })).toBeInTheDocument();
    });

    it('renders with a custom id', () => {
      const { container } = render(<ProjectsShowcase id="projects" projects={mockProjects} />);
      expect(container.querySelector('#projects')).toBeInTheDocument();
    });

    it('renders all projects in the list', () => {
      render(<ProjectsShowcase projects={mockProjects} />);
      for (const project of mockProjects) {
        expect(screen.getByTestId(`project-card-${project.id}`)).toBeInTheDocument();
      }
    });
  });

  describe('header content', () => {
    it('renders the title when provided', () => {
      render(<ProjectsShowcase projects={mockProjects} title="Recently in orbit." />);
      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
      expect(screen.getByText('Recently in orbit.')).toBeInTheDocument();
    });

    it('renders the subtitle when provided', () => {
      render(<ProjectsShowcase projects={mockProjects} subtitle="A selection of our latest work" />);
      expect(screen.getByText('A selection of our latest work')).toBeInTheDocument();
    });

    it('renders the eyebrow when provided', () => {
      render(<ProjectsShowcase projects={mockProjects} eyebrow="[ SELECTED WORK · 04 ]" />);
      expect(screen.getByText('[ SELECTED WORK · 04 ]')).toBeInTheDocument();
    });

    it('does not render the header section when no header props are provided', () => {
      render(<ProjectsShowcase projects={mockProjects} />);
      expect(screen.queryByRole('heading', { level: 2 })).not.toBeInTheDocument();
    });
  });

  describe('project content', () => {
    it('renders project titles', () => {
      render(<ProjectsShowcase projects={mockProjects} />);
      expect(screen.getByText('Project One')).toBeInTheDocument();
      expect(screen.getByText('Project Two')).toBeInTheDocument();
      expect(screen.getByText('Project Three')).toBeInTheDocument();
    });

    it('renders project links', () => {
      render(<ProjectsShowcase projects={mockProjects} />);
      const links = screen.getAllByRole('link');
      expect(links.length).toBeGreaterThanOrEqual(3);
      expect(links[0]).toHaveAttribute('href', '/projects/project-one');
      expect(links[1]).toHaveAttribute('href', '/projects/project-two');
    });

    it('renders project tags', () => {
      render(<ProjectsShowcase projects={mockProjects} layout="alternating" />);
      const tagLists = screen.getAllByRole('list', { name: /project tags/i });
      expect(tagLists.length).toBeGreaterThan(0);
    });

    it('renders alt text on images (alternating layout)', () => {
      render(<ProjectsShowcase projects={mockProjects} layout="alternating" />);
      expect(screen.getByAltText('Project One preview')).toBeInTheDocument();
      expect(screen.getByAltText('Project Two preview')).toBeInTheDocument();
    });

    it('renders alt text on images (grid layout)', () => {
      render(<ProjectsShowcase projects={mockProjects} layout="grid" />);
      expect(screen.getByAltText('Project One preview')).toBeInTheDocument();
    });

    it('renders project year in list layout', () => {
      render(<ProjectsShowcase projects={mockProjects} layout="list" />);
      const years = screen.getAllByText('2025');
      expect(years.length).toBeGreaterThan(0);
    });

    it('opens external links in a new tab', () => {
      const externalProjects: Project[] = [
        {
          ...mockProjects[0]!,
          id: 'external',
          href: 'https://example.com',
        },
      ];
      render(<ProjectsShowcase projects={externalProjects} />);
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  describe('list layout (default)', () => {
    it('renders numbered project rows', () => {
      render(<ProjectsShowcase projects={mockProjects} layout="list" />);
      expect(screen.getByText('/01')).toBeInTheDocument();
      expect(screen.getByText('/02')).toBeInTheDocument();
      expect(screen.getByText('/03')).toBeInTheDocument();
    });

    it('renders tagline for each project', () => {
      render(<ProjectsShowcase projects={mockProjects} layout="list" />);
      const taglines = screen.getAllByText(/Mobile · iOS \/ Android/);
      expect(taglines.length).toBeGreaterThan(0);
    });
  });

  describe('alternating layout', () => {
    it('renders description text in alternating layout', () => {
      render(<ProjectsShowcase projects={mockProjects} layout="alternating" />);
      expect(screen.getByText('A mystical app with AI-powered daily fortunes.')).toBeInTheDocument();
    });
  });

  describe('load more', () => {
    it('shows only displayCount projects initially', () => {
      render(<ProjectsShowcase projects={mockProjects} displayCount={2} />);
      expect(screen.getByTestId('project-card-project-one')).toBeInTheDocument();
      expect(screen.getByTestId('project-card-project-two')).toBeInTheDocument();
      expect(screen.queryByTestId('project-card-project-three')).not.toBeInTheDocument();
    });

    it('shows a "Load more" button when showLoadMore=true and there are hidden projects', () => {
      render(
        <ProjectsShowcase projects={mockProjects} displayCount={2} showLoadMore loadMoreLabel="Load more projects" />
      );
      expect(screen.getByRole('button', { name: 'Load more projects' })).toBeInTheDocument();
    });

    it('does not show "Load more" when all projects are visible', () => {
      render(
        <ProjectsShowcase projects={mockProjects} displayCount={10} showLoadMore loadMoreLabel="Load more projects" />
      );
      expect(screen.queryByRole('button', { name: 'Load more projects' })).not.toBeInTheDocument();
    });

    it('reveals more projects when "Load more" is clicked', async () => {
      render(
        <ProjectsShowcase projects={mockProjects} displayCount={2} showLoadMore loadMoreLabel="Load more projects" />
      );
      expect(screen.queryByTestId('project-card-project-three')).not.toBeInTheDocument();

      act(() => {
        screen.getByRole('button', { name: 'Load more projects' }).click();
      });

      expect(screen.getByTestId('project-card-project-three')).toBeInTheDocument();
    });
  });

  describe('animation', () => {
    it('starts project cards as invisible (opacity 0) before intersection timers fire', () => {
      // Default mock fires the callback synchronously but the 0ms setTimeout hasn't been
      // advanced yet, so visible is still false → opacity 0.
      render(<ProjectsShowcase projects={mockProjects} />);
      expect(screen.getByTestId('project-card-project-one')).toHaveStyle({ opacity: '0' });
    });

    it('reveals project cards after IntersectionObserver fires with stagger delay', () => {
      render(<ProjectsShowcase projects={[mockProjects[0]!, mockProjects[1]!]} staggerDelay={150} />);

      const first = screen.getByTestId('project-card-project-one');
      const second = screen.getByTestId('project-card-project-two');

      // First card: delay=0*150=0ms — advance by 1ms to safely fire the 0ms timer
      act(() => {
        vi.advanceTimersByTime(1);
      });
      expect(first).toHaveStyle({ opacity: '1' });

      // Second card: delay=1*150=150ms
      act(() => {
        vi.advanceTimersByTime(150);
      });
      expect(second).toHaveStyle({ opacity: '1' });
    });

    it('renders all cards visible immediately when prefers-reduced-motion is set', () => {
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

      render(<ProjectsShowcase projects={mockProjects} />);
      for (const project of mockProjects) {
        expect(screen.getByTestId(`project-card-${project.id}`)).toHaveStyle({ opacity: '1' });
      }
    });
  });

  describe('accessibility', () => {
    it('renders images with descriptive alt text (alternating layout)', () => {
      render(<ProjectsShowcase projects={mockProjects} layout="alternating" />);
      const img = screen.getByAltText('Project One preview');
      expect(img).toBeInTheDocument();
    });

    it('renders a labelled list of projects', () => {
      render(<ProjectsShowcase projects={mockProjects} title="Our Projects" />);
      expect(screen.getByRole('list', { name: 'Our Projects' })).toBeInTheDocument();
    });

    it('applies keyboard-accessible focus styles on the project link (list layout)', () => {
      render(<ProjectsShowcase projects={mockProjects} layout="list" />);
      // The focus ring is on the <Link> inside the <li>, not the <li> itself
      const links = screen.getAllByRole('link');
      expect(links[0]!.className).toContain('focus-visible:ring');
    });
  });
});
