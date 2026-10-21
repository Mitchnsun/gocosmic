import { STORY_MILESTONES } from '@/data/story';
import { AGENT_USAGE } from '@/lib/llms/llms.shared';
import { buildLlmsFull } from '@/lib/llms/llms-full';

import legal from '../../../messages/en/legal.json';

const BOOKING_URL = 'https://calendar.google.com/calendar/appointments/schedules/abc?gv=true';

describe('buildLlmsFull', () => {
  // Prices are formatted by `Intl`, with a non-breaking space after the currency code ("CHF 10").
  const text = buildLlmsFull(null).replaceAll('\u00a0', ' ');
  /** The simulator's options and their prices. */
  const options = text.slice(text.indexOf('### Add what you need'), text.indexOf('### To promote your business'));

  it('shares the opening, the regions and the contact details of llms.txt', () => {
    expect(text).toMatch(/^# Cosmic Studio\n\n> /);
    expect(text).toContain(AGENT_USAGE);
    expect(text).toContain('## Languages and regions');
    expect(text).toContain('## Contact\n\n');
    expect(text).not.toContain('Pick a 20-minute slot');
    expect(buildLlmsFull(BOOKING_URL)).toContain(`[Pick a 20-minute slot](${BOOKING_URL})`);
  });

  it('follows the order of the site, from the homepage to the terms of sale', () => {
    const headings = text.match(/^## .+$/gm);

    expect(headings).toEqual([
      '## Languages and regions',
      '## [Home](https://www.gocosmic.dev/en)',
      '## [Services](https://www.gocosmic.dev/en/services)',
      '## [Pricing](https://www.gocosmic.dev/en/pricing)',
      '## [Free mockup](https://www.gocosmic.dev/en/free-mockup)',
      '## [Projects](https://www.gocosmic.dev/en/projects)',
      '## [About](https://www.gocosmic.dev/en/about)',
      '## [Story](https://www.gocosmic.dev/en/story)',
      '## [Website design · Geneva, Annecy](https://www.gocosmic.dev/en/website-design-geneva-annecy)',
      '## [Création de site vitrine](https://www.gocosmic.dev/fr/creation-site-vitrine)',
      "## [Création d'application](https://www.gocosmic.dev/fr/creation-application)",
      '## [Refonte de site internet](https://www.gocosmic.dev/fr/refonte-site-internet)',
      '## [Site pour associations et clubs](https://www.gocosmic.dev/fr/site-internet-association)',
      '## [Site pour artisans](https://www.gocosmic.dev/fr/site-internet-artisan)',
      '## [Site pour indépendants](https://www.gocosmic.dev/fr/site-internet-independant)',
      '## Contact',
      '## [Terms of sale](https://www.gocosmic.dev/en/terms)',
    ]);
  });

  it('includes the homepage sections, with the code handover delay', () => {
    expect(text).toContain('### For people who already have a trade and no time to learn another.');
    expect(text).toContain('- **Craftspeople**: Carpenter, plumber');
    expect(text).toContain('The code is transferred to you after 36 months of subscription');
    expect(text).toContain('- **T-3 · Meeting · We get to know each other**: ');
    expect(text).toContain(
      '### A subscription, or a custom project.\n\n[See the four ways to work with us](https://www.gocosmic.dev/en/services#pricing)'
    );
    expect(text).toContain('Matthieu Compérat comes from Duingt');
  });

  it('prices the four ways to work with the studio', () => {
    expect(text).toContain('- **Subscription · Site, hosting and care · From €10 / CHF 10 / month**: ');
    expect(text).toContain('- **Guidance · Advice and design · Day rate**: ');
    expect(text).toContain('- **Custom · One-off project · quoted**: ');
    expect(text).toContain(
      '  - The code and the data belong to you once the project has been delivered and all its invoices paid in full'
    );
  });

  it('spells out both plans, including the second one the page only shows on its tab', () => {
    expect(text).toContain(
      '- **We take care of everything · €10 / CHF 10 / month**: You email us, we update your site. Included in the plan:'
    );
    expect(text).toContain(
      '- **You stay in control · €20 / CHF 20 / month · 1-year commitment**: You publish your news'
    );
    expect(text).toContain(
      '  - An editing space for your news and opening hours: You publish news or change your opening hours whenever you like'
    );
  });

  it('adds the copy the simulator only shows with the second plan', () => {
    expect(text).toContain(
      "With “You stay in control”: For everything you don't publish yourself: you email us your changes, and we put them online."
    );
    expect(text).toContain(
      'With “You stay in control”: Depending on your editing tool, we can use a specialised service'
    );
  });

  it('gives every option its price, its notes and the text of its info bubble', () => {
    expect(text).toContain(
      '- **A contact form · +€5 / +CHF 5 / month**: Visitors write to you from your site, and their messages land in your inbox. Without this option'
    );
    expect(text).toContain(
      '- **News published for you · with “We take care of everything” only, as “You stay in control” includes it · 1-year commitment**: '
    );
    expect(text).toContain('- **Website hosted in Switzerland · +€10 / +CHF 10 / month · Swiss versions only**: ');
    expect(text).toContain(
      '- **Managing your domain name · +€5 / +CHF 5 / month · required with “No, register one for me” · 1-year commitment**: '
    );
    expect(text).toContain('“Yes, I already have one”: You keep your domain name and your current email addresses.');
    expect(text).toContain(
      '- **An email address in your own name · +€15 / +CHF 15 / month · requires “Managing your domain name” · 1-year commitment**: For example contact@my-business.com, instead of a free address. An address in your own name'
    );
    expect(text).toContain(
      '- **Extra mailboxes · +€10 / +CHF 10 per mailbox / month · requires “An email address in your own name” · 1-year commitment**: '
    );
    expect(text).toContain(
      '- **Forwarding addresses (up to 5) · +€5 / +CHF 5 / month · requires “An email address in your own name” · 1-year commitment**: '
    );
    expect(text).toContain(
      '- **Detailed statistics (with a cookie banner) · +€5 / +CHF 5 / month · requires “Visit statistics” ·'
    );
    expect(options).not.toMatch(/monitoring/i);
  });

  it('lists every step of the sliders with its price, the articles apart from the content changes', () => {
    expect(text).toContain('  - 10 pages or more: +€40 / +CHF 40 or more / month');
    expect(text).toContain('- **Changes to your pages**: You email us your changes');
    expect(text).toContain('Your plan includes one update of your pages a year.');
    expect(text).toContain('A change is one request, and you can group several changes in it.');
    expect(text).toContain('  - As often as needed: +€250 / +CHF 250 / month');
    expect(text).toContain('  - 1 news item a week: +€100 / +CHF 100 / month');
    expect(text).toContain('  - 3 articles a week: +€250 / +CHF 250 / month');
    expect(options).not.toContain('in all');
    expect(text).toContain('#### More options');
  });

  it('describes the services page with its two plans, and the pricing page with its free offers and quoted services', () => {
    expect(text).toContain(
      'from €20 / CHF 20 a month, if you want to publish your news yourself. Add your options on the Pricing page: the monthly price shows up right away.'
    );
    expect(text).toContain('### Before we talk budget (Free, no commitment)');
    expect(text).toContain('### To promote your business (Outside the subscription · on a quote)');
    expect(text).toContain('- **Shops & bookings**: ');
    expect(text).toContain('#### What happens if I stop?\n\nJust send us an email');

    const services = text.indexOf('## [Services]');
    const pricing = text.indexOf('## [Pricing]');
    expect(text.indexOf('### Before we talk budget')).toBeGreaterThan(pricing);
    expect(text.indexOf('### Choose your plan')).toBeGreaterThan(pricing);
    expect(text.indexOf('### Four ways to work with us.')).toBeGreaterThan(services);
    expect(text.indexOf('### Four ways to work with us.')).toBeLessThan(pricing);
  });

  it('tells each case study in full, with its latest release when the page mentions it', () => {
    expect(text).toContain(
      "### [Coach'n Pulse](https://www.gocosmic.dev/en/projects/coachnpulse)\n\nSince 2016 · Updated: October 2026 · Sports coach · Grenoble · Website"
    );
    expect(text).toContain('Version 5.0.0 came out in October 2026, with a new design.');
    expect(text).toContain('It is still kept up to date: version 1.4.0 came out on 28 February 2026.');
    expect(text).toContain('- A private area where organisers enter the results');
    expect(text).toContain("Who it's for: An amateur choir in Haute-Savoie.");
  });

  it('includes the about, local and free mockup pages', () => {
    expect(text).toContain('- **A price on display**: The subscription starts at €10 / CHF 10 a month');
    expect(text).toContain('- **French-speaking Switzerland**: Vaud, Valais, Neuchâtel, Fribourg');
    expect(text).toContain('- **Then you decide**: The mockup arrives by email within 48 hours');
    expect(text).toContain('[See an example mockup](https://www.gocosmic.dev/en/projects/choeurdespaysdumontblanc)');
  });

  it('tells the story page milestone by milestone, each led by its date', () => {
    const story = text.slice(text.indexOf('## [Story]'), text.indexOf('## [Website design'));

    expect(story).toContain('Matthieu Compérat has been a developer since 2012 and set up his first business in 2016.');
    expect(story).toContain('- **Origins · Duingt**: Matthieu comes from Duingt, on the shores of Lake Annecy.');
    expect(story).toContain(
      '- **17 October 2016 · The EIRL is founded**: His sole proprietorship with limited liability'
    );
    expect(story).toContain('- **2025 · The Go Cosmic brand is created**\n');
    expect(story).toContain(
      "- **In progress · Affiliation with FER Genève**: Matthieu's Swiss sole proprietorship is being affiliated with FER Genève."
    );
    expect(story.match(/^- \*\*/gm)).toHaveLength(STORY_MILESTONES.length);
  });

  it('tells the showcase website page in French, with what is included, its options, delays and examples', () => {
    const page = text.slice(text.indexOf('## [Création de site vitrine]'), text.indexOf("## [Création d'application]"));

    expect(page).toMatch(/dès 10\s€ par mois, ou « Vous gardez la main », dès 20\s€ par mois/);
    expect(page).toContain('#### Compris dans les deux formules\n\n- Une page vitrine qui présente votre activité');
    expect(page).toContain('[Calculer mon prix](https://www.gocosmic.dev/fr/tarifs)');
    expect(page).toContain('- **La prise de rendez-vous en ligne**: Vos clients réservent un créneau');
    expect(page).toContain('- **Délais**: Comptez deux à trois semaines pour une page vitrine');
    expect(page).toContain('- **Propriété**: Vos textes, vos images et votre nom de domaine');
    expect(page).toContain('- [mcomper.at](https://www.gocosmic.dev/fr/projets/mcomperat): Un CV en ligne');
  });

  it('tells the app development page in French, with how a quoted project runs and the studio apps', () => {
    const page = text.slice(text.indexOf("## [Création d'application]"), text.indexOf('## [Refonte de site internet]'));

    expect(page).toContain('### Un projet sur devis, payé étape par étape.');
    expect(page).toContain('- Un paiement en plusieurs fois, à chaque étape du projet');
    expect(page).toContain("- L'organisation de l'application et les choix techniques");
    expect(page).toContain('- [Daily Fortune](https://www.gocosmic.dev/fr/projets/daily-fortune): ');
    expect(page).not.toMatch(/€|CHF/);
  });

  it('tells the website redesign page in French, with its two paths, the facts on leaving Wix or WordPress and their sources', () => {
    const page = text.slice(text.indexOf('## [Refonte de site internet]'), text.indexOf('## [Site pour associations'));

    expect(page).toMatch(/- \*\*Le refaire en abonnement\*\*: Un nouveau site dès 10\s€ par mois/);
    expect(page).toContain(
      '[Voir les quatre façons de travailler avec nous](https://www.gocosmic.dev/fr/services#pricing)'
    );
    expect(page).toContain('- **Un site Wix**: Il ne peut pas être hébergé ailleurs');
    expect(page).toContain('### Un site suivi depuis 2016, et refait en chemin.');
    expect(page).toContain('Sa version 5.0.0, sortie en octobre 2026, lui a donné un nouveau design.');
    expect(page).toContain(
      '- [Aide Wix : héberger un site Wix ailleurs (en anglais)](https://support.wix.com/en/article/exporting-or-embedding-your-wix-site-elsewhere)'
    );
    expect(page).toContain('Consultées le 21 octobre 2026.');
  });

  it('prices the example of each audience page line by line, with its total and commitment', () => {
    const associations = text.slice(
      text.indexOf('## [Site pour associations'),
      text.indexOf('## [Site pour artisans]')
    );
    const tradespeople = text.slice(
      text.indexOf('## [Site pour artisans]'),
      text.indexOf('## [Site pour indépendants]')
    );
    const freelancers = text.slice(text.indexOf('## [Site pour indépendants]'), text.indexOf('## Contact'));

    expect(associations).toMatch(
      /- Vous gardez la main: 20\s€\n- 2 à 4 pages: \+5\s€\n- Gestion de votre nom de domaine: \+5\s€/
    );
    expect(associations).toMatch(/- \*\*Total\*\*: 30\s€ \/ mois/);
    expect(associations).toContain('car il comprend : formule « Vous gardez la main », nom de domaine.');
    expect(tradespeople).toMatch(/- \*\*Total\*\*: 30\s€ \/ mois/);
    expect(freelancers).toMatch(/- \*\*Total\*\*: 25\s€ \/ mois/);
  });

  it('tells each audience page in French, with what is its own', () => {
    const associations = text.slice(
      text.indexOf('## [Site pour associations'),
      text.indexOf('## [Site pour artisans]')
    );
    const tradespeople = text.slice(
      text.indexOf('## [Site pour artisans]'),
      text.indexOf('## [Site pour indépendants]')
    );
    const freelancers = text.slice(text.indexOf('## [Site pour indépendants]'), text.indexOf('## Contact'));

    expect(associations).toContain('- **Les adhésions en ligne**: Pour un espace adhérents');
    expect(associations).toContain("- **Et si l'association arrête ?**: Il suffit de nous envoyer un e-mail");
    expect(associations).toContain("Aujourd'hui, c'est Matthieu qui met à jour tous les sites du studio");
    expect(associations).toContain('- [PSC Supersprint](https://www.gocosmic.dev/fr/projets/psc-supersprint): ');
    expect(tradespeople).toContain('Menuisier·ère, plombier·ère, électricien·ne, coiffeur·se, traiteur·se…');
    expect(tradespeople).toContain('- **Votre fiche Google Maps**: Vous continuez de gérer vous-même');
    expect(tradespeople).toContain(
      '- **Vous décidez ensuite**: Vous recevez la maquette par e-mail dans les 48 heures'
    );
    expect(tradespeople).not.toContain('/fr/projets/');
    expect(freelancers).toContain('Si votre profession encadre sa communication, dites-le nous');
    expect(freelancers).toContain('- **Une adresse e-mail à votre nom**: Par exemple contact@mon-entreprise.fr');
    expect(freelancers).toContain('- [mcomper.at](https://www.gocosmic.dev/fr/projets/mcomperat): ');
  });

  it('quotes the terms of sale word for word, and no other legal page', () => {
    for (const { title, body } of legal.legal.terms.sections) {
      expect(text).toContain(`### ${title}\n\n${body.join('\n\n')}`);
    }
    expect(text).not.toContain(legal.legal.privacy.intro);
    expect(text).not.toContain(legal.legal.legalNotice.intro);
  });

  it('leaves no markup or placeholder of the messages', () => {
    expect(text).not.toMatch(/<\/?(em|link)>|\{\w+\}/);
  });
});
