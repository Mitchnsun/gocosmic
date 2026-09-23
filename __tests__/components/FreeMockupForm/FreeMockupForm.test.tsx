import { beforeEach, vi } from 'vitest';

import { FreeMockupForm } from '@/components/FreeMockupForm';
import { PLAN_STORAGE_KEY } from '@/lib/pricing/plan-storage';

import { fireEvent, render, waitFor } from '../../test-utils';

const PLAN_CODE = 'website~showcase~p0~u-~-~fr';

const submitFreeMockupRequest = vi.hoisted(() => vi.fn());

vi.mock('@/app/actions/free-mockup', () => ({ submitFreeMockupRequest }));

/** Fills the two required fields with a valid answer. */
const fillRequiredFields = (
  getByLabelText: ReturnType<typeof render>['getByLabelText'],
  getByRole: ReturnType<typeof render>['getByRole']
) => {
  fireEvent.change(getByLabelText('Your email'), { target: { value: 'prospect@example.com' } });
  fireEvent.click(getByRole('radio', { name: 'Starry night' }));
};

/**
 * A promise the test settles itself. Leaving an action promise unresolved keeps
 * a React transition pending past the test, which leaks `isPending` into the
 * next one, so every deferred submission here is settled before the test ends.
 */
const deferredSubmission = () => {
  let settle: (state: { status: string }) => void = () => {};
  const promise = new Promise<{ status: string }>((resolve) => {
    settle = resolve;
  });

  return { promise, settle: (state: { status: string }) => settle(state) };
};

