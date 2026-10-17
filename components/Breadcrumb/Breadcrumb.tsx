import { useLocale, useTranslations } from 'next-intl';

import { JsonLd } from '@/components/JsonLd/JsonLd';
import { toItemList } from '@/components/JsonLd/JsonLd.utils';
import { getCanonicalUrl } from '@/i18n/canonical';
import { Link } from '@/i18n/navigation';

import type { BreadcrumbItem } from './Breadcrumb.types';

interface BreadcrumbProps {
  /** The pages between the home page and the current one, then the current page. */
  items: BreadcrumbItem[];
  className?: string;
}

/**
 * Visible trail from the home page to the current page, in mono HUD labels, with the matching `BreadcrumbList`
 * for search engines, so the two cannot drift.
 */
export function Breadcrumb({ items, className }: BreadcrumbProps) {
  const locale = useLocale();
  const t = useTranslations('navigation');
  const trail: BreadcrumbItem[] = [{ label: t('home_menu'), href: '/' }, ...items];

  return (
    <>
      <nav aria-label={t('breadcrumb')} className={className}>
        <ol className="text-3xs text-fg-3 flex flex-wrap items-center gap-x-2 font-mono tracking-[0.18em] uppercase">
          {trail.map(({ label, href }, index) => {
            const isCurrent = index === trail.length - 1;
            return (
              <li key={href} className="flex min-h-11 items-center gap-2">
                {index > 0 && <span aria-hidden="true">›</span>}
                {isCurrent ? (
                  <span aria-current="page" className="text-fg-2">
                    {label}
                  </span>
                ) : (
                  <Link
                    href={href}
                    className="hover:text-fg focus-visible:ring-aerospace-ink inline-flex min-h-11 items-center rounded transition-colors focus-visible:ring-2 focus-visible:outline-none">
                    {label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <JsonLd
        scriptKey="breadcrumb-json-ld"
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: toItemList(
            trail.map(({ label, href }) => ({ name: label, item: getCanonicalUrl(locale, href) }))
          ),
        }}
      />
    </>
  );
}
