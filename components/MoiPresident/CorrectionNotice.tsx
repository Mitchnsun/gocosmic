import type { CorrectionProps } from './MoiPresident.types';

/**
 * A correction (« mise au point ») ordered by the Commission des sondages, at the top of the presentation page and
 * of the legal notice: an orange frame, the one accent of the zone.
 */
export function CorrectionNotice({ title, date, text, lang }: CorrectionProps) {
  return (
    <section
      aria-labelledby="correction-title"
      className="border-aerospace bg-surface flex flex-col gap-3 rounded-2xl border p-6 sm:p-8">
      <p className="text-aerospace-ink text-2xs font-mono tracking-[0.16em] uppercase">{date}</p>
      <h2 id="correction-title" className="font-display text-xl font-semibold tracking-[-0.01em]">
        {title}
      </h2>
      <p lang={lang} className="text-fg leading-relaxed whitespace-pre-line">
        {text}
      </p>
    </section>
  );
}
