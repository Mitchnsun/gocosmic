import { z } from 'zod';

/**
 * Colour palettes a prospect can pick from. The list is closed: it drives the
 * radio group, the swatch previews and the server-side validation, so the keys
 * must stay in sync with `palette.options.*` in the `free-mockup` namespace.
 */
export const COLOR_PALETTE_KEYS = [
  'sober',
  'lakeMountains',
  'alpineSunset',
  'deepForest',
  'starryNight',
  'terracottaStone',
] as const;

export type ColorPaletteKey = (typeof COLOR_PALETTE_KEYS)[number];

/** Maximum length of the free-text "wishes" field, mirrored by the live counter. */
export const WISHES_MAX_LENGTH = 500;

/**
 * Shape of a free mockup request, validated on the server (mandatory) and on
 * the client (to surface inline errors before a round trip).
 *
 * `honeypot` must stay empty: it is filled in only by bots.
 */
export const freeMockupSchema = z.object({
  email: z.email(),
  colorPalette: z.enum(COLOR_PALETTE_KEYS),
  websiteUrl: z.url().optional().or(z.literal('')),
  wishes: z.string().max(WISHES_MAX_LENGTH).optional(),
  honeypot: z.string().max(0),
});

export type FreeMockupRequest = z.infer<typeof freeMockupSchema>;

/** Form fields a visitor can get an inline error on (the honeypot is never shown). */
export type FreeMockupFieldName = 'email' | 'colorPalette' | 'websiteUrl' | 'wishes';

/** Error identifiers, mapped to `validation.*` translation keys by the form. */
export type FreeMockupErrorCode = 'required' | 'email_invalid' | 'url_invalid' | 'wishes_too_long';

export type FreeMockupFieldErrors = Partial<Record<FreeMockupFieldName, FreeMockupErrorCode>>;

/** Raw string values of the four visible fields, as typed by the visitor. */
export type FreeMockupValues = Record<FreeMockupFieldName, string>;

/** Trims the values that must not carry stray whitespace before validation. */
export function normalizeFreeMockupValues(values: FreeMockupValues): FreeMockupValues {
  return {
    email: values.email.trim(),
    colorPalette: values.colorPalette,
    websiteUrl: values.websiteUrl.trim(),
    wishes: values.wishes,
  };
}

/**
 * Resolves one error code per invalid field, shared by the client (inline
 * messages while typing) and the server (errors returned by the action).
 *
 * `freeMockupSchema` stays the authoritative gate on the server; this helper
 * only decides *which* message a visitor sees.
 */
export function getFieldErrors(values: FreeMockupValues): FreeMockupFieldErrors {
  const { email, colorPalette, websiteUrl, wishes } = normalizeFreeMockupValues(values);
  const errors: FreeMockupFieldErrors = {};

  if (!email) {
    errors.email = 'required';
  } else if (!freeMockupSchema.shape.email.safeParse(email).success) {
    errors.email = 'email_invalid';
  }

  if (!freeMockupSchema.shape.colorPalette.safeParse(colorPalette).success) {
    errors.colorPalette = 'required';
  }

  if (websiteUrl && !freeMockupSchema.shape.websiteUrl.safeParse(websiteUrl).success) {
    errors.websiteUrl = 'url_invalid';
  }

  if (wishes.length > WISHES_MAX_LENGTH) {
    errors.wishes = 'wishes_too_long';
  }

  return errors;
}

const readField = (formData: FormData, name: string): string => {
  const value = formData.get(name);
  return typeof value === 'string' ? value : '';
};

/** Reads the four visible fields out of a submitted payload, defaulting to empty strings. */
export function readFreeMockupValues(formData: FormData): FreeMockupValues {
  return {
    email: readField(formData, 'email'),
    colorPalette: readField(formData, 'colorPalette'),
    websiteUrl: readField(formData, 'websiteUrl'),
    wishes: readField(formData, 'wishes'),
  };
}

/** Reads a single field by name, used for the honeypot and the locale hint. */
export function readFreeMockupField(formData: FormData, name: string): string {
  return readField(formData, name);
}

/** True when at least one field carries an error. */
export function hasFieldErrors(errors: FreeMockupFieldErrors): boolean {
  return Object.keys(errors).length > 0;
}
