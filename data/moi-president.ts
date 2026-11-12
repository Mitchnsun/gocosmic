/**
 * Moi Président, the studio's mobile game (Mitchnsun/moi-president): the data its pages read beside their
 * messages (gocosmic#176), and the files for AI agents too. The game's data is frozen in each version of the app,
 * so the notice of its simulation keeps one entry per version published in the stores, the latest first.
 */

/**
 * A poll the simulation starts from, with the mentions art. 2 of law no. 77-808 asks of a vote simulation made
 * from polls: each one copied from the poll's own notice at the Commission des sondages, never guessed.
 */
export interface SourcePoll {
  institute: string;
  /** Sponsors and buyers, as the poll's notice names them. */
  sponsors: readonly string[];
  /** Fieldwork dates, ISO (`2026-10-14`). */
  fieldwork: { from: string; to: string };
  /** Number of people interrogated, as the notice gives it (`1 553 inscrits, sur 1 701 personnes`). */
  sample: string;
  /** Full text of the question, in French, word for word from the notice. */
  question: string;
  /** The margins of error, as the notice gives them. */
  marginOfError: string;
  /** The poll's notice at the Commission des sondages. */
  noticeUrl: string;
}

/** A version of the app published in the stores, whose data is frozen. */
export interface AppRelease {
  /** Its number, `1.0.0`. */
  version: string;
  /** Day of its first publication in the stores, ISO. */
  publishedOn: string;
  /** The polls its data starts from. */
  polls: readonly SourcePoll[];
  /**
   * The notice of the simulation filed with the Commission des sondages for this version (art. 3), once filed:
   * until then the pages say nothing about consulting it.
   */
  noticeUrl?: string;
}

/**
 * The published versions, the latest first. None before the first store release (owner, 11/11/2026): the polls
 * of a version are listed with it, once their list has been checked against the engine's data.
 */
export const MOI_PRESIDENT_RELEASES: readonly AppRelease[] = [];

/** A correction (« mise au point ») ordered by the Commission des sondages (art. 9), published the same day. */
export interface Correction {
  /** Day of publication, ISO. */
  date: string;
  /** Its text in French and English; the pages in the other languages show the English one. */
  text: { fr: string; en: string };
}

/** The correction on show at the top of the presentation page and of the legal notice, if the Commission orders one. */
export const MOI_PRESIDENT_CORRECTION: Correction | null = null;

/** The sites the legal pages link to, as the app's legal notice does (`LEGAL_LINKS` in the app's `utils/legal.ts`). */
export const MOI_PRESIDENT_LINKS = {
  commission: 'https://www.commission-des-sondages.fr',
  cnil: 'https://www.cnil.fr',
  pfpdt: 'https://www.edoeb.admin.ch',
  email: 'mailto:support@gocosmic.dev',
} as const;

export type MoiPresidentLinkId = keyof typeof MOI_PRESIDENT_LINKS;

/** The notice of the latest published version, once filed with the Commission des sondages. */
export function getFiledNoticeUrl(releases: readonly AppRelease[] = MOI_PRESIDENT_RELEASES): string | undefined {
  return releases[0]?.noticeUrl;
}
