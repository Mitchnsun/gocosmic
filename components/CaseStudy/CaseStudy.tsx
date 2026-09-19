import type { CaseStudyProps } from './CaseStudy.types';
import { CaseStudyCtaCard } from './CaseStudyCtaCard';
import { CaseStudyHero } from './CaseStudyHero';
import { CaseStudyNav } from './CaseStudyNav';
import { CaseStudySection } from './CaseStudySection';

const HEADING_ID = 'case-study-heading';

/**
 * Reusable project case study template: hero, ordered content sections,
 * closing call-to-action and previous / next navigation.
 *
 * Every string is passed in already localized, so the template works with any
 * translation namespace.
 *
 * @component
 */
export const CaseStudy = ({
  eyebrow,
  title,
  tagline,
  heroImage,
  logo,
  meta,
  sections,
  cta,
  contactCta,
  navigation,
  accent = 'aerospace',
  children,
}: CaseStudyProps) => {
  const total = String(sections.length).padStart(2, '0');

  return (
    <div className="bg-void text-ghost relative">
      <CaseStudyHero
        headingId={HEADING_ID}
        eyebrow={eyebrow}
        title={title}
        tagline={tagline}
        heroImage={heroImage}
        logo={logo}
        meta={meta}
        accent={accent}
      />

      <div className="m-auto flex max-w-7xl flex-col gap-10 p-4 sm:p-6 lg:p-8">
        {sections.map((section, position) => (
          <CaseStudySection
            key={section.id}
            section={section}
            index={`${String(position + 1).padStart(2, '0')} / ${total}`}
            accent={accent}
          />
        ))}
        {children}
        {cta && <CaseStudyCtaCard cta={cta} contactCta={contactCta} accent={accent} />}
        {navigation && <CaseStudyNav navigation={navigation} />}
      </div>
    </div>
  );
};
