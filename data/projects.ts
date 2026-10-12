import type { LocalizedHref } from '@/components/CaseStudy/CaseStudy.types';
import type { ProjectCover, ProjectKind } from '@/components/ProjectGrid/ProjectGrid.types';
import type { AccentToken } from '@/design-system/accent';

/** Every non-translatable fact about a case study; the copy lives in `messages/<locale>/*.json`. */
interface Project {
  slug: string;
  /** Translation key inside the `projectsList.items` namespace. */
  i18nKey: string;
  /** Localized route, as declared in `i18n/routing.ts`. */
  href: LocalizedHref;
  kind: ProjectKind;
  /** Year the project was first released. */
  year: number;
  /** Latest version shipped, for projects that keep being updated (date as `YYYY-MM-DD`). */
  latestRelease?: { version: string; date: string };
  /** Accent colour for the case study page and its badge. */
  accent: AccentToken;
  /** Omitted until a screenshot is provided: the card then shows a typographic cover. */
  cover?: ProjectCover;
}

/** Registered case studies, in display and navigation order. */
export const PROJECTS = [
  {
    slug: 'choeurdespaysdumontblanc',
    i18nKey: 'choeurDesPaysduMontBlanc',
    href: '/projects/choeurdespaysdumontblanc',
    kind: 'site',
    year: 2026,
    accent: 'royal',
    cover: {
      src: '/projects/choeurdespaysdumontblanc/CPMB-logo-blanc.png',
      width: 160,
      height: 55,
      fit: 'logo',
      background: '#1E2952',
    },
  },
  {
    slug: 'daily-fortune',
    i18nKey: 'dailyFortune',
    href: '/projects/daily-fortune',
    kind: 'mobile',
    year: 2025,
    latestRelease: { version: '1.4.0', date: '2026-02-28' },
    accent: 'royal',
    cover: {
      src: '/projects/daily-fortune/app-icon.png',
      width: 1024,
      height: 1024,
      fit: 'icon',
      background: '#0d0420',
    },
  },
  {
    slug: 'mcomperat',
    i18nKey: 'mcomperat',
    href: '/projects/mcomperat',
    kind: 'site',
    year: 2026,
    accent: 'aerospace',
    cover: undefined,
  },
  {
    slug: 'psc-supersprint',
    i18nKey: 'pscSupersprint',
    href: '/projects/psc-supersprint',
    kind: 'webapp',
    year: 2026,
    accent: 'jungle',
    cover: undefined,
  },
] as const satisfies readonly Project[];
