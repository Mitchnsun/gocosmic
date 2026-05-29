'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { ServiceCard } from './ServiceCard';
import { SERVICE_DEFINITIONS } from './ServicesGrid.constants';

export function ServicesGrid() {
  const t = useTranslations('homepage');
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const services = SERVICE_DEFINITIONS.map((def) => ({
    ...def,
    title: t(`services.${def.id}.title`),
    description: t(`services.${def.id}.description`),
    features: t.raw(`services.${def.id}.features`) as string[],
    link: { href: def.href, label: t('services.learnMore') },
  }));

  return (
    <section id="services" aria-labelledby="services-heading" className="w-full py-16">
      <div className="mb-12 max-w-7xl md:px-8">
        <p className="text-aerospace mb-4 flex items-center gap-2 font-mono text-sm font-medium tracking-widest uppercase">
          <span className="bg-aerospace h-2 w-2 rounded-full" aria-hidden="true" />
          {t('services.eyebrow')}
        </p>
        <h2 id="services-heading" className="text-ghost text-4xl font-extrabold sm:text-5xl lg:text-6xl">
          {t('services.title')}
        </h2>
        <p className="mt-4 max-w-2xl text-lg text-slate-400">{t('services.subtitle')}</p>
      </div>

      <div className="max-w-7xl md:px-8">
        <ul className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4 lg:gap-8">
          {services.map((service, index) => (
            <ServiceCard
              key={service.id}
              service={service}
              index={index}
              staggerDelay={100}
              animationDuration={600}
              reducedMotion={reducedMotion}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}
