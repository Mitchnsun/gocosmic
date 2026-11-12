/** A correction ordered by the Commission des sondages, localized (`buildCorrection`). */
export interface CorrectionProps {
  title: string;
  /** "Publiée le 12 avril 2027". */
  date: string;
  text: string;
  /** Language of the text when it differs from the page's: the English one on the Spanish, German and Italian pages. */
  lang?: string;
}

/** A link opening a site in a new tab. */
export interface ExternalLink {
  label: string;
  href: string;
}

/** One poll of a version's notice: its mentions as label / value rows, then its own notice. */
export interface SourcePollProps {
  rows: { label: string; value: string; lang?: string }[];
  notice: ExternalLink;
}

/** A published version in the notice of the simulation (`buildReleaseNotices`). */
export interface ReleaseNoticeProps {
  /** Anchor of the version, `version-1.0.0`. */
  id: string;
  /** "Version 1.0.0, publiée le 2 mars 2027". */
  heading: string;
  /** "Données figées dans la version 1.0.0 du jeu." */
  frozen: string;
  pollsLabel: string;
  polls: SourcePollProps[];
  /** The notice of this version filed with the Commission des sondages, once filed. */
  noticeLink?: ExternalLink;
}

/** The game's two legal pages, published in French and English (`ROUTE_FALLBACK_LANGUAGES`). */
export type MoiPresidentLegalRoute = '/apps/moi-president/privacy' | '/apps/moi-president/legal-notice';