describe('FreeMockupForm', () => {
  it('carries a stored pricing simulation as a hidden field and says so', async () => {
    window.sessionStorage.setItem(PLAN_STORAGE_KEY, PLAN_CODE);
    const { container, findByText } = render(<FreeMockupForm />);

    expect(
      await findByText('The results of your pricing simulation will be included with your request.')
    ).toBeInTheDocument();
    expect(container.querySelector('input[name="plan"]')).toHaveValue(PLAN_CODE);
  });

  it('has no plan field without a stored simulation', () => {
    const { container, queryByText } = render(<FreeMockupForm />);

    expect(container.querySelector('input[name="plan"]')).toBeNull();
    expect(
      queryByText('The results of your pricing simulation will be included with your request.')
    ).not.toBeInTheDocument();
  });

  it('ignores a stored simulation that is not a valid code', () => {
    window.sessionStorage.setItem(PLAN_STORAGE_KEY, 'not-a-plan');
    const { container, queryByText } = render(<FreeMockupForm />);

    expect(container.querySelector('input[name="plan"]')).toBeNull();
    expect(
      queryByText('The results of your pricing simulation will be included with your request.')
    ).not.toBeInTheDocument();
  });

  it('sends the stored simulation and forgets it once the request is received', async () => {
    window.sessionStorage.setItem(PLAN_STORAGE_KEY, PLAN_CODE);
    const { findByText, getByLabelText, getByRole } = render(<FreeMockupForm />);
    await findByText('The results of your pricing simulation will be included with your request.');

    fillRequiredFields(getByLabelText, getByRole);
    fireEvent.click(getByRole('button', { name: /Request my free mockup/ }));

    await findByText('Request received');
    expect((submitFreeMockupRequest.mock.calls[0]?.[1] as FormData).get('plan')).toBe(PLAN_CODE);
    expect(window.sessionStorage.getItem(PLAN_STORAGE_KEY)).toBeNull();
  });

  it('keeps the stored simulation when the request fails', async () => {
    window.sessionStorage.setItem(PLAN_STORAGE_KEY, PLAN_CODE);
    submitFreeMockupRequest.mockResolvedValue({ status: 'error' });
    const { findByText, getByLabelText, getByRole } = render(<FreeMockupForm />);
    await findByText('The results of your pricing simulation will be included with your request.');

    fillRequiredFields(getByLabelText, getByRole);
    fireEvent.click(getByRole('button', { name: /Request my free mockup/ }));

    await findByText('Your request could not be sent. Please try again in a moment.');
    expect(window.sessionStorage.getItem(PLAN_STORAGE_KEY)).toBe(PLAN_CODE);
  });

  beforeEach(() => {
    window.sessionStorage.clear();
    submitFreeMockupRequest.mockReset();
    submitFreeMockupRequest.mockResolvedValue({ status: 'success' });
  });

  it('renders the four fields and the submit button', () => {
    const { getByLabelText, getAllByRole, getByRole } = render(<FreeMockupForm />);

    expect(getByLabelText('Your email')).toHaveAttribute('type', 'email');
    expect(getAllByRole('radio')).toHaveLength(7);
    expect(getByLabelText(/Your current website/)).toHaveAttribute('type', 'text');
    expect(getByLabelText(/What you have in mind/)).toBeInTheDocument();
    expect(getByRole('button', { name: /Request my free mockup/ })).toBeEnabled();
  });

  it('carries the visitor locale and the honeypot in the payload', () => {
    const { container } = render(<FreeMockupForm />);

    expect(container.querySelector('input[name="locale"]')).toHaveValue('en');
    expect(container.querySelector('input[name="company"]')).toHaveValue('');
  });

  it('updates the character counter as the visitor types', () => {
    const { getByLabelText, getByText } = render(<FreeMockupForm />);

    fireEvent.change(getByLabelText(/What you have in mind/), { target: { value: 'A calm page' } });

    expect(getByText('11/500')).toBeInTheDocument();
  });

  it('shows an inline error once an invalid email field is left', () => {
    const { getByLabelText, getByText } = render(<FreeMockupForm />);
    const email = getByLabelText('Your email');

    fireEvent.change(email, { target: { value: 'nope' } });
    fireEvent.blur(email);

    expect(getByText('Please enter a valid email address.')).toBeInTheDocument();
    expect(email).toHaveAttribute('aria-invalid', 'true');
  });

  it('shows an inline error once an invalid website address is left', () => {
    const { getByLabelText, getByText } = render(<FreeMockupForm />);
    const website = getByLabelText(/Your current website/);

    fireEvent.change(website, { target: { value: 'example' } });
    fireEvent.blur(website);

    expect(getByText('Please enter a valid website address, for example my-site.com.')).toBeInTheDocument();
    expect(website).toHaveAttribute('aria-invalid', 'true');
  });

  it('shows no inline error for a bare website address', () => {
    const { getByLabelText, queryByText } = render(<FreeMockupForm />);
    const website = getByLabelText(/Your current website/);

    fireEvent.change(website, { target: { value: 'mcomper.at' } });
    fireEvent.blur(website);

    expect(queryByText('Please enter a valid website address, for example my-site.com.')).not.toBeInTheDocument();
    expect(website).not.toHaveAttribute('aria-invalid');
  });

  it('flags wishes longer than the cap once the field is left', () => {
    const { getByLabelText, getByText } = render(<FreeMockupForm />);
    const wishes = getByLabelText(/What you have in mind/);

    fireEvent.change(wishes, { target: { value: 'a'.repeat(501) } });
    fireEvent.blur(wishes);

    expect(getByText('Please keep your message under 500 characters.')).toBeInTheDocument();
  });

  it('keeps quiet about fields the visitor has not touched yet', () => {
    const { queryByText } = render(<FreeMockupForm />);

    expect(queryByText('This field is required.')).not.toBeInTheDocument();
  });

  it('blocks an invalid submission and reports the fields to fix', async () => {
    const { getByRole, getByText, getAllByText } = render(<FreeMockupForm />);

    fireEvent.click(getByRole('button', { name: /Request my free mockup/ }));

    await waitFor(() => expect(getByText('Please check the highlighted fields.')).toBeInTheDocument());
    // Only the email is mandatory: the colour direction may be left untouched.
    expect(getAllByText('This field is required.')).toHaveLength(1);
    expect(getByRole('radiogroup')).not.toHaveAttribute('aria-invalid');
    expect(submitFreeMockupRequest).not.toHaveBeenCalled();
  });

  it('submits without a colour direction', async () => {
    const { settle, promise } = deferredSubmission();
    submitFreeMockupRequest.mockReturnValue(promise);
    const { getByLabelText, getByRole } = render(<FreeMockupForm />);

    fireEvent.change(getByLabelText('Your email'), { target: { value: 'prospect@example.com' } });
    fireEvent.click(getByRole('button', { name: /Request my free mockup/ }));

    await waitFor(() => expect(submitFreeMockupRequest).toHaveBeenCalled());
    const payload = submitFreeMockupRequest.mock.calls[0]![1] as FormData;
    expect(payload.get('email')).toBe('prospect@example.com');
    expect(payload.get('colorPalette')).toBe('');

    settle({ status: 'success' });
    await waitFor(() => expect(submitFreeMockupRequest).toHaveBeenCalledTimes(1));
  });

  it('carries an explicit "no preference" answer', async () => {
    const { settle, promise } = deferredSubmission();
    submitFreeMockupRequest.mockReturnValue(promise);
    const { getByLabelText, getByRole } = render(<FreeMockupForm />);

    fireEvent.change(getByLabelText('Your email'), { target: { value: 'prospect@example.com' } });
    fireEvent.click(getByRole('radio', { name: 'No preference' }));
    fireEvent.click(getByRole('button', { name: /Request my free mockup/ }));

    await waitFor(() => expect(submitFreeMockupRequest).toHaveBeenCalled());
    expect((submitFreeMockupRequest.mock.calls[0]![1] as FormData).get('colorPalette')).toBe('none');

    settle({ status: 'success' });
    await waitFor(() => expect(submitFreeMockupRequest).toHaveBeenCalledTimes(1));
  });

  it('never turns a validation failure into a send failure once the fields are fixed', async () => {
    const { getByLabelText, getByRole, getByText, queryByText } = render(<FreeMockupForm />);

    fireEvent.click(getByRole('button', { name: /Request my free mockup/ }));
    await waitFor(() => expect(getByText('Please check the highlighted fields.')).toBeInTheDocument());

    // Correcting the highlighted fields must retire the banner, not relabel it:
    // no send was ever attempted.
    fillRequiredFields(getByLabelText, getByRole);

    await waitFor(() => expect(queryByText('Please check the highlighted fields.')).not.toBeInTheDocument());
    expect(queryByText('Your request could not be sent. Please try again in a moment.')).not.toBeInTheDocument();
    expect(submitFreeMockupRequest).not.toHaveBeenCalled();
  });

  it('clears a delivery failure banner as soon as the visitor edits the form', async () => {
    submitFreeMockupRequest.mockResolvedValue({ status: 'error' });
    const { getByLabelText, getByRole, getByText, queryByText } = render(<FreeMockupForm />);

    fillRequiredFields(getByLabelText, getByRole);
    fireEvent.click(getByRole('button', { name: /Request my free mockup/ }));
    await waitFor(() =>
      expect(getByText('Your request could not be sent. Please try again in a moment.')).toBeInTheDocument()
    );

    fireEvent.change(getByLabelText('Your email'), { target: { value: 'someone@example.com' } });

    await waitFor(() =>
      expect(queryByText('Your request could not be sent. Please try again in a moment.')).not.toBeInTheDocument()
    );
  });

  it('still confirms a success when the visitor edited a field while it was in flight', async () => {
    const inFlight = deferredSubmission();
    submitFreeMockupRequest.mockReturnValue(inFlight.promise);
    const { getByLabelText, getByRole, getByText, queryByRole } = render(<FreeMockupForm />);

    fillRequiredFields(getByLabelText, getByRole);
    fireEvent.click(getByRole('button', { name: /Request my free mockup/ }));
    await waitFor(() => expect(getByRole('button', { name: /Sending/ })).toBeDisabled());

    // The fields stay editable while the request is in flight.
    fireEvent.change(getByLabelText(/What you have in mind/), { target: { value: 'One more thought' } });
    inFlight.settle({ status: 'success' });

    await waitFor(() => expect(getByText('Request received')).toBeInTheDocument());
    expect(queryByRole('button', { name: /Request my free mockup/ })).not.toBeInTheDocument();
  });

  it('still reports a failure when the visitor edited a field while it was in flight', async () => {
    const inFlight = deferredSubmission();
    submitFreeMockupRequest.mockReturnValue(inFlight.promise);
    const { getByLabelText, getByRole, getByText } = render(<FreeMockupForm />);

    fillRequiredFields(getByLabelText, getByRole);
    fireEvent.click(getByRole('button', { name: /Request my free mockup/ }));
    await waitFor(() => expect(getByRole('button', { name: /Sending/ })).toBeDisabled());

    fireEvent.change(getByLabelText(/What you have in mind/), { target: { value: 'One more thought' } });
    inFlight.settle({ status: 'error' });

    await waitFor(() =>
      expect(getByText('Your request could not be sent. Please try again in a moment.')).toBeInTheDocument()
    );
  });

  it('does not show the previous failure while a retry is in flight', async () => {
    submitFreeMockupRequest.mockResolvedValue({ status: 'error' });
    const { getByLabelText, getByRole, getByText, queryByText } = render(<FreeMockupForm />);

    fillRequiredFields(getByLabelText, getByRole);
    fireEvent.click(getByRole('button', { name: /Request my free mockup/ }));
    await waitFor(() =>
      expect(getByText('Your request could not be sent. Please try again in a moment.')).toBeInTheDocument()
    );

    // Retry: the old failure must not sit next to a button reading "Sending…".
    const retry = deferredSubmission();
    submitFreeMockupRequest.mockReturnValue(retry.promise);
    fireEvent.click(getByRole('button', { name: /Request my free mockup/ }));

    await waitFor(() => expect(getByRole('button', { name: /Sending/ })).toBeDisabled());
    expect(queryByText('Your request could not be sent. Please try again in a moment.')).not.toBeInTheDocument();

    retry.settle({ status: 'success' });
    await waitFor(() => expect(getByText('Request received')).toBeInTheDocument());
  });

  it('does not resurrect a corrected validation banner while the retry is in flight', async () => {
    const { getByLabelText, getByRole, getByText, queryByText } = render(<FreeMockupForm />);

    fireEvent.click(getByRole('button', { name: /Request my free mockup/ }));
    await waitFor(() => expect(getByText('Please check the highlighted fields.')).toBeInTheDocument());

    fillRequiredFields(getByLabelText, getByRole);
    const retry = deferredSubmission();
    submitFreeMockupRequest.mockReturnValue(retry.promise);
    fireEvent.click(getByRole('button', { name: /Request my free mockup/ }));

    await waitFor(() => expect(getByRole('button', { name: /Sending/ })).toBeDisabled());
    expect(queryByText('Please check the highlighted fields.')).not.toBeInTheDocument();

    retry.settle({ status: 'success' });
    await waitFor(() => expect(getByText('Request received')).toBeInTheDocument());
  });

  it('still submits the chosen palette when retrying after a failure', async () => {
    // React 19 resets the form once an action settles and skips re-rendering
    // controlled inputs whose state did not change, so the palette radio is
    // unchecked in the DOM while its card still renders as selected. A retry
    // must carry the palette the visitor can see they picked.
    submitFreeMockupRequest.mockResolvedValue({ status: 'error' });
    const { getByLabelText, getByRole, getByText, queryByText } = render(<FreeMockupForm />);

    fillRequiredFields(getByLabelText, getByRole);
    fireEvent.click(getByRole('button', { name: /Request my free mockup/ }));
    await waitFor(() =>
      expect(getByText('Your request could not be sent. Please try again in a moment.')).toBeInTheDocument()
    );

    submitFreeMockupRequest.mockResolvedValue({ status: 'success' });
    fireEvent.click(getByRole('button', { name: /Request my free mockup/ }));
    await waitFor(() => expect(getByText('Request received')).toBeInTheDocument());

    expect(submitFreeMockupRequest).toHaveBeenCalledTimes(2);
    const retryPayload = submitFreeMockupRequest.mock.calls[1]?.[1] as FormData;
    expect(retryPayload.get('colorPalette')).toBe('starryNight');
    expect(retryPayload.get('email')).toBe('prospect@example.com');
    expect(queryByText('This field is required.')).not.toBeInTheDocument();
  });

  it('submits a valid request and confirms it was received', async () => {
    const { getByLabelText, getByRole, getByText, queryByRole } = render(<FreeMockupForm />);

    fillRequiredFields(getByLabelText, getByRole);
    fireEvent.change(getByLabelText(/Your current website/), { target: { value: 'https://example.com' } });
    fireEvent.change(getByLabelText(/What you have in mind/), { target: { value: 'A calm page.' } });
    fireEvent.click(getByRole('button', { name: /Request my free mockup/ }));

    await waitFor(() => expect(getByText('Request received')).toBeInTheDocument());

    expect(submitFreeMockupRequest).toHaveBeenCalledTimes(1);
    const formData = submitFreeMockupRequest.mock.calls[0]?.[1] as FormData;
    expect(formData.get('email')).toBe('prospect@example.com');
    expect(formData.get('colorPalette')).toBe('starryNight');
    expect(formData.get('locale')).toBe('en');
    expect(formData.get('websiteUrl')).toBe('https://example.com');
    expect(formData.get('wishes')).toBe('A calm page.');
    expect(queryByRole('button', { name: /Request my free mockup/ })).not.toBeInTheDocument();
  });

  it('shows the generic message when the request could not be sent', async () => {
    submitFreeMockupRequest.mockResolvedValue({ status: 'error' });
    const { getByLabelText, getByRole, getByText } = render(<FreeMockupForm />);

    fillRequiredFields(getByLabelText, getByRole);
    fireEvent.click(getByRole('button', { name: /Request my free mockup/ }));

    await waitFor(() =>
      expect(getByText('Your request could not be sent. Please try again in a moment.')).toBeInTheDocument()
    );
    expect(getByRole('button', { name: /Request my free mockup/ })).toBeEnabled();
  });

  it('shows the try-again-later message when the submission is blocked in transit', async () => {
    submitFreeMockupRequest.mockRejectedValue(new Error('An unexpected response was received from the server.'));
    const { getByLabelText, getByRole, getByText } = render(<FreeMockupForm />);

    fillRequiredFields(getByLabelText, getByRole);
    fireEvent.click(getByRole('button', { name: /Request my free mockup/ }));

    await waitFor(() =>
      expect(getByText('Your request could not be sent right now. Please try again later.')).toBeInTheDocument()
    );
  });

  it('disables the button while the request is in flight', async () => {
    const inFlight = deferredSubmission();
    submitFreeMockupRequest.mockReturnValue(inFlight.promise);
    const { getByLabelText, getByRole, getByText } = render(<FreeMockupForm />);

    fillRequiredFields(getByLabelText, getByRole);
    fireEvent.click(getByRole('button', { name: /Request my free mockup/ }));

    await waitFor(() => expect(getByRole('button', { name: /Sending/ })).toBeDisabled());

    inFlight.settle({ status: 'success' });
    await waitFor(() => expect(getByText('Request received')).toBeInTheDocument());
  });
});
