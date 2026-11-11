import type { AppRelease, Correction } from '@/data/moi-president';

/**
 * Made-up versions of Moi Président for the tests of its notice: no version is published yet, and these polls
 * are not real ones.
 */
export const RELEASES: AppRelease[] = [
  {
    version: '1.1.0',
    publishedOn: '2027-03-02',
    noticeUrl: 'https://www.commission-des-sondages.fr/notices/example-1.1.0.pdf',
    polls: [
      {
        institute: 'Institut A',
        sponsors: ['Journal B', 'Radio C'],
        fieldwork: { from: '2027-01-12', to: '2027-01-14' },
        sample: '1 000 inscrits, sur 1 100 personnes',
        question: 'Si le premier tour avait lieu dimanche prochain, pour qui voteriez-vous ?',
        marginOfError: 'Entre 1,4 et 3,1 points',
        noticeUrl: 'https://www.commission-des-sondages.fr/notices/example-poll.pdf',
      },
    ],
  },
  { version: '1.0.0', publishedOn: '2027-02-10', polls: [] },
];

export const CORRECTION: Correction = {
  date: '2027-04-12',
  text: { fr: 'Texte de la mise au point.', en: 'Text of the correction.' },
};
