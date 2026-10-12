import { fireEvent, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { CookieConsent, CookieConsentProvider, CookieManageButton } from '@/components/CookieConsent';
import { CONSENT_REVEAL_SCRIPT, revealConsentBanner } from '@/components/CookieConsent/CookieConsent.boot';

import { render } from '../test-utils';

vi.mock('@vercel/analytics/next', () => ({
  Analytics: () => <div data-testid="vercel-analytics" />,
}));

const renderWithProvider = (ui: React.ReactNode) => render(<CookieConsentProvider>{ui}</CookieConsentProvider>);

describe('CookieConsent', () => {
  it('asks again when storage is blocked instead of failing', async () => {
    const getItem = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });

    renderWithProvider(<CookieConsent />);

    expect(await screen.findByRole('heading', { name: 'Privacy preferences' })).toBeInTheDocument();
    getItem.mockRestore();
  });

  beforeEach(() => {
    window.localStorage.clear();
  });

  it('does not load analytics before consent', async () => {
    renderWithProvider(<CookieConsent />);

    expect(await screen.findByRole('heading', { name: 'Privacy preferences' })).toBeInTheDocument();
    expect(screen.queryByTestId('vercel-analytics')).not.toBeInTheDocument();
  });

  it('loads analytics after accepting consent', async () => {
    renderWithProvider(<CookieConsent />);

    fireEvent.click(await screen.findByRole('button', { name: 'Accept' }));

    await waitFor(() => expect(screen.getByTestId('vercel-analytics')).toBeInTheDocument());
    expect(window.localStorage.getItem('gocosmic.analytics-consent')).toBe('accepted');
  });

  it('keeps analytics disabled after refusing consent', async () => {
    renderWithProvider(<CookieConsent />);

    fireEvent.click(await screen.findByRole('button', { name: 'Refuse' }));

    await waitFor(() => expect(screen.queryByRole('heading', { name: 'Privacy preferences' })).not.toBeInTheDocument());
    expect(screen.queryByTestId('vercel-analytics')).not.toBeInTheDocument();
    expect(window.localStorage.getItem('gocosmic.analytics-consent')).toBe('refused');
  });

  it('loads stored accepted consent and lets the user refuse later', async () => {
    window.localStorage.setItem('gocosmic.analytics-consent', 'accepted');

    renderWithProvider(
      <>
        <CookieConsent />
        <CookieManageButton />
      </>
    );

    await waitFor(() => expect(screen.getByTestId('vercel-analytics')).toBeInTheDocument());

    fireEvent.click(screen.getByRole('button', { name: 'Manage cookies' }));
    fireEvent.click(screen.getByRole('checkbox', { name: /Audience measurement/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Save my choice' }));

    await waitFor(() => expect(screen.queryByTestId('vercel-analytics')).not.toBeInTheDocument());
    expect(window.localStorage.getItem('gocosmic.analytics-consent')).toBe('refused');
  });

  it('does not show close button on first display', async () => {
    renderWithProvider(<CookieConsent />);

    await screen.findByRole('heading', { name: 'Privacy preferences' });
    expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument();
  });

  it('shows close button when reopened from manage and closes without changing choice', async () => {
    window.localStorage.setItem('gocosmic.analytics-consent', 'accepted');

    renderWithProvider(
      <>
        <CookieConsent />
        <CookieManageButton />
      </>
    );

    await waitFor(() => expect(screen.getByTestId('vercel-analytics')).toBeInTheDocument());

    fireEvent.click(screen.getByRole('button', { name: 'Manage cookies' }));
    expect(await screen.findByRole('button', { name: 'Close' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Close' }));

    await waitFor(() => expect(screen.queryByRole('heading', { name: 'Privacy preferences' })).not.toBeInTheDocument());
    expect(window.localStorage.getItem('gocosmic.analytics-consent')).toBe('accepted');
    expect(screen.getByTestId('vercel-analytics')).toBeInTheDocument();
  });

  it('saves a customized analytics opt-in', async () => {
    renderWithProvider(<CookieConsent />);

    fireEvent.click(await screen.findByRole('button', { name: 'Customise' }));
    fireEvent.click(screen.getByRole('checkbox', { name: /Audience measurement/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Save my choice' }));

    await waitFor(() => expect(screen.getByTestId('vercel-analytics')).toBeInTheDocument());
    expect(window.localStorage.getItem('gocosmic.analytics-consent')).toBe('accepted');
  });

  it('renders the banner visible in the browser, followed by an inert copy of the reveal script', async () => {
    const { container } = renderWithProvider(<CookieConsent />);

    expect(await screen.findByRole('heading', { name: 'Privacy preferences' })).toBeVisible();
    const banner = container.querySelector('[data-cookie-banner]');
    expect(banner).not.toHaveAttribute('hidden');
    expect(banner?.nextElementSibling).toHaveAttribute('type', 'application/json');
  });

  it('reads the stored choice right away on a client-only remount, so the banner never flashes', async () => {
    const { unmount } = renderWithProvider(<CookieConsent />);
    await screen.findByRole('heading', { name: 'Privacy preferences' });
    unmount();
    window.localStorage.setItem('gocosmic.analytics-consent', 'accepted');

    renderWithProvider(<CookieConsent />);

    expect(screen.queryByRole('heading', { name: 'Privacy preferences' })).not.toBeInTheDocument();
    expect(screen.getByTestId('vercel-analytics')).toBeInTheDocument();
  });
});

describe('revealConsentBanner', () => {
  const hiddenBanner = () => {
    const banner = document.createElement('section');
    banner.hidden = true;
    return banner;
  };

  beforeEach(() => {
    window.localStorage.clear();
  });

  it('reveals the banner for a first visit only', () => {
    const banner = hiddenBanner();
    revealConsentBanner('gocosmic.analytics-consent', banner);
    expect(banner.hidden).toBe(false);

    const answered = hiddenBanner();
    window.localStorage.setItem('gocosmic.analytics-consent', 'refused');
    revealConsentBanner('gocosmic.analytics-consent', answered);
    expect(answered.hidden).toBe(true);
  });

  it('reveals the banner when storage is unavailable', () => {
    const getItem = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    const banner = hiddenBanner();

    expect(() => revealConsentBanner('gocosmic.analytics-consent', banner)).not.toThrow();
    expect(banner.hidden).toBe(false);
    getItem.mockRestore();
  });

  it('serialises the reveal into a self-contained inline script', () => {
    const banner = hiddenBanner();
    const script = document.createElement('script');
    document.body.append(banner, script);
    Object.defineProperty(document, 'currentScript', { configurable: true, value: script });

    // Runs the inline script as the browser would, with nothing from this module in scope.
    // eslint-disable-next-line @typescript-eslint/no-implied-eval -- evaluating the script is the point of the test
    new Function(CONSENT_REVEAL_SCRIPT)();

    expect(CONSENT_REVEAL_SCRIPT).toContain('"gocosmic.analytics-consent"');
    expect(banner.hidden).toBe(false);
    Reflect.deleteProperty(document, 'currentScript');
    banner.remove();
    script.remove();
  });
});
