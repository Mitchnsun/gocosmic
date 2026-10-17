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
  /** Latest version shipped, its number when known, for projects that keep being updated (date as `YYYY-MM-DD`, or `YYYY-MM` when only the month is known). */
  latestRelease?: { version?: string; date: string };
  /** Accent colour for the case study page and its badge. */
  accent: AccentToken;
  /** Omitted until a screenshot is provided: the card then shows a typographic cover. */
  cover?: ProjectCover;
  /** Project colour (hex), framing the logo on the case study page. */
  color?: string;
  /** Photo or drawing of the project, 16/10, shown on the projects list card with the logo, if any, in its corner. */
  illustration?: string;
}

/** Registered case studies, in display and navigation order. */
export const PROJECTS = [
  {
    slug: 'coachnpulse',
    i18nKey: 'coachNPulse',
    href: '/projects/coachnpulse',
    kind: 'site',
    year: 2016,
    latestRelease: { version: '5.0.0', date: '2026-10' },
    accent: 'jungle',
    cover: {
      src: '/projects/coachnpulse/coachnpulse-logo.png',
      width: 320,
      height: 306,
      fit: 'logo',
      background: '#000000',
    },
    color: '#4cb8e8',
    illustration: '/projects/coachnpulse/coachnpulse-illustration.jpg',
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
    slug: 'psc-supersprint',
    i18nKey: 'pscSupersprint',
    href: '/projects/psc-supersprint',
    kind: 'webapp',
    year: 2020,
    latestRelease: { date: '2026-04' },
    accent: 'aerospace',
    cover: {
      src: '/projects/psc-supersprint/psc-supersprint-logo.png',
      width: 242,
      height: 238,
      fit: 'logo',
      background: '#fb2c36',
    },
    illustration: '/projects/psc-supersprint/psc-supersprint-illustration.png',
  },
  {
    slug: 'mcomperat',
    i18nKey: 'mcomperat',
    href: '/projects/mcomperat',
    kind: 'site',
    year: 2014,
    latestRelease: { version: '7.0', date: '2026-05' },
    accent: 'royal',
    cover: undefined,
    illustration: '/projects/mcomperat/mcomperat-illustration.jpg',
  },
  {
    slug: 'choeurdespaysdumontblanc',
    i18nKey: 'choeurDesPaysduMontBlanc',
    href: '/projects/choeurdespaysdumontblanc',
    kind: 'site',
    year: 2026,
    accent: 'jungle',
    cover: {
      src: '/projects/choeurdespaysdumontblanc/CPMB-logo-blanc.png',
      width: 160,
      height: 55,
      fit: 'logo',
      background: '#1E2952',
    },
  },
] as const satisfies readonly Project[];
