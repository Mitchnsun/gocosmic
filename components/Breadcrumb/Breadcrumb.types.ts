import type { RouteKey } from '@/i18n/routing';

/** One step of a breadcrumb trail: a page and its label. */
export interface BreadcrumbItem {
  label: string;
  href: RouteKey;
}
