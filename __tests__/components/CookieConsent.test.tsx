import { fireEvent, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { CookieConsent } from '@/components/CookieConsent';

import { render } from '../test-utils';

vi.mock('@vercel/analytics/next', () => ({
  Analytics: () => <div data-testid="vercel-analytics" />,
}));

describe('CookieConsent', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('does not load analytics before consent', async () => {
    render(<CookieConsent />);

    expect(await screen.findByRole('heading', { name: 'Privacy preferences' })).toBeInTheDocument();
    expect(screen.queryByTestId('vercel-analytics')).not.toBeInTheDocument();
  });

  it('loads analytics after accepting consent', async () => {
    render(<CookieConsent />);

    fireEvent.click(await screen.findByRole('button', { name: 'Accept analytics' }));

    await waitFor(() => expect(screen.getByTestId('vercel-analytics')).toBeInTheDocument());
    expect(window.localStorage.getItem('gocosmic.analytics-consent')).toBe('accepted');
  });

  it('keeps analytics disabled after refusing consent', async () => {
    render(<CookieConsent />);

    fireEvent.click(await screen.findByRole('button', { name: 'Refuse' }));

    await waitFor(() => expect(screen.queryByRole('heading', { name: 'Privacy preferences' })).not.toBeInTheDocument());
    expect(screen.queryByTestId('vercel-analytics')).not.toBeInTheDocument();
    expect(window.localStorage.getItem('gocosmic.analytics-consent')).toBe('refused');
  });

  it('loads stored accepted consent and lets the user refuse later', async () => {
    window.localStorage.setItem('gocosmic.analytics-consent', 'accepted');

    render(<CookieConsent />);

    await waitFor(() => expect(screen.getByTestId('vercel-analytics')).toBeInTheDocument());

    fireEvent.click(screen.getByRole('button', { name: 'Privacy settings' }));
    fireEvent.click(screen.getByRole('checkbox', { name: /Audience measurement/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Save my choice' }));

    await waitFor(() => expect(screen.queryByTestId('vercel-analytics')).not.toBeInTheDocument());
    expect(window.localStorage.getItem('gocosmic.analytics-consent')).toBe('refused');
  });

  it('saves a customized analytics opt-in', async () => {
    render(<CookieConsent />);

    fireEvent.click(await screen.findByRole('button', { name: 'Customize' }));
    fireEvent.click(screen.getByRole('checkbox', { name: /Audience measurement/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Save my choice' }));

    await waitFor(() => expect(screen.getByTestId('vercel-analytics')).toBeInTheDocument());
    expect(window.localStorage.getItem('gocosmic.analytics-consent')).toBe('accepted');
  });
});
