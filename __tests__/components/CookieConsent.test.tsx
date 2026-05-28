import { fireEvent, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { CookieConsent, CookieConsentProvider, CookieManageButton } from '@/components/CookieConsent';

import { render } from '../test-utils';

vi.mock('@vercel/analytics/next', () => ({
  Analytics: () => <div data-testid="vercel-analytics" />,
}));

const renderWithProvider = (ui: React.ReactNode) => render(<CookieConsentProvider>{ui}</CookieConsentProvider>);

describe('CookieConsent', () => {
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

    fireEvent.click(await screen.findByRole('button', { name: 'Accept analytics' }));

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

    fireEvent.click(screen.getByRole('button', { name: 'Privacy settings' }));
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

    fireEvent.click(screen.getByRole('button', { name: 'Privacy settings' }));
    expect(await screen.findByRole('button', { name: 'Close' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Close' }));

    await waitFor(() => expect(screen.queryByRole('heading', { name: 'Privacy preferences' })).not.toBeInTheDocument());
    expect(window.localStorage.getItem('gocosmic.analytics-consent')).toBe('accepted');
    expect(screen.getByTestId('vercel-analytics')).toBeInTheDocument();
  });

  it('saves a customized analytics opt-in', async () => {
    renderWithProvider(<CookieConsent />);

    fireEvent.click(await screen.findByRole('button', { name: 'Customize' }));
    fireEvent.click(screen.getByRole('checkbox', { name: /Audience measurement/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Save my choice' }));

    await waitFor(() => expect(screen.getByTestId('vercel-analytics')).toBeInTheDocument());
    expect(window.localStorage.getItem('gocosmic.analytics-consent')).toBe('accepted');
  });
});
