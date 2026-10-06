import { SECTIONS } from './DesignSystemShowcase.copy';

/** Sticky table of contents from 1024 px, one mono link per section anchor. */
export function ShowcaseToc() {
  return (
    <nav aria-label="Design system sections" className="hidden lg:block">
      <ol className="sticky top-[calc(var(--header-height)+5rem)] flex flex-col gap-3">
        {SECTIONS.map(({ id, title }, index) => (
          <li key={id}>
            <a
              href={`#${id}`}
              className="text-fg-3 hover:text-fg text-2xs focus-visible:ring-aerospace-ink rounded-sm font-mono tracking-[0.16em] uppercase focus-visible:ring-2 focus-visible:outline-none">
              {String(index + 1).padStart(2, '0')} · {title}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
