import type { ReactNode } from 'react';

export interface TimelineStep {
  id: string;
  label: string;
  title: string;
  description?: string;
  features?: string[];
  color?: 'aerospace' | 'royal' | 'jungle' | 'default';
}

export interface ProcessTimelineProps {
  title?: ReactNode;
  subtitle?: string;
  eyebrow?: string;
  steps: TimelineStep[];

  // Layout
  layout?: 'vertical' | 'horizontal' | 'compact';

  // Animation
  staggerDelay?: number;
  pathDuration?: number;
  respectReducedMotion?: boolean;

  // Behavior
  showDescription?: boolean;

  // Styling
  className?: string;
  id?: string;
}
