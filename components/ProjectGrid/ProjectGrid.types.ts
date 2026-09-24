import type { CaseStudySlug } from '@/components/CaseStudy';
import type { LocalizedHref } from '@/components/CaseStudy/CaseStudy.types';

/** What was built — drives the filter pills and the badge on each card. */
export type ProjectKind = 'site' | 'webapp' | 'mobile';

/** Visual of a card, 16/10: a logo or an icon laid on a solid background. */
export interface ProjectCover {
  src: string;
  width: number;
  height: number;
  /** `logo` sits small in the frame; `icon` gets rounded corners like on a phone. */
  fit: 'logo' | 'icon';
  /** CSS background behind the visual. */
  background: string;
}

/** Non-translatable facts about a project; the copy lives in `projectsList.items.<i18nKey>`. */
export interface ProjectDefinition {
  slug: CaseStudySlug;
  kind: ProjectKind;
  year: number;
  /** Omitted until a screenshot is provided: the card then shows a typographic cover. */
  cover?: ProjectCover;
}

/** Everything a card renders, already translated. */
export interface ProjectCardContent {
  slug: CaseStudySlug;
  href: LocalizedHref;
  kind: ProjectKind;
  kindLabel: string;
  title: string;
  year: number;
  client: string;
  description: string;
  tags: string[];
  cover?: ProjectCover & { alt: string };
  linkLabel: string;
}
