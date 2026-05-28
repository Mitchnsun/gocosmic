import type { ReactNode } from 'react';

export interface TimelineStep {
  id: string;
  label: string;
  title: string;
  description?: string;
  features?: string[];
  color?: 'aerospace' | 'royal' | 'jungle' | 'default';
  accent?: boolean;
}

export interface ProcessTimelineProps {
  title?: ReactNode;
  subtitle?: string;
  eyebrow?: string;
  steps: TimelineStep[];

  // Layout
  layout?: 'vertical' | 'horizontal' | 'compact';
  direction?: 'top-to-bottom' | 'bottom-to-top' | 'left-to-right';

  // Animation
  staggerDelay?: number;
  animationDuration?: number;
  pathDuration?: number;
  respectReducedMotion?: boolean;

  // Behavior
  stickyLabels?: boolean;
  showDescription?: boolean;

  // Styling
  className?: string;
  id?: string;
}
