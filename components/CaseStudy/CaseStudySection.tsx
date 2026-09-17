import { AccentList } from '@/components/AccentList';
import { ContentSection } from '@/components/ContentSection';
import type { AccentToken } from '@/design-system/accent';

import type { CaseStudySectionData } from './CaseStudy.types';

interface CaseStudySectionProps {
  /** Section content. */
  section: CaseStudySectionData;
  /** Mono HUD counter, e.g. `02 / 04`. */
  index: string;
  /** Page-level accent, used when the section defines none. */
  accent: AccentToken;
}

/**
 * Renders one case study section: eyebrow, heading, lead paragraph, bullet
 * points and an optional closing paragraph.
 *
 * @component
 */
export const CaseStudySection = ({ section, index, accent }: CaseStudySectionProps) => {
  const sectionAccent = section.accent ?? accent;

  return (
    <ContentSection
      id={section.id}
      eyebrow={section.label}
      index={index}
      accent={sectionAccent}
      title={section.title}
      lead={section.content}>
      {section.points && section.points.length > 0 && (
        <AccentList
          accent={sectionAccent}
          label={section.pointsLabel}
          ariaLabel={section.title}
          items={section.points}
          columns={section.columns ?? 1}
        />
      )}
      {section.secondary && <p className="text-ghost/70 mt-6 text-base leading-7">{section.secondary}</p>}
    </ContentSection>
  );
};
