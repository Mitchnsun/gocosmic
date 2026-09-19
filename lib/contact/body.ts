/**
 * Reads a request body as text while enforcing a hard byte budget.
 *
 * `Content-Length` cannot be trusted — a client may omit it or use chunked
 * transfer encoding — so the bytes are counted as they arrive and the stream is
 * cancelled as soon as the budget is exceeded, before anything is parsed.
 *
 * @param request - Incoming request.
 * @param maxBytes - Maximum number of bytes accepted.
 * @returns The decoded body, or `null` when it exceeds `maxBytes`.
 */
export const readBoundedText = async (request: Request, maxBytes: number): Promise<string | null> => {
  const stream = request.body;

  // Some runtimes (and jsdom) expose no body stream: fall back to buffering,
  // then apply the same budget to the decoded bytes.
  if (!stream) {
    const text = await request.text();
    return new TextEncoder().encode(text).length > maxBytes ? null : text;
  }

  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    if (!value) continue;

    size += value.byteLength;
    if (size > maxBytes) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }

  const body = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }

  return new TextDecoder().decode(body);
};
