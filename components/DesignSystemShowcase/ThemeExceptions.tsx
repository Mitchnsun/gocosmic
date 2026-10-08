import { ProjectCover } from '@/components/ProjectGrid/ProjectCover';
import { PROJECTS } from '@/data/projects';
import { primaryPill } from '@/design-system/pill';

import { EXCEPTIONS, SAMPLE } from './DesignSystemShowcase.copy';
import { ExceptionItem } from './ExceptionItem';

const COVERED = PROJECTS.filter((project) => project.cover);

/** Each element that keeps its colours whatever the theme, rendered with the reason in one line. */
export function ThemeExceptions() {
  return (
    <ul className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,15rem),1fr))] gap-4">
      <ExceptionItem {...EXCEPTIONS.button}>
        <button type="button" className={primaryPill()}>
          {SAMPLE.primary}
        </button>
      </ExceptionItem>
      <ExceptionItem {...EXCEPTIONS.embed}>
        {/* The light island gives the white frame its dark ink, as Google renders it. */}
        <div data-theme="light" className="border-line-2 rounded-xl border bg-white p-4">
          <p className="text-fg font-mono text-xs">calendar.google.com</p>
          <div className="bg-line mt-3 h-2 w-3/4 rounded-full" />
          <div className="bg-line mt-2 h-2 w-1/2 rounded-full" />
        </div>
      </ExceptionItem>
      <ExceptionItem {...EXCEPTIONS.covers}>
        <div className="grid w-full grid-cols-2 gap-2">
          {COVERED.map(({ slug, cover }) => (
            <div key={slug} className="border-line overflow-hidden rounded-xl border">
              <ProjectCover cover={cover && { ...cover, alt: `${slug} cover` }} title={slug} />
            </div>
          ))}
        </div>
      </ExceptionItem>
      <ExceptionItem {...EXCEPTIONS.island}>
        <div data-theme="dark" className="bg-bg text-fg border-line-2 rounded-xl border p-4 text-sm">
          data-theme=&quot;dark&quot;
        </div>
      </ExceptionItem>
    </ul>
  );
}
