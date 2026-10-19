import { Breadcrumb } from '@/components/Breadcrumb';
import CTAFinal from '@/components/CTAFinal';
import { SectionHeading } from '@/components/SectionHeading';
import { cn } from '@/design-system/lib/utils';
import { CONTAINER, PAGE_TOP } from '@/design-system/pill';

import type { ContentPageProps } from './ContentPage.types';
import { RelatedPages } from './RelatedPages';

const HEADING_ID = 'content-page-heading';
/** Space under the intro and under the sections, as on the local page. */
const BLOCK_END = 'pb-[clamp(3rem,6vw,4.5rem)]';

/**
 * Template of a service or guide page: breadcrumb, eyebrow, title and standfirst, the page's sections, two
 * related pages, then a closing call to action.
 */
export function ContentPage({ breadcrumb, eyebrow, title, lead, children, related, cta }: ContentPageProps) {
  return (
    <div className="bg-bg text-fg">
      <div className={cn(CONTAINER, PAGE_TOP, 'flex flex-col gap-4', BLOCK_END)}>
        {/* The links' 44 px touch targets would push the title down: pull the trail into the page's top space. */}
        <Breadcrumb items={breadcrumb} className="-mt-3" />
        <SectionHeading level={1} eyebrow={eyebrow} title={title} titleId={HEADING_ID} lead={lead} />
      </div>

      <div className={cn(CONTAINER, 'flex flex-col gap-10', BLOCK_END)}>{children}</div>

      <RelatedPages pages={related} />

      <CTAFinal
        id="content-page-cta"
        headline={cta.headline}
        description={cta.description}
        note={cta.note}
        ctaText={cta.button}
        ctaHref={cta.href}
        tone="sober"
      />
    </div>
  );
}
