import {
  COLOR_PALETTE_KEYS,
  freeMockupSchema,
  type FreeMockupValues,
  getFieldErrors,
  hasFieldErrors,
  normalizeFreeMockupValues,
  readFreeMockupField,
  readFreeMockupValues,
  WISHES_MAX_LENGTH,
} from '@/lib/validation/free-mockup.schema';

const validPayload = {
  email: 'prospect@example.com',
  colorPalette: 'starryNight' as const,
  websiteUrl: 'https://example.com',
  wishes: 'A calm, readable home page.',
  honeypot: '',
};

const values = (overrides: Partial<FreeMockupValues> = {}): FreeMockupValues => ({
  email: 'prospect@example.com',
  colorPalette: 'sober',
  websiteUrl: '',
  wishes: '',
  ...overrides,
});

describe('freeMockupSchema', () => {
  it('accepts a complete payload', () => {
    expect(freeMockupSchema.safeParse(validPayload).success).toBe(true);
  });

  it('accepts a payload without the optional fields', () => {
    const result = freeMockupSchema.safeParse({ ...validPayload, websiteUrl: '', wishes: undefined });
    expect(result.success).toBe(true);
  });

  it('rejects an invalid email', () => {
    expect(freeMockupSchema.safeParse({ ...validPayload, email: 'not-an-email' }).success).toBe(false);
  });

  it('rejects a palette outside the closed list', () => {
    expect(freeMockupSchema.safeParse({ ...validPayload, colorPalette: 'neon' }).success).toBe(false);
  });

  it('rejects an invalid website URL', () => {
    expect(freeMockupSchema.safeParse({ ...validPayload, websiteUrl: 'example' }).success).toBe(false);
  });

  it('rejects wishes longer than the cap', () => {
    const tooLong = 'a'.repeat(WISHES_MAX_LENGTH + 1);
    expect(freeMockupSchema.safeParse({ ...validPayload, wishes: tooLong }).success).toBe(false);
  });

  it('accepts wishes exactly at the cap', () => {
    const atCap = 'a'.repeat(WISHES_MAX_LENGTH);
    expect(freeMockupSchema.safeParse({ ...validPayload, wishes: atCap }).success).toBe(true);
  });

  it('rejects a filled honeypot', () => {
    expect(freeMockupSchema.safeParse({ ...validPayload, honeypot: 'ACME Corp' }).success).toBe(false);
  });

  it('exposes the six palette keys', () => {
    expect(COLOR_PALETTE_KEYS).toHaveLength(6);
  });
});

describe('normalizeFreeMockupValues', () => {
  it('trims the email and the website URL but keeps the wishes as typed', () => {
    expect(
      normalizeFreeMockupValues(values({ email: '  a@b.co ', websiteUrl: ' https://x.dev ', wishes: ' hi ' }))
    ).toEqual({
      email: 'a@b.co',
      colorPalette: 'sober',
      websiteUrl: 'https://x.dev',
      wishes: ' hi ',
    });
  });
});

describe('getFieldErrors', () => {
  it('returns no error for a valid set of values', () => {
    expect(getFieldErrors(values())).toEqual({});
  });

  it('flags a missing email as required', () => {
    expect(getFieldErrors(values({ email: '   ' })).email).toBe('required');
  });

  it('flags a malformed email', () => {
    expect(getFieldErrors(values({ email: 'nope' })).email).toBe('email_invalid');
  });

  it('flags a missing palette', () => {
    expect(getFieldErrors(values({ colorPalette: '' })).colorPalette).toBe('required');
  });

  it('flags a palette outside the closed list', () => {
    expect(getFieldErrors(values({ colorPalette: 'neon' })).colorPalette).toBe('required');
  });

  it('ignores an empty website URL', () => {
    expect(getFieldErrors(values({ websiteUrl: '  ' })).websiteUrl).toBeUndefined();
  });

  it('flags a malformed website URL', () => {
    expect(getFieldErrors(values({ websiteUrl: 'example' })).websiteUrl).toBe('url_invalid');
  });

  it('flags wishes above the cap', () => {
    expect(getFieldErrors(values({ wishes: 'a'.repeat(WISHES_MAX_LENGTH + 1) })).wishes).toBe('wishes_too_long');
  });
});

describe('hasFieldErrors', () => {
  it('is false on an empty error set', () => {
    expect(hasFieldErrors({})).toBe(false);
  });

  it('is true as soon as one field fails', () => {
    expect(hasFieldErrors({ email: 'required' })).toBe(true);
  });
});

describe('readFreeMockupValues', () => {
  it('reads the four visible fields', () => {
    const formData = new FormData();
    formData.set('email', 'a@b.co');
    formData.set('colorPalette', 'deepForest');
    formData.set('websiteUrl', 'https://b.co');
    formData.set('wishes', 'Something calm');

    expect(readFreeMockupValues(formData)).toEqual({
      email: 'a@b.co',
      colorPalette: 'deepForest',
      websiteUrl: 'https://b.co',
      wishes: 'Something calm',
    });
  });

  it('falls back to empty strings for missing or non-text entries', () => {
    const formData = new FormData();
    formData.set('email', new File([''], 'payload.txt'));

    expect(readFreeMockupValues(formData)).toEqual({
      email: '',
      colorPalette: '',
      websiteUrl: '',
      wishes: '',
    });
  });
});

describe('readFreeMockupField', () => {
  it('reads a single field by name', () => {
    const formData = new FormData();
    formData.set('locale', 'fr');

    expect(readFreeMockupField(formData, 'locale')).toBe('fr');
    expect(readFreeMockupField(formData, 'company')).toBe('');
  });
});
