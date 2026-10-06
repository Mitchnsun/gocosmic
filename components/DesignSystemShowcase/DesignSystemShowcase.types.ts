import type { ThemeFace } from '@/design-system/tokens';

/** What the toolbar shows: one theme, or both side by side. */
export type ShowcaseMode = ThemeFace | 'both';

/** Anchor of a showcase section, used by the table of contents. */
export type SectionId = 'colors' | 'typography' | 'components' | 'layout' | 'voice' | 'illustrations' | 'exceptions';

export interface ShowcaseSection {
  id: SectionId;
  title: string;
  lead: string;
}

/** A layout or voice rule card: a title and its bullet points. */
export interface RuleCard {
  title: string;
  items: readonly string[];
}
