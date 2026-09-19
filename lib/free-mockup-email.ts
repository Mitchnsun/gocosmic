import type { DecodedPlan } from '@/lib/pricing/plan-code';
import { buildPlanEmailRows } from '@/lib/pricing/plan-email';
import { type ColorPaletteKey } from '@/lib/validation/free-mockup.schema';

/**
 * Human-readable palette names used in the notification email. They are kept in
 * one fixed language on purpose: the email is read by the studio, not by the
 * visitor, and a server-side map cannot be spoofed by a crafted form payload.
 */
const PALETTE_LABELS: Record<ColorPaletteKey, string> = {
  sober: 'Sober & minimalist',
  lakeMountains: 'Lake & mountains',
  alpineSunset: 'Alpine sunset',
  deepForest: 'Deep forest',
  starryNight: 'Starry night',
  terracottaStone: 'Terracotta & stone',
};

/** Placeholder shown when an optional field was left empty. */
const EMPTY_VALUE = '—';

/** Fields of a free mockup request, as they reach the email builder. */
export interface FreeMockupEmailInput {
  email: string;
  colorPalette: ColorPaletteKey;
  websiteUrl?: string;
  wishes?: string;
  /** Locale of the page the request was sent from, e.g. `fr`. */
  locale: string;
  /** Pricing simulation the visitor came from, when there was one. */
  plan?: DecodedPlan;
}

/** Rendered email, ready to hand over to the mail provider. */
export interface FreeMockupEmail {
  subject: string;
  text: string;
  html: string;
}

/** Escapes the characters that would break out of an HTML text node or attribute. */
export function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

/**
 * Builds the plain-text and HTML notification sent to the studio when a visitor
 * asks for a free mockup. Every value comes from the visitor, so it is escaped
 * before being interpolated into the HTML body.
 */
export function buildFreeMockupEmail({
  email,
  colorPalette,
  websiteUrl,
  wishes,
  locale,
  plan,
}: FreeMockupEmailInput): FreeMockupEmail {
  // eslint-disable-next-line security/detect-object-injection
  const paletteLabel = PALETTE_LABELS[colorPalette];
  const website = websiteUrl?.trim() || EMPTY_VALUE;
  const wishesText = wishes?.trim() || EMPTY_VALUE;

  const rows: Array<[string, string]> = [
    ['Email', email],
    ['Colour palette', `${paletteLabel} (${colorPalette})`],
    ['Current website', website],
    ['Wishes', wishesText],
    ...(plan ? buildPlanEmailRows(plan) : []),
    ['Locale', locale],
  ];

  const subject = `Demande de maquette gratuite — ${email}`;

  const text = rows.map(([label, value]) => `${label}: ${value}`).join('\n');

  const html = [
    '<h1 style="font-family:sans-serif;font-size:18px;">Demande de maquette gratuite</h1>',
    '<table style="font-family:sans-serif;font-size:14px;border-collapse:collapse;">',
    ...rows.map(
      ([label, value]) =>
        `<tr><th align="left" style="padding:4px 12px 4px 0;vertical-align:top;">${escapeHtml(label)}</th>` +
        `<td style="padding:4px 0;white-space:pre-wrap;">${escapeHtml(value)}</td></tr>`
    ),
    '</table>',
  ].join('');

  return { subject, text, html };
}
