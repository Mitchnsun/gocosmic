import type { NEWS_TIERS, PAGE_TIERS, UPDATE_TIERS } from '@/components/PricingSimulator/constants';
import type { TierKeyOf } from '@/components/PricingSimulator/PricingSimulator.types';

/** "Where are you?": no site yet, a site already, or a project outside the subscription. */
export type Situation = 'new' | 'existing' | 'custom';

/** "What do you want to do with it?", for a site that already exists. */
export type ExistingPlan = 'redo' | 'keep';

/** "Who will make the changes on your site?": the studio, or the client for news and opening hours. */
export type Editor = 'studio' | 'self';

export type DomainAnswer = 'no' | 'yes';

/** "How many pages do you want?": a step of the pages slider, or not known yet. */
export type PagesAnswer = TierKeyOf<typeof PAGE_TIERS> | 'unsure';

/** "How do your clients reach you?", several answers allowed. */
export type ContactChannel = 'email' | 'form' | 'booking';

/** "Do you want an email address in your own name?" */
export type EmailAnswer = 'yes' | 'team' | 'no';

/** "Do you publish news?": a step of the news slider, or none. */
export type NewsAnswer = TierKeyOf<typeof NEWS_TIERS> | 'none';

/** "How often does your information change?": once a year (included), or a step of the updates slider. */
export type UpdatesAnswer = 'yearly' | TierKeyOf<typeof UPDATE_TIERS>;

/** The visitor's answers, kept apart from the simulator: they are never sent. */
export interface GuideAnswers {
  situation: Situation | null;
  existingPlan: ExistingPlan | null;
  editor: Editor | null;
  ownDomain: DomainAnswer | null;
  pages: PagesAnswer | null;
  contact: ContactChannel[];
  email: EmailAnswer | null;
  news: NewsAnswer | null;
  updates: UpdatesAnswer | null;
}

/** Where the answers lead: a composition, or a conversation with the studio. */
export type GuideOutcome = 'compose' | 'contact' | 'quote' | null;
