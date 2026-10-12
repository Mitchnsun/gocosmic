import { getMessages } from 'next-intl/server';

/**
 * Messages for a `NextIntlClientProvider`: only the listed top-level keys (`navigation`, `pricing`…) reach the
 * browser. The server holds every message, so each page declares the keys its client components read; a key
 * left out shows up as its raw path. A nested provider replaces its parent's messages, it does not add to them.
 */
export async function getClientMessages(namespaces: readonly string[]) {
  const messages = await getMessages();
  return Object.fromEntries(Object.entries(messages).filter(([key]) => namespaces.includes(key)));
}
