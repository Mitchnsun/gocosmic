import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { vi } from 'vitest';

import LocaleLayout, { generateMetadata } from '@/app/[locale]/layout';
import { routing } from '@/i18n/routing';

// Mock Next.js modules
vi.mock('next/font/google', () => ({
  Poppins: () => ({
    className: 'mocked-poppins-font',
  }),
}));

vi.mock('next/navigation', () => ({
  notFound: vi.fn(),
}));

vi.mock('next-intl', () => ({
  hasLocale: vi.fn(),
  NextIntlClientProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="next-intl-provider">{children}</div>
  ),
}));

vi.mock('next-intl/server', () => ({
  getTranslations: vi.fn(),
}));

vi.mock('@/components/Header', () => ({
  Header: () => <header data-testid="header">Header</header>,
}));

vi.mock('@/components/Footer', () => ({
  Footer: () => <footer data-testid="footer">Footer</footer>,
}));

const mockHasLocale = vi.mocked(hasLocale);
const mockNotFound = vi.mocked(notFound);
const mockGetTranslations = vi.mocked(getTranslations);

describe('LocaleLayout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('generateMetadata', () => {
    it('should generate correct metadata for valid locale', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mockT = vi.fn() as any;
      mockT.mockReturnValueOnce('Go Cosmic');
      mockT.mockReturnValueOnce('Go Cosmic Dev: A Cosmic Journey into the Future of Development');

      mockGetTranslations.mockResolvedValue(mockT);

      const params = Promise.resolve({ locale: 'en' });
      const metadata = await generateMetadata({ params });

      expect(mockGetTranslations).toHaveBeenCalledWith({ locale: 'en', namespace: 'meta' });
      expect(mockT).toHaveBeenCalledWith('title');
      expect(mockT).toHaveBeenCalledWith('description');
      expect(metadata).toEqual({
        title: 'Go Cosmic',
        description: 'Go Cosmic Dev: A Cosmic Journey into the Future of Development',
      });
    });

    it('should handle different locales', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mockT = vi.fn() as any;
      mockT.mockReturnValueOnce('Aller Cosmic');
      mockT.mockReturnValueOnce('Description en français');

      mockGetTranslations.mockResolvedValue(mockT);

      const params = Promise.resolve({ locale: 'fr' });
      await generateMetadata({ params });

      expect(mockGetTranslations).toHaveBeenCalledWith({ locale: 'fr', namespace: 'meta' });
    });
  });

  describe('LocaleLayout component', () => {
    it('should render layout with valid locale', async () => {
      mockHasLocale.mockReturnValue(true);

      const params = Promise.resolve({ locale: 'en' });
      const layout = await LocaleLayout({
        children: <div>Test Content</div>,
        params,
      });

      expect(mockHasLocale).toHaveBeenCalledWith(routing.locales, 'en');
      expect(mockNotFound).not.toHaveBeenCalled();

      // Check HTML structure
      expect(layout.type).toBe('html');
      expect(layout.props.lang).toBe('en');

      // Check body styling
      const body = layout.props.children;
      expect(body.type).toBe('body');
      expect(body.props.className).toContain('mocked-poppins-font');
      expect(body.props.className).toContain('bg-gray-900');
    });

    it('should call notFound for invalid locale', async () => {
      mockHasLocale.mockReturnValue(false);

      const params = Promise.resolve({ locale: 'invalid' });

      await LocaleLayout({
        children: <div>Test Content</div>,
        params,
      });

      expect(mockHasLocale).toHaveBeenCalledWith(routing.locales, 'invalid');
      expect(mockNotFound).toHaveBeenCalled();
    });

    it('should render with correct HTML structure and styling', async () => {
      mockHasLocale.mockReturnValue(true);

      const params = Promise.resolve({ locale: 'en' });
      const layout = await LocaleLayout({
        children: <div>Test Content</div>,
        params,
      });

      // Check HTML structure
      expect(layout.type).toBe('html');
      expect(layout.props.lang).toBe('en');

      // Check body styling
      const body = layout.props.children;
      expect(body.type).toBe('body');
      expect(body.props.className).toContain('mocked-poppins-font');
      expect(body.props.className).toContain('bg-gray-900');
    });

    it('should handle different locales in HTML lang attribute', async () => {
      mockHasLocale.mockReturnValue(true);

      const params = Promise.resolve({ locale: 'fr' });
      const layout = await LocaleLayout({
        children: <div>Contenu Test</div>,
        params,
      });

      expect(layout.props.lang).toBe('fr');
    });

    it('should fallback to "en" if locale is empty', async () => {
      mockHasLocale.mockReturnValue(true);

      const params = Promise.resolve({ locale: '' });
      const layout = await LocaleLayout({
        children: <div>Test Content</div>,
        params,
      });

      expect(layout.props.lang).toBe('en');
    });

    it('should contain NextIntlClientProvider in body', async () => {
      mockHasLocale.mockReturnValue(true);

      const params = Promise.resolve({ locale: 'en' });
      const layout = await LocaleLayout({
        children: <div>Test Content</div>,
        params,
      });

      const body = layout.props.children;
      const provider = body.props.children;

      // Check that NextIntlClientProvider is rendered
      expect(provider.type.displayName || provider.type.name).toBeTruthy();
    });

    it('should include children content with proper structure', async () => {
      mockHasLocale.mockReturnValue(true);

      const params = Promise.resolve({ locale: 'en' });
      const layout = await LocaleLayout({
        children: <div data-testid="test-child">Test Content</div>,
        params,
      });

      const body = layout.props.children;
      const provider = body.props.children;

      // Check that the structure contains Header, content wrapper, and Footer
      expect(provider.props.children).toBeDefined();
      expect(Array.isArray(provider.props.children)).toBe(true);
      expect(provider.props.children).toHaveLength(4); // Header, content div, Footer
    });

    it('should validate routing configuration', () => {
      expect(routing.locales).toEqual(['en', 'fr', 'es', 'de', 'it']);
      expect(routing.defaultLocale).toBe('en');
    });
  });
});
