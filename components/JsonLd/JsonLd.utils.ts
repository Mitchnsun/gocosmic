import { getLanguage } from '@/i18n/locales';

/*
 * The studio is declared at its Geneva base, while Annecy stays named in the
 * description and the served areas for local searches on the French side.
 */
export function getLocalizedLocalBusinessData(locale: string) {
  switch (getLanguage(locale)) {
    case 'fr': {
      return {
        description:
          'Studio web et mobile installé à Chêne-Bougeries, près de Genève. Sites et applications pour les artisans, associations et indépendants de Suisse romande et de Haute-Savoie, notamment à Annecy.',
        areaServed: ['Genève', 'Annecy', 'Haute-Savoie', 'Suisse romande'],
      };
    }
    case 'es': {
      return {
        description:
          'Estudio web y móvil con sede en Chêne-Bougeries, cerca de Ginebra. Sitios web y aplicaciones para artesanos, asociaciones y profesionales independientes de la Suiza romanda y la Alta Saboya, en particular en Annecy.',
        areaServed: ['Ginebra', 'Annecy', 'Alta Saboya', 'Suiza romanda'],
      };
    }
    case 'de': {
      return {
        description:
          'Web- und App-Studio in Chêne-Bougeries bei Genf. Websites und Apps für Handwerksbetriebe, Vereine und Selbstständige in der Westschweiz und in Hochsavoyen, insbesondere in Annecy.',
        areaServed: ['Genf', 'Annecy', 'Hochsavoyen', 'Westschweiz'],
      };
    }
    case 'it': {
      return {
        description:
          'Studio web e mobile con sede a Chêne-Bougeries, vicino a Ginevra. Siti e app per artigiani, associazioni e liberi professionisti della Svizzera romanda e dell’Alta Savoia, in particolare ad Annecy.',
        areaServed: ['Ginevra', 'Annecy', 'Alta Savoia', 'Svizzera romanda'],
      };
    }
    case 'en': {
      return {
        description:
          'Web and mobile studio based in Chêne-Bougeries, near Geneva. Websites and apps for craftspeople, associations and independents in French-speaking Switzerland and Haute-Savoie, including Annecy.',
        areaServed: ['Geneva', 'Annecy', 'Haute-Savoie', 'French-speaking Switzerland'],
      };
    }
  }
}

/** Steps of a breadcrumb trail as schema.org list items, numbered from 1. */
export const toItemList = (trail: { name: string; item: string }[]) =>
  trail.map((step, index) => ({ '@type': 'ListItem', position: index + 1, ...step }));
