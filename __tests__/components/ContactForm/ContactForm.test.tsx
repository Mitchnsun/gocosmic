import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ContactForm } from '@/components/ContactForm';
import type { ContactActionResult } from '@/components/ContactForm/ContactForm.types';

import { render, waitFor } from '../../test-utils';

const submitContactMessage = vi.hoisted(() => vi.fn());

vi.mock('@/app/actions/contact', () => ({ submitContactMessage }));

const fillValidForm = async (getByLabelText: (matcher: RegExp | string) => HTMLElement) => {
  await userEvent.type(getByLabelText(/^Your name/), 'Ada Lovelace');
  await userEvent.type(getByLabelText(/^Email/), 'ada@example.com');
  await userEvent.type(getByLabelText(/^Your message/), 'I would like a showcase website for my analytical engine.');
};

describe('ContactForm', () => {
  beforeEach(() => {
    window.localStorage.clear();
    submitContactMessage.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders every field, the required hint and the honeypot', () => {
    const { getByLabelText, getByText, getByRole } = render(<ContactForm />);

    expect(getByText('Fields marked with an asterisk are required')).toBeInTheDocument();
    expect(getByLabelText(/^Your name/)).toBeRequired();
    expect(getByLabelText(/^Email/)).toBeRequired();
    expect(getByLabelText(/^Your message/)).toBeRequired();
    expect(getByLabelText(/^Phone/)).toBeInTheDocument();
    expect(getByLabelText(/^Your business/)).toBeInTheDocument();
    expect(getByRole('group', { name: /What you need/ })).toBeInTheDocument();
    expect(getByRole('radio', { name: 'Online shop' })).not.toBeChecked();
    expect(getByRole('button', { name: /Send my message/ })).toBeInTheDocument();
    expect(document.querySelector('input[name="honeypot"]')).toBeInTheDocument();
  });

  it('shows validation errors and does not call the action', async () => {
    const { getByRole, getByText } = render(<ContactForm />);

    await userEvent.click(getByRole('button', { name: /Send my message/ }));

    expect(getByText('Please enter a name between 2 and 100 characters.')).toBeInTheDocument();
    expect(getByText('Please enter a valid email address.')).toBeInTheDocument();
    expect(getByText('The message must be between 10 and 5000 characters.')).toBeInTheDocument();
    expect(submitContactMessage).not.toHaveBeenCalled();
  });

  it('clears a field error as soon as the visitor edits it', async () => {
    const { getByRole, getByLabelText, queryByText } = render(<ContactForm />);

    await userEvent.click(getByRole('button', { name: /Send my message/ }));
    await userEvent.type(getByLabelText(/^Your name/), 'Ada');

    expect(queryByText('Please enter a name between 2 and 100 characters.')).not.toBeInTheDocument();
  });

  it('submits the payload and shows the confirmation screen', async () => {
    submitContactMessage.mockResolvedValue({ status: 'success' } satisfies ContactActionResult);
    const onSuccess = vi.fn();
    const { getByLabelText, getByRole } = render(<ContactForm onSuccess={onSuccess} />);

    await fillValidForm(getByLabelText);
    await userEvent.click(getByRole('button', { name: /Send my message/ }));

    await waitFor(() => expect(getByRole('status')).toBeInTheDocument());
    expect(
      getByRole('heading', { level: 3, name: 'Thank you. Matthieu will reply within one working day.' })
    ).toBeInTheDocument();
    expect(onSuccess).toHaveBeenCalledTimes(1);

    expect(submitContactMessage).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Ada Lovelace', email: 'ada@example.com', honeypot: '' })
    );
  });

  it('returns to an empty form from the confirmation screen', async () => {
    submitContactMessage.mockResolvedValue({ status: 'success' } satisfies ContactActionResult);
    const { getByLabelText, getByRole } = render(<ContactForm />);

    await fillValidForm(getByLabelText);
    await userEvent.click(getByRole('button', { name: /Send my message/ }));
    await waitFor(() => expect(getByRole('button', { name: 'Send another message' })).toBeInTheDocument());
    await userEvent.click(getByRole('button', { name: 'Send another message' }));

    expect(getByLabelText(/^Your name/)).toHaveValue('');
  });

  it('blocks the fourth submission client-side', async () => {
    const now = Date.now();
    window.localStorage.setItem('gocosmic.contactSubmissions', JSON.stringify([now, now, now]));
    const { getByLabelText, getByRole } = render(<ContactForm />);

    await fillValidForm(getByLabelText);
    await userEvent.click(getByRole('button', { name: /Send my message/ }));

    await waitFor(() => expect(getByRole('alert')).toHaveTextContent(/already sent several messages/));
    expect(submitContactMessage).not.toHaveBeenCalled();
  });

  it('reports a server error', async () => {
    submitContactMessage.mockResolvedValue({ status: 'error' } satisfies ContactActionResult);
    const { getByLabelText, getByRole } = render(<ContactForm />);

    await fillValidForm(getByLabelText);
    await userEvent.click(getByRole('button', { name: /Send my message/ }));

    await waitFor(() => expect(getByRole('alert')).toHaveTextContent(/could not be sent/));
  });

  it('reports a network failure', async () => {
    submitContactMessage.mockRejectedValue(new TypeError('Failed to fetch'));
    const { getByLabelText, getByRole } = render(<ContactForm />);

    await fillValidForm(getByLabelText);
    await userEvent.click(getByRole('button', { name: /Send my message/ }));

    await waitFor(() => expect(getByRole('alert')).toHaveTextContent(/Connection lost/));
  });

  it('surfaces a blocked submission (e.g. rate limited by the Vercel Firewall) as try again later', async () => {
    submitContactMessage.mockRejectedValue(new Error('An unexpected response was received from the server.'));
    const { getByLabelText, getByRole } = render(<ContactForm />);

    await fillValidForm(getByLabelText);
    await userEvent.click(getByRole('button', { name: /Send my message/ }));

    await waitFor(() => expect(getByRole('alert')).toHaveTextContent(/could not be sent right now/));
  });

  it('clears the form on demand', async () => {
    const { getByLabelText, getByRole } = render(<ContactForm variant="embedded" />);

    await userEvent.type(getByLabelText(/^Your name/), 'Ada');
    await userEvent.click(getByRole('button', { name: 'Clear the form' }));

    expect(getByLabelText(/^Your name/)).toHaveValue('');
  });

  it('disables clearing while the submission is in flight', async () => {
    let release: (value: ContactActionResult) => void = () => {};
    submitContactMessage.mockImplementation(
      () =>
        new Promise((resolve) => {
          release = resolve;
        })
    );
    const { getByLabelText, getByRole } = render(<ContactForm />);

    await fillValidForm(getByLabelText);
    await userEvent.click(getByRole('button', { name: /Send my message/ }));

    await waitFor(() => expect(getByRole('button', { name: 'Clear the form' })).toBeDisabled());
    expect(getByRole('button', { name: /Sending/ })).toBeDisabled();

    release({ status: 'success' });
    await waitFor(() => expect(getByRole('status')).toBeInTheDocument());
  });

  it('does not submit twice while a request is pending', async () => {
    let release: (value: ContactActionResult) => void = () => {};
    submitContactMessage.mockImplementation(
      () =>
        new Promise((resolve) => {
          release = resolve;
        })
    );
    const { getByLabelText, getByRole } = render(<ContactForm />);

    await fillValidForm(getByLabelText);
    const submit = getByRole('button', { name: /Send my message/ });
    await userEvent.click(submit);
    await userEvent.click(getByRole('button', { name: /Sending/ }));

    expect(submitContactMessage).toHaveBeenCalledTimes(1);
    release({ status: 'success' });
    await waitFor(() => expect(getByRole('status')).toBeInTheDocument());
  });

  it('moves focus to the first invalid field when the submission is rejected', async () => {
    const { getByRole, getByLabelText } = render(<ContactForm />);

    await userEvent.click(getByRole('button', { name: /Send my message/ }));

    await waitFor(() => expect(getByLabelText(/^Your name/)).toHaveFocus());
  });

  it('focuses the first field that is still invalid on a later attempt', async () => {
    const { getByRole, getByLabelText } = render(<ContactForm />);

    await userEvent.type(getByLabelText(/^Your name/), 'Ada Lovelace');
    await userEvent.click(getByRole('button', { name: /Send my message/ }));

    await waitFor(() => expect(getByLabelText(/^Email/)).toHaveFocus());
  });

  it('freezes the fields while the submission is in flight', async () => {
    let release: (value: ContactActionResult) => void = () => {};
    submitContactMessage.mockImplementation(
      () =>
        new Promise((resolve) => {
          release = resolve;
        })
    );
    const { getByLabelText, getByRole } = render(<ContactForm />);

    await fillValidForm(getByLabelText);
    await userEvent.click(getByRole('button', { name: /Send my message/ }));

    // An edit made meanwhile would be dropped by the confirmation, while the
    // message already on its way still carried the old text.
    await waitFor(() => expect(getByLabelText(/^Your message/)).toBeDisabled());
    expect(getByLabelText(/^Your name/)).toBeDisabled();
    expect(getByLabelText(/^Email/)).toBeDisabled();
    expect(getByRole('radio', { name: 'Online shop' })).toBeDisabled();
    expect(getByLabelText(/^Phone/)).toBeDisabled();
    expect(getByLabelText(/^Your business/)).toBeDisabled();

    release({ status: 'success' });
    await waitFor(() => expect(getByRole('status')).toBeInTheDocument());
    expect(getByRole('button', { name: 'Send another message' })).toBeInTheDocument();
  });
});

describe('ContactForm need chips', () => {
  it('sends the picked need along with the message', async () => {
    submitContactMessage.mockResolvedValue({ status: 'success' });
    const { getByLabelText, getByRole } = render(<ContactForm />);

    await fillValidForm(getByLabelText);
    await userEvent.click(getByRole('radio', { name: 'Online shop' }));
    expect(getByRole('radio', { name: 'Online shop' })).toBeChecked();
    await userEvent.click(getByRole('button', { name: /Send my message/ }));

    await waitFor(() => expect(submitContactMessage).toHaveBeenCalled());
    expect(submitContactMessage.mock.calls[0]?.[0]).toMatchObject({ need: 'shop' });
  });
});
