import { toBookingEmbedUrl } from '@/components/BookingEmbed/BookingEmbed.utils';
import { buildLlmsFull } from '@/lib/llms/llms-full';

// Built once per deployment, like the sitemap.
export const dynamic = 'force-static';

/** `/llms-full.txt`: the text of every page in one file, for AI assistants and agents. */
export function GET() {
  return new Response(buildLlmsFull(toBookingEmbedUrl(process.env.NEXT_PUBLIC_GCAL_BOOKING_URL)), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
