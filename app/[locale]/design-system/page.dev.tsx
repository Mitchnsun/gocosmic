import type { Metadata } from 'next';

import { DesignSystemShowcase } from '@/components/DesignSystemShowcase';
import { SectionHeading } from '@/components/SectionHeading';
import { cn } from '@/design-system/lib/utils';
import { CONTAINER, SECTION_Y } from '@/design-system/pill';
import { getAlternates } from '@/i18n/canonical';

/** Internal page (`.dev.tsx`, served by `yarn dev` only), in English like the rest of the docs. */
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;

  return {
    title: 'Design system · Cosmic Studio',
    description: 'Internal reference: tokens, typography, components and rules in the dark and the light theme.',
    alternates: getAlternates(locale, '/design-system'),
    // Belt and braces: kept out of search engines and out of the sitemap too.
    robots: { index: false, follow: false },
  };
}

export default function DesignSystemPage() {
  return (
    <div className={cn('bg-bg text-fg', SECTION_Y)}>
      <div className={cn(CONTAINER, 'flex flex-col gap-12')}>
        <SectionHeading
          level={1}
          eyebrow="[ Design system · Cosmic Studio v1 ]"
          title={
            <>
              Rules for the pages <em>without a mockup.</em>
            </>
          }
          titleId="design-system-title"
          lead="Same tokens as globals.css, the cosmic dose one notch down, concrete words, the work before the technique. Each section shows the dark face, the light face, or both."
        />
        <DesignSystemShowcase />
      </div>
    </div>
  );
}
