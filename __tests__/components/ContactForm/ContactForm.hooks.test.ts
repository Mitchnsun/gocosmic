import { act, renderHook, waitFor } from '@testing-library/react';
import type { FormEvent } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useContactForm } from '@/components/ContactForm/ContactForm.hooks';
import type { ContactActionResult } from '@/components/ContactForm/ContactForm.types';

const submitContactMessage = vi.hoisted(() => vi.fn());

vi.mock('@/app/actions/contact', () => ({ submitContactMessage }));

const submitEvent = () => ({ preventDefault: vi.fn() }) as unknown as FormEvent<HTMLFormElement>;

const fillValidValues = (result: { current: ReturnType<typeof useContactForm> }) => {
  const set = (name: string, value: string) =>
    act(() => {
      result.current.handleChange({
        target: { name, value },
      } as React.ChangeEvent<HTMLInputElement>);
    });

  set('name', 'Ada Lovelace');
  set('email', 'ada@example.com');
  set('message', 'I would like a showcase website for my analytical engine.');
};

describe('useContactForm', () => {
  beforeEach(() => {
    window.localStorage.clear();
    submitContactMessage.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('ignores a response that lands after the visitor reset the form', async () => {
    let release: (value: ContactActionResult) => void = () => {};
    submitContactMessage.mockImplementation(
      () =>
        new Promise((resolve) => {
          release = resolve;
        })
    );
    const onSuccess = vi.fn();
    const { result } = renderHook(() => useContactForm({ onSuccess }));

    fillValidValues(result);
    act(() => {
      void result.current.handleSubmit(submitEvent());
    });
    await waitFor(() => expect(result.current.status).toBe('submitting'));

    // The visitor clears the form before the request settles.
    act(() => result.current.reset());
    await act(async () => {
      release({ status: 'success' });
    });

    expect(result.current.status).toBe('idle');
    expect(result.current.values.name).toBe('');
    expect(onSuccess).not.toHaveBeenCalled();
    expect(window.localStorage.getItem('gocosmic.contactSubmissions')).toBeNull();
  });

  it('ignores a failure that lands after a reset', async () => {
    let fail: (reason: Error) => void = () => {};
    submitContactMessage.mockImplementation(
      () =>
        new Promise((_resolve, reject) => {
          fail = reject;
        })
    );
    const { result } = renderHook(() => useContactForm({}));

    fillValidValues(result);
    act(() => {
      void result.current.handleSubmit(submitEvent());
    });
    await waitFor(() => expect(result.current.status).toBe('submitting'));

    act(() => result.current.reset());
    await act(async () => {
      fail(new Error('offline'));
    });

    expect(result.current.status).toBe('idle');
    expect(result.current.formError).toBeNull();
  });

  it('accepts a new submission once the previous one settled', async () => {
    submitContactMessage.mockResolvedValue({ status: 'success' } satisfies ContactActionResult);
    const { result } = renderHook(() => useContactForm({}));

    fillValidValues(result);
    await act(async () => {
      await result.current.handleSubmit(submitEvent());
    });
    expect(result.current.status).toBe('success');

    act(() => result.current.reset());
    fillValidValues(result);
    await act(async () => {
      await result.current.handleSubmit(submitEvent());
    });

    expect(submitContactMessage).toHaveBeenCalledTimes(2);
    expect(result.current.status).toBe('success');
  });

  it('keeps the confirmation when the onSuccess callback throws', async () => {
    submitContactMessage.mockResolvedValue({ status: 'success' } satisfies ContactActionResult);
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const onSuccess = vi.fn(() => {
      throw new Error('analytics is down');
    });
    const { result } = renderHook(() => useContactForm({ onSuccess }));

    fillValidValues(result);
    await act(async () => {
      await result.current.handleSubmit(submitEvent());
    });

    expect(result.current.status).toBe('success');
    expect(result.current.formError).toBeNull();
    expect(submitContactMessage).toHaveBeenCalledTimes(1);
    expect(errorSpy).toHaveBeenCalled();
  });
});
