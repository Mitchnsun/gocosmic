'use client';

import { ArrowUpRightIcon } from '@heroicons/react/24/outline';
import { useEffect, useRef, useState } from 'react';

import { cn } from '@/design-system/lib/utils';

import type { Service, ServiceColor } from './ServicesGrid.types';

/** Tailwind class map per token color. Mapping is required so Tailwind can
 *  statically detect every utility class used at build time. */
const iconColorMap: Record<ServiceColor, string> = {
  aerospace: 'text-aerospace',
  royal: 'text-royal',
  jungle: 'text-jungle',
  default: 'text-slate-300',
};

const borderColorMap: Record<ServiceColor, string> = {
  aerospace: 'border-l-aerospace',
  royal: 'border-l-royal',
  jungle: 'border-l-jungle',
  default: 'border-l-slate-500',
};

const hoverBorderColorMap: Record<ServiceColor, string> = {
  aerospace: 'hover:border-aerospace focus-within:border-aerospace',
  royal: 'hover:border-royal focus-within:border-royal',
  jungle: 'hover:border-jungle focus-within:border-jungle',
  default: 'hover:border-slate-300 focus-within:border-slate-300',
};

const glowShadowMap: Record<ServiceColor, string> = {
  aerospace: 'hover:shadow-[0_0_20px_rgba(255,79,0,0.3)]',
  royal: 'hover:shadow-[0_0_20px_rgba(120,81,169,0.3)]',
  jungle: 'hover:shadow-[0_0_20px_rgba(41,171,135,0.3)]',
  default: 'hover:shadow-[0_0_20px_rgba(148,163,184,0.25)]',
};

const bulletColorMap: Record<ServiceColor, string> = {
  aerospace: 'bg-aerospace',
  royal: 'bg-royal',
  jungle: 'bg-jungle',
  default: 'bg-slate-400',
};

interface ServiceCardProps {
  service: Service;
  index: number;
  staggerDelay: number;
  animationDuration: number;
  reducedMotion: boolean;
}

export function ServiceCard({ service, index, staggerDelay, animationDuration, reducedMotion }: ServiceCardProps) {
  const cardRef = useRef<HTMLLIElement>(null);
  const [visible, setVisible] = useState(false);
  const color = service.color ?? 'default';
  // eslint-disable-next-line security/detect-object-injection
  const iconColor = iconColorMap[color];
  // eslint-disable-next-line security/detect-object-injection
  const borderColor = borderColorMap[color];
  // eslint-disable-next-line security/detect-object-injection
  const hoverBorder = hoverBorderColorMap[color];
  // eslint-disable-next-line security/detect-object-injection
  const glow = glowShadowMap[color];
  // eslint-disable-next-line security/detect-object-injection
  const bullet = bulletColorMap[color];
  const delay = reducedMotion ? 0 : index * staggerDelay;

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    if (reducedMotion) {
      setVisible(true);
      return;
    }

    let timer: ReturnType<typeof setTimeout>;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            timer = setTimeout(() => setVisible(true), delay);
            observer.unobserve(el);
          }
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [delay, reducedMotion]);

  return (
    <li
      ref={cardRef}
      data-testid={`service-card-${service.id}`}
      className={cn(
        'group relative flex flex-col rounded-lg border border-slate-700 bg-slate-800/80 p-4 md:p-6',
        'border-l-2',
        borderColor,
        hoverBorder,
        glow,
        'transition-all duration-300 ease-in-out',
        'hover:scale-105 hover:bg-slate-700/80',
        'focus-within:outline-aerospace focus-within:outline-2 focus-within:outline-offset-2'
      )}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(12px)',
        transition: `opacity ${reducedMotion ? 0 : animationDuration}ms ease-out, transform ${reducedMotion ? 0 : animationDuration}ms ease-out, background-color 300ms ease-in-out, box-shadow 300ms ease-in-out, scale 300ms ease-in-out, border-color 300ms ease-in-out`,
      }}>
      <div
        data-testid={`service-icon-${service.id}`}
        className={cn(
          iconColor,
          'mb-4 inline-flex h-10 w-10 items-center justify-center transition-transform duration-300 ease-in-out',
          'group-hover:scale-110'
        )}
        aria-hidden="true">
        {service.icon}
      </div>

      <h3 className="text-ghost font-display text-xl font-semibold sm:text-2xl">{service.title}</h3>

      <p className="mt-3 text-base font-light text-gray-400">{service.description}</p>

      {service.features && service.features.length > 0 && (
        <ul className="mt-4 space-y-1.5" aria-label={`${service.title} features`}>
          {service.features.map((feature) => (
            <li key={feature} className="flex items-center gap-2 text-sm text-slate-400">
              <span className={cn('h-1.5 w-1.5 shrink-0 rounded-full', bullet)} aria-hidden="true" />
              {feature}
            </li>
          ))}
        </ul>
      )}

      {service.link && (
        <a
          href={service.link.href}
          className={cn(
            'mt-6 inline-flex w-fit items-center gap-1.5 text-sm font-medium underline-offset-4 hover:underline focus:underline focus:outline-none',
            iconColor
          )}
          aria-label={`${service.link.label} — ${service.title}`}>
          {service.link.label}
          <ArrowUpRightIcon className="h-4 w-4" aria-hidden="true" />
        </a>
      )}
    </li>
  );
}
