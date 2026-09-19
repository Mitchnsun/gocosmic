import type { ReactNode } from 'react';

import { AccentList } from '@/components/AccentList';
import { ContentSection } from '@/components/ContentSection';
import type { AccentToken } from '@/design-system/accent';
import { accentClasses } from '@/design-system/accent';
import { cn } from '@/design-system/lib/utils';

/** A labelled group of bullet points inside a service block. */
export interface ServiceDetailGroup {
  /** Mono label for the group. */
  label: string;
  /** Localized bullet points. */
  items: string[];
}

/** Props for a detailed service block. */
export interface ServiceDetailProps {
  /** Anchor id — matches the links used by the homepage services grid. */
  id: string;
  /** Optional uppercase mono eyebrow. */
  eyebrow?: string;
  /** Mono HUD counter, e.g. `01 / 04`. */
  index: string;
  /** Service name, rendered as the `h2`. */
  title: string;
  /** Short positioning line displayed above the description. */
  subtitle: string;
  /** Service description. */
  description: string;
  /** Icon rendered next to the subtitle. */
  icon?: ReactNode;
  /** Bullet-point groups (technologies, approach, outcomes…). */
  groups: ServiceDetailGroup[];
  /** Accent colour for the block. Defaults to `'aerospace'`. */
  accent?: AccentToken;
}

/**
 * Detailed presentation of a single service: heading, positioning line and up
 * to three groups of bullet points laid out as a responsive grid.
 *
 * @component
 */
export const ServiceDetail = ({
  id,
  eyebrow,
  index,
  title,
  subtitle,
  description,
  icon,
  groups,
  accent = 'aerospace',
}: ServiceDetailProps) => {
  const { text } = accentClasses(accent);

  return (
    <ContentSection id={id} eyebrow={eyebrow} index={index} accent={accent} title={title} lead={description}>
      <p className={cn('font-display -mt-4 mb-8 flex items-center gap-3 text-xl font-medium', text)}>
        {icon}
        {subtitle}
      </p>
      <div className={cn('grid gap-8 md:grid-cols-2', { 'lg:grid-cols-3': groups.length > 2 })}>
        {groups.map((group) => (
          <AccentList key={group.label} accent={accent} label={group.label} labelAs="h3" items={group.items} />
        ))}
      </div>
    </ContentSection>
  );
};
