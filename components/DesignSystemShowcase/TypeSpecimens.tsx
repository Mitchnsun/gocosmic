import { SectionHeading } from '@/components/SectionHeading';
import { Eyebrow } from '@/design-system/eyebrow';
import type { ThemeFace } from '@/design-system/tokens';

import { SAMPLE, TYPE_SPECS } from './DesignSystemShowcase.copy';
import { TypeSpecimen } from './TypeSpecimen';

/** The five text styles of the site, rendered by the components that own them. */
export function TypeSpecimens({ theme }: { theme: ThemeFace }) {
  return (
    <ul className="bg-line border-line flex flex-col gap-px overflow-hidden rounded-2xl border">
      <TypeSpecimen label="H1" spec={TYPE_SPECS.h1} measure="h1">
        <SectionHeading
          level={1}
          eyebrow={SAMPLE.eyebrow}
          titleId={`${theme}-type-h1`}
          title={
            <>
              Rules for <em>every page.</em>
            </>
          }
        />
      </TypeSpecimen>
      <TypeSpecimen label="H2" spec={TYPE_SPECS.h2} measure="h2">
        <SectionHeading
          eyebrow={SAMPLE.eyebrow}
          titleId={`${theme}-type-h2`}
          title={
            <>
              Apps <em>that launch.</em>
            </>
          }
        />
      </TypeSpecimen>
      <TypeSpecimen label="H3" spec={TYPE_SPECS.h3} measure="h3">
        <h3 className="font-display text-fg text-xl font-semibold tracking-[-0.02em]">A website for your workshop</h3>
      </TypeSpecimen>
      <TypeSpecimen label="Body" spec={TYPE_SPECS.body} measure="p">
        <p className="text-fg-2 max-w-[56ch] text-base leading-relaxed sm:text-lg">
          A clear site, built to be found on Google, and one person who answers after launch.
        </p>
      </TypeSpecimen>
      <TypeSpecimen label="Eyebrow" spec={TYPE_SPECS.eyebrow} measure="p">
        <Eyebrow>{SAMPLE.eyebrow}</Eyebrow>
      </TypeSpecimen>
    </ul>
  );
}
