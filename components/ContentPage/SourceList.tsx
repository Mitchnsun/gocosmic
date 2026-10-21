import { useLocale, useTranslations } from 'next-intl';

import { formatReleaseDate } from '@/components/CaseStudy/CaseStudy.utils';

const HEADING_ID = 'content-page-sources';

interface SourceListProps {
  /** Day the sources were read, `YYYY-MM-DD`. */
  consulted: string;
  /** Each source, with its label already localized. */
  sources: { label: string; href: string }[];
}

/** The pages a content page quotes its facts from, and the day they were read. */
export function SourceList({ consulted, sources }: SourceListProps) {
  const locale = useLocale();
  const t = useTranslations('contentPages.sources');

  return (
    <section aria-labelledby={HEADING_ID} className="text-fg-2 flex flex-col gap-3 text-sm">
      <h2 id={HEADING_ID} className="text-fg-3 text-2xs font-mono font-normal tracking-[0.24em] uppercase">
        {t('title')}
      </h2>
      <ul className="flex flex-col gap-2">
        {sources.map(({ label, href }) => (
          <li key={href}>
            <a
              href={href}
              rel="noopener noreferrer"
              className="hover:text-fg focus-visible:ring-fg rounded underline underline-offset-4 transition-colors focus-visible:ring-2 focus-visible:outline-none">
              {label}
            </a>
          </li>
        ))}
      </ul>
      <p className="text-fg-3">{t('consulted', { date: formatReleaseDate(consulted, locale) })}</p>
    </section>
  );
}
