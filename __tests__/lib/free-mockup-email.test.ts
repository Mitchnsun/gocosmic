import { buildFreeMockupEmail, escapeHtml } from '@/lib/free-mockup-email';

describe('escapeHtml', () => {
  it('escapes every character that could break out of an HTML node', () => {
    expect(escapeHtml(`<img src="x" onerror='alert(1)'> & done`)).toBe(
      '&lt;img src=&quot;x&quot; onerror=&#39;alert(1)&#39;&gt; &amp; done'
    );
  });
});

describe('buildFreeMockupEmail', () => {
  const input = {
    email: 'prospect@example.com',
    colorPalette: 'lakeMountains' as const,
    websiteUrl: 'https://example.com',
    wishes: 'A calm home page.',
    locale: 'fr',
  };

  it('builds a subject carrying the visitor email', () => {
    expect(buildFreeMockupEmail(input).subject).toBe('Demande de maquette gratuite — prospect@example.com');
  });

  it('lists every field in the text body', () => {
    const { text } = buildFreeMockupEmail(input);

    expect(text).toContain('Email: prospect@example.com');
    expect(text).toContain('Colour palette: Lake & mountains (lakeMountains)');
    expect(text).toContain('Current website: https://example.com');
    expect(text).toContain('Wishes: A calm home page.');
    expect(text).toContain('Locale: fr');
  });

  it('replaces empty optional fields with a placeholder', () => {
    const { text } = buildFreeMockupEmail({ ...input, websiteUrl: '   ', wishes: undefined });

    expect(text).toContain('Current website: —');
    expect(text).toContain('Wishes: —');
  });

  it('escapes visitor input in the HTML body', () => {
    const { html } = buildFreeMockupEmail({ ...input, wishes: '<script>alert(1)</script>' });

    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;script&gt;alert(1)&lt;/script&gt;');
  });

  it('renders one HTML row per field', () => {
    const { html } = buildFreeMockupEmail(input);

    expect(html.match(/<tr>/g)).toHaveLength(5);
  });
});
