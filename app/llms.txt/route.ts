import { toBookingEmbedUrl } from '@/components/BookingEmbed/BookingEmbed.utils';
import { buildLlmsIndex } from '@/lib/llms/llms-index';

// Built once per deployment, like the sitemap.
export const dynamic = 'force-static';

/** `/llms.txt`: the site summarised for AI assistants and agents (llmstxt.org). */
export function GET() {
  return new Response(buildLlmsIndex(toBookingEmbedUrl(process.env.NEXT_PUBLIC_GCAL_BOOKING_URL)), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
