import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import { DesignSystemShowcase, type ShowcaseLabels } from '@/components/DesignSystemShowcase';
import { SectionHeading } from '@/components/SectionHeading';
import { cn } from '@/design-system/lib/utils';
import { CONTAINER, SECTION_Y } from '@/design-system/pill';
import { getAlternates } from '@/i18n/canonical';

/** Internal page, served only by `yarn dev`: a production build answers 404. */
function assertDevOnly() {
  if (process.env.NODE_ENV === 'production') notFound();
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  assertDevOnly();
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'design-system' });

  return {
    title: t('meta.title'),
    description: t('meta.description'),
    alternates: getAlternates(locale, '/design-system'),
    // Belt and braces: kept out of search engines and out of the sitemap too.
    robots: { index: false, follow: false },
  };
}

export default async function DesignSystemPage() {
  assertDevOnly();
  const t = await getTranslations('design-system');
  const labels: ShowcaseLabels = {
    tokens: t('tokens'),
    buttons: t('buttons'),
    tags: t('tags'),
    fields: t('fields'),
    grid: t('grid'),
    sample: t.raw('sample') as ShowcaseLabels['sample'],
  };

  return (
    <div className={cn('bg-bg text-fg', SECTION_Y)}>
      <div className={cn(CONTAINER, 'flex flex-col gap-10')}>
        <SectionHeading
          level={1}
          eyebrow={t('eyebrow')}
          title={t.rich('title', { em: (chunks) => <em>{chunks}</em> })}
          titleId="design-system-title"
          lead={t('intro')}
        />
        <div className="grid gap-6 xl:grid-cols-2">
          <DesignSystemShowcase theme="dark" title={t('dark')} labels={labels} />
          <DesignSystemShowcase theme="light" title={t('light')} labels={labels} />
        </div>
      </div>
    </div>
  );
}
