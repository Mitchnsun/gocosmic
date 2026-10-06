import { Chip } from '@/design-system/chip';
import { Eyebrow } from '@/design-system/eyebrow';
import { HairlineGrid } from '@/design-system/hairline-grid';
import { SignalDot } from '@/design-system/signal-dot';
import type { ThemeFace } from '@/design-system/tokens';

import { ButtonGallery } from './ButtonGallery';
import { CardGallery } from './CardGallery';
import { SAMPLE } from './DesignSystemShowcase.copy';
import { FormGallery } from './FormGallery';
import { ShowcaseGroup } from './ShowcaseGroup';

/** Every design-system primitive, as the pages use it. */
export function ComponentGallery({ theme }: { theme: ThemeFace }) {
  return (
    <>
      <ShowcaseGroup title="Buttons">
        <ButtonGallery />
      </ShowcaseGroup>
      <ShowcaseGroup title="Eyebrow, chips and signal dot">
        <Eyebrow>{SAMPLE.eyebrow}</Eyebrow>
        <div className="flex flex-wrap items-center gap-3">
          <Chip>{SAMPLE.chip}</Chip>
          <Chip variant="ok">{SAMPLE.chipOk}</Chip>
          <span className="text-fg-2 flex items-center gap-2.5 text-sm">
            <SignalDot />
            {SAMPLE.available}
          </span>
        </div>
      </ShowcaseGroup>
      <ShowcaseGroup title="Cards">
        <CardGallery />
      </ShowcaseGroup>
      <ShowcaseGroup title="Form fields">
        <FormGallery idPrefix={theme} />
      </ShowcaseGroup>
      <ShowcaseGroup title="Hairline grid">
        <HairlineGrid className="grid-cols-3">
          {[1, 2, 3].map((n) => (
            <li key={n} className="bg-bg-alt text-fg-2 p-5 text-sm">
              {SAMPLE.cell} {n}
            </li>
          ))}
        </HairlineGrid>
      </ShowcaseGroup>
    </>
  );
}
