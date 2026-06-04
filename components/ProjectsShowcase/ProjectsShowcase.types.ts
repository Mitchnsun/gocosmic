import type { ReactNode } from 'react';

export interface ProjectImage {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface Project {
  id: string;
  title: string;
  tagline?: string;
  description: string;
  image: ProjectImage;
  tags?: string[];
  /** Year the project was delivered. */
  year?: string | number;
  /** URL of the case study or project page. */
  href: string;
  /** Highlight this project (accent colour on title). */
  featured?: boolean;
}

export interface ProjectsShowcaseProps {
  /** Section label rendered as a mono eyebrow. */
  eyebrow?: string;
  /** Section heading — supports rich text (ReactNode) for inline formatting such as &lt;em&gt;. */
  title?: ReactNode;
  /** Supporting description below the heading. */
  subtitle?: string;
  /** Array of projects to display. */
  projects: Project[];

  // Layout
  /** Visual layout variant. Default: 'list'. */
  layout?: 'alternating' | 'grid' | 'list';
  /** Force a fixed image position (alternating layout only). */
  imagePosition?: 'left' | 'right' | 'top';

  // Animation
  /** Milliseconds between successive reveals. Default: 150. */
  staggerDelay?: number;
  /** Duration of each reveal animation in ms. Default: 700. */
  animationDuration?: number;
  /** Honour prefers-reduced-motion. Default: true. */
  respectReducedMotion?: boolean;

  // Pagination
  /** How many projects to display initially (default: all). */
  displayCount?: number;
  /** Show a "Load more" button when there are hidden projects. */
  showLoadMore?: boolean;
  /** Label for the load-more button. */
  loadMoreLabel?: string;

  // Styling
  className?: string;
  id?: string;
}
