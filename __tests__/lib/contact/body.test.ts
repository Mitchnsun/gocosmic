import { describe, expect, it } from 'vitest';

import { readBoundedText } from '@/lib/contact/body';

const post = (body: string) => new Request('https://www.gocosmic.dev/api/contact', { method: 'POST', body });

describe('readBoundedText', () => {
  it('returns the body when it fits the budget', async () => {
    await expect(readBoundedText(post('{"name":"Ada"}'), 1000)).resolves.toBe('{"name":"Ada"}');
  });

  it('returns null as soon as the budget is exceeded', async () => {
    await expect(readBoundedText(post('a'.repeat(101)), 100)).resolves.toBeNull();
  });

  it('counts bytes, not characters', async () => {
    // Each "é" is two bytes in UTF-8.
    await expect(readBoundedText(post('éé'), 3)).resolves.toBeNull();
    await expect(readBoundedText(post('éé'), 4)).resolves.toBe('éé');
  });

  it('ignores a falsified content-length header', async () => {
    const request = new Request('https://www.gocosmic.dev/api/contact', {
      method: 'POST',
      headers: { 'content-length': '10' },
      body: 'a'.repeat(500),
    });

    await expect(readBoundedText(request, 100)).resolves.toBeNull();
  });

  it('falls back to buffering when the runtime exposes no body stream', async () => {
    const withoutStream = { body: null, text: async () => 'payload' } as unknown as Request;

    await expect(readBoundedText(withoutStream, 100)).resolves.toBe('payload');
    await expect(readBoundedText(withoutStream, 3)).resolves.toBeNull();
  });
});
