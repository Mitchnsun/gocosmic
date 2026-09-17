import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ContactForm } from '@/components/ContactForm';

import { render, waitFor } from '../../test-utils';

const fillValidForm = async (getByLabelText: (matcher: RegExp | string) => HTMLElement) => {
  await userEvent.type(getByLabelText(/^Name/), 'Ada Lovelace');
  await userEvent.type(getByLabelText(/^Email/), 'ada@example.com');
  await userEvent.type(getByLabelText(/^Message/), 'I would like a showcase website for my analytical engine.');
};

describe('ContactForm', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('renders every field, the required hint and the honeypot', () => {
    const { getByLabelText, getByText, getByRole } = render(<ContactForm />);

    expect(getByText('Fields marked with an asterisk are required')).toBeInTheDocument();
    expect(getByLabelText(/^Name/)).toBeRequired();
    expect(getByLabelText(/^Email/)).toBeRequired();
    expect(getByLabelText(/^Message/)).toBeRequired();
    expect(getByLabelText(/^Subject/)).not.toBeRequired();
    expect(getByLabelText(/^Phone/)).toBeInTheDocument();
    expect(getByLabelText(/^Company/)).toBeInTheDocument();
    expect(getByRole('button', { name: /Send the message/ })).toBeInTheDocument();
    expect(document.querySelector('input[name="honeypot"]')).toBeInTheDocument();
  });

  it('shows validation errors and does not call the API', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const { getByRole, getByText } = render(<ContactForm />);

    await userEvent.click(getByRole('button', { name: /Send the message/ }));

    expect(getByText('Please enter a name between 2 and 100 characters.')).toBeInTheDocument();
    expect(getByText('Please enter a valid email address.')).toBeInTheDocument();
    expect(getByText('The message must be between 10 and 5000 characters.')).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('clears a field error as soon as the visitor edits it', async () => {
    const { getByRole, getByLabelText, queryByText } = render(<ContactForm />);

    await userEvent.click(getByRole('button', { name: /Send the message/ }));
    await userEvent.type(getByLabelText(/^Name/), 'Ada');

    expect(queryByText('Please enter a name between 2 and 100 characters.')).not.toBeInTheDocument();
  });

  it('posts the payload and shows the confirmation screen', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200 });
    vi.stubGlobal('fetch', fetchMock);
    const onSuccess = vi.fn();
    const { getByLabelText, getByRole } = render(<ContactForm onSuccess={onSuccess} />);

    await fillValidForm(getByLabelText);
    await userEvent.click(getByRole('button', { name: /Send the message/ }));

    await waitFor(() => expect(getByRole('status')).toBeInTheDocument());
    expect(getByRole('heading', { level: 3, name: 'Thank you for getting in touch!' })).toBeInTheDocument();
    expect(onSuccess).toHaveBeenCalledTimes(1);

    const [endpoint, init] = fetchMock.mock.calls[0]!;
    expect(endpoint).toBe('/api/contact');
    expect(JSON.parse(init.body)).toMatchObject({ name: 'Ada Lovelace', email: 'ada@example.com', honeypot: '' });
  });

  it('returns to an empty form from the confirmation screen', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, status: 200 }));
    const { getByLabelText, getByRole } = render(<ContactForm />);

    await fillValidForm(getByLabelText);
    await userEvent.click(getByRole('button', { name: /Send the message/ }));
    await waitFor(() => expect(getByRole('button', { name: 'Send another message' })).toBeInTheDocument());
    await userEvent.click(getByRole('button', { name: 'Send another message' }));

    expect(getByLabelText(/^Name/)).toHaveValue('');
  });

  it('surfaces the rate limit reported by the API', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 429 }));
    const { getByLabelText, getByRole } = render(<ContactForm />);

    await fillValidForm(getByLabelText);
    await userEvent.click(getByRole('button', { name: /Send the message/ }));

    await waitFor(() => expect(getByRole('alert')).toHaveTextContent(/already sent several messages/));
  });

  it('blocks the fourth submission client-side', async () => {
    const now = Date.now();
    window.localStorage.setItem('gocosmic.contactSubmissions', JSON.stringify([now, now, now]));
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const { getByLabelText, getByRole } = render(<ContactForm />);

    await fillValidForm(getByLabelText);
    await userEvent.click(getByRole('button', { name: /Send the message/ }));

    await waitFor(() => expect(getByRole('alert')).toHaveTextContent(/already sent several messages/));
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('reports a server error', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500 }));
    const { getByLabelText, getByRole } = render(<ContactForm />);

    await fillValidForm(getByLabelText);
    await userEvent.click(getByRole('button', { name: /Send the message/ }));

    await waitFor(() => expect(getByRole('alert')).toHaveTextContent(/could not be sent/));
  });

  it('reports a network failure', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));
    const { getByLabelText, getByRole } = render(<ContactForm />);

    await fillValidForm(getByLabelText);
    await userEvent.click(getByRole('button', { name: /Send the message/ }));

    await waitFor(() => expect(getByRole('alert')).toHaveTextContent(/Connection lost/));
  });

  it('clears the form on demand', async () => {
    const { getByLabelText, getByRole } = render(<ContactForm variant="embedded" />);

    await userEvent.type(getByLabelText(/^Name/), 'Ada');
    await userEvent.click(getByRole('button', { name: 'Clear the form' }));

    expect(getByLabelText(/^Name/)).toHaveValue('');
  });

  it('posts to a custom endpoint', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200 });
    vi.stubGlobal('fetch', fetchMock);
    const { getByLabelText, getByRole } = render(<ContactForm endpoint="/api/custom" />);

    await fillValidForm(getByLabelText);
    await userEvent.click(getByRole('button', { name: /Send the message/ }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledWith('/api/custom', expect.anything()));
  });
});
