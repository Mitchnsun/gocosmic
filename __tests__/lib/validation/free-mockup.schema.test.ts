import {
  COLOR_PALETTE_KEYS,
  freeMockupSchema,
  type FreeMockupValues,
  getFieldErrors,
  hasFieldErrors,
  normalizeFreeMockupValues,
  normalizeWebsiteUrl,
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

  it('accepts a bare host once normalized', () => {
    expect(freeMockupSchema.safeParse({ ...validPayload, websiteUrl: 'https://mcomper.at' }).success).toBe(true);
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

describe('normalizeWebsiteUrl', () => {
  it('prefixes a bare host with https://', () => {
    expect(normalizeWebsiteUrl('mcomper.at')).toBe('https://mcomper.at');
  });

  it('prefixes a bare host that carries www and a path', () => {
    expect(normalizeWebsiteUrl('www.site.fr/page')).toBe('https://www.site.fr/page');
  });

  it('leaves an address that already has a scheme untouched', () => {
    expect(normalizeWebsiteUrl('https://x.dev')).toBe('https://x.dev');
    expect(normalizeWebsiteUrl('http://x.dev')).toBe('http://x.dev');
  });

  it('trims surrounding whitespace', () => {
    expect(normalizeWebsiteUrl('  mcomper.at  ')).toBe('https://mcomper.at');
  });

  it('leaves input that is not host-shaped as typed', () => {
    expect(normalizeWebsiteUrl('example')).toBe('example');
    expect(normalizeWebsiteUrl('hello world')).toBe('hello world');
    expect(normalizeWebsiteUrl('')).toBe('');
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

  it('accepts a request with no colour direction', () => {
    expect(getFieldErrors(values({ colorPalette: '' })).colorPalette).toBeUndefined();
  });

  it('accepts an explicit "no preference" answer', () => {
    expect(getFieldErrors(values({ colorPalette: 'none' })).colorPalette).toBeUndefined();
  });

  it('ignores an empty website URL', () => {
    expect(getFieldErrors(values({ websiteUrl: '  ' })).websiteUrl).toBeUndefined();
  });

  it('flags a malformed website URL', () => {
    expect(getFieldErrors(values({ websiteUrl: 'example' })).websiteUrl).toBe('url_invalid');
  });

  it('accepts a bare host as a website URL', () => {
    expect(getFieldErrors(values({ websiteUrl: 'mcomper.at' })).websiteUrl).toBeUndefined();
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
