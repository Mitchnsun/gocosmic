'use client';

import { type ReactNode, useState } from 'react';

import type { ThemeFace } from '@/design-system/tokens';

import { ComponentGallery } from './ComponentGallery';
import { SECTIONS } from './DesignSystemShowcase.copy';
import type { SectionId, ShowcaseMode } from './DesignSystemShowcase.types';
import { Illustrations } from './Illustrations';
import { LayoutRules } from './LayoutRules';
import { ShowcaseToc } from './ShowcaseToc';
import { ShowcaseToolbar } from './ShowcaseToolbar';
import { ThemedSection } from './ThemedSection';
import { ThemeExceptions } from './ThemeExceptions';
import { TokenSwatches } from './TokenSwatches';
import { TypeSpecimens } from './TypeSpecimens';
import { VoiceRules } from './VoiceRules';

const CONTENT: Record<SectionId, (theme: ThemeFace) => ReactNode> = {
  colors: (theme) => <TokenSwatches theme={theme} />,
  typography: (theme) => <TypeSpecimens theme={theme} />,
  components: (theme) => <ComponentGallery theme={theme} />,
  layout: () => <LayoutRules />,
  voice: (theme) => <VoiceRules theme={theme} />,
  illustrations: (theme) => <Illustrations theme={theme} />,
  exceptions: () => <ThemeExceptions />,
};

/**
 * The internal design system reference (#111, #112): every section in a `data-theme` panel, the
 * dark face, the light face or both side by side, as picked in the sticky toolbar.
 */
export function DesignSystemShowcase() {
  const [mode, setMode] = useState<ShowcaseMode>('both');

  return (
    <div className="flex flex-col gap-10">
      <ShowcaseToolbar mode={mode} onChange={setMode} />
      <div className="grid gap-10 lg:grid-cols-[11rem_minmax(0,1fr)]">
        <ShowcaseToc />
        <div className="flex min-w-0 flex-col gap-20">
          {SECTIONS.map((section, index) => (
            <ThemedSection key={section.id} section={section} index={index} mode={mode}>
              {CONTENT[section.id]}
            </ThemedSection>
          ))}
        </div>
      </div>
    </div>
  );
}
