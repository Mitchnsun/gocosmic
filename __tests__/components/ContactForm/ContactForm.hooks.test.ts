import { act, renderHook, waitFor } from '@testing-library/react';
import type { FormEvent } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useContactForm } from '@/components/ContactForm/ContactForm.hooks';

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
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('ignores a response that lands after the visitor reset the form', async () => {
    let release: (value: { ok: boolean; status: number }) => void = () => {};
    vi.stubGlobal(
      'fetch',
      vi.fn(
        () =>
          new Promise((resolve) => {
            release = resolve;
          })
      )
    );
    const onSuccess = vi.fn();
    const { result } = renderHook(() => useContactForm({ endpoint: '/api/contact', onSuccess }));

    fillValidValues(result);
    act(() => {
      void result.current.handleSubmit(submitEvent());
    });
    await waitFor(() => expect(result.current.status).toBe('submitting'));

    // The visitor clears the form before the request settles.
    act(() => result.current.reset());
    await act(async () => {
      release({ ok: true, status: 200 });
    });

    expect(result.current.status).toBe('idle');
    expect(result.current.values.name).toBe('');
    expect(onSuccess).not.toHaveBeenCalled();
    expect(window.localStorage.getItem('gocosmic.contactSubmissions')).toBeNull();
  });

  it('ignores a failure that lands after a reset', async () => {
    let fail: (reason: Error) => void = () => {};
    vi.stubGlobal(
      'fetch',
      vi.fn(
        () =>
          new Promise((_resolve, reject) => {
            fail = reject;
          })
      )
    );
    const { result } = renderHook(() => useContactForm({ endpoint: '/api/contact' }));

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
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200 });
    vi.stubGlobal('fetch', fetchMock);
    const { result } = renderHook(() => useContactForm({ endpoint: '/api/contact' }));

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

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(result.current.status).toBe('success');
  });
});
