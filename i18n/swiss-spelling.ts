/**
 * Messages in Swiss Standard German spelling, which writes `ss` where German writes `ß`.
 * Strings are rewritten at any depth, in objects and arrays alike; the structure is kept.
 */
export function toSwissSpelling<T>(messages: T): T {
  if (typeof messages === 'string') {
    return messages.replaceAll('ß', 'ss').replaceAll('ẞ', 'SS') as T;
  }
  if (Array.isArray(messages)) {
    return messages.map((item: unknown) => toSwissSpelling(item)) as T;
  }
  if (messages !== null && typeof messages === 'object') {
    return Object.fromEntries(Object.entries(messages).map(([key, value]) => [key, toSwissSpelling(value)])) as T;
  }
  return messages;
}
