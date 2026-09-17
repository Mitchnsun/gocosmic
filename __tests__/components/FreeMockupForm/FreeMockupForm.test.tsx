import { beforeEach, vi } from 'vitest';

import { FreeMockupForm } from '@/components/FreeMockupForm';

import { fireEvent, render, waitFor } from '../../test-utils';

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

describe('FreeMockupForm', () => {
  beforeEach(() => {
    submitFreeMockupRequest.mockReset();
    submitFreeMockupRequest.mockResolvedValue({ status: 'success' });
  });

  it('renders the four fields and the submit button', () => {
    const { getByLabelText, getAllByRole, getByRole } = render(<FreeMockupForm />);

    expect(getByLabelText('Your email')).toHaveAttribute('type', 'email');
    expect(getAllByRole('radio')).toHaveLength(6);
    expect(getByLabelText(/Your current website/)).toHaveAttribute('type', 'url');
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

    expect(getByText('Please enter a valid address, starting with https://')).toBeInTheDocument();
    expect(website).toHaveAttribute('aria-invalid', 'true');
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
    expect(getAllByText('This field is required.')).toHaveLength(2);
    expect(submitFreeMockupRequest).not.toHaveBeenCalled();
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

  it('disables the button while the request is in flight', async () => {
    submitFreeMockupRequest.mockReturnValue(new Promise(() => {}));
    const { getByLabelText, getByRole } = render(<FreeMockupForm />);

    fillRequiredFields(getByLabelText, getByRole);
    fireEvent.click(getByRole('button', { name: /Request my free mockup/ }));

    await waitFor(() => expect(getByRole('button', { name: /Sending/ })).toBeDisabled());
  });
});
