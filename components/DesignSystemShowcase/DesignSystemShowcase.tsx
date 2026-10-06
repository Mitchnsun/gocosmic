import { Chip } from '@/design-system/chip';
import { Eyebrow } from '@/design-system/eyebrow';
import { HairlineGrid } from '@/design-system/hairline-grid';

import { ButtonGallery } from './ButtonGallery';
import type { ShowcaseLabels } from './DesignSystemShowcase.types';
import { FormGallery } from './FormGallery';
import { ShowcaseGroup } from './ShowcaseGroup';
import { TokenSwatches } from './TokenSwatches';

interface DesignSystemShowcaseProps {
  /** `dark` or `light`: the panel is a `data-theme` island, whatever the page theme. */
  theme: 'dark' | 'light';
  /** Panel title, e.g. `Dark · space`. */
  title: string;
  labels: ShowcaseLabels;
}

/**
 * Every design-system primitive rendered inside a `data-theme` island, so the page can show the dark
 * and the light theme side by side (DoD of EPIC #113).
 */
export function DesignSystemShowcase({ theme, title, labels }: DesignSystemShowcaseProps) {
  const { sample } = labels;

  return (
    <section
      data-theme={theme}
      aria-label={title}
      className="bg-bg text-fg border-line-2 flex flex-col gap-10 rounded-3xl border p-[clamp(1.25rem,3vw,2rem)]">
      <p className="text-fg-3 text-2xs font-mono tracking-[0.22em] uppercase">{title}</p>
      <ShowcaseGroup title={labels.tokens}>
        <TokenSwatches />
      </ShowcaseGroup>
      <ShowcaseGroup title={labels.buttons}>
        <ButtonGallery sample={sample} />
      </ShowcaseGroup>
      <ShowcaseGroup title={labels.tags}>
        <Eyebrow>{sample.eyebrow}</Eyebrow>
        <div className="flex flex-wrap gap-2">
          <Chip>{sample.chip}</Chip>
          <Chip variant="ok">{sample.chip_ok}</Chip>
        </div>
      </ShowcaseGroup>
      <ShowcaseGroup title={labels.fields}>
        <FormGallery sample={sample} idPrefix={theme} />
      </ShowcaseGroup>
      <ShowcaseGroup title={labels.grid}>
        <HairlineGrid className="grid-cols-3">
          {[1, 2, 3].map((n) => (
            <li key={n} className="bg-bg-alt text-fg-2 p-5 text-sm">
              {sample.cell} {n}
            </li>
          ))}
        </HairlineGrid>
      </ShowcaseGroup>
    </section>
  );
}
