/**
 * Single source of truth for every brand fact, price and proof on the site.
 * Nothing here may be invented: fields that are not yet confirmed are `null`
 * and the UI degrades gracefully rather than displaying a placeholder.
 */

export const brand = {
  name: 'POLIVIA',
  legalName: 'POLIVIA',
  domain: 'polivia.fr',
  url: 'https://polivia.fr',
  email: 'contact@polivia.fr',
  /**
   * TODO(validation): real number awaited. Set it once here and the phone CTA,
   * the mobile sticky bar and the schema.org telephone all light up together.
   * Format: '+33612345678'
   */
  phone: null as string | null,
  founder: 'Geoffrey Nozza',
  promise: 'Le digital du côté de ceux qui travaillent.',
  tagline: 'LE DIGITAL À SA JUSTE VALEUR',
  areas: [
    { code: '89', name: 'Yonne', seat: 'Auxerre' },
    { code: '06', name: 'Alpes-Maritimes', seat: 'Nice' },
  ],
  responseTime: '24 h',
} as const;

/** Pretty national display for a stored E.164 number. */
export function phoneDisplay(e164: string | null): string | null {
  if (!e164) return null;
  const national = e164.replace(/^\+33/, '0').replace(/\D/g, '');
  return national.match(/.{1,2}/g)?.join(' ') ?? null;
}

export const notice = {
  text: 'POLIVIA · On vous montre avant de vous vendre.',
  linkLabel: 'Auditer mon site gratuitement',
  href: '/audit-ia',
};

export const hero = {
  overline: 'LE DIGITAL DU CÔTÉ DE CEUX QUI TRAVAILLENT',
  title: ['Redevenez ', 'souverain', ' de votre digital'] as const,
  sub: 'Assez de payer trop cher pour un site qui ne travaille pas assez pour vous. On audite, on repense et on construit du premium.',
  foot: [
    { n: '01.', label: 'Audit gratuit' },
    { n: '02.', label: 'Maquette personnalisée' },
    { n: '03.', label: 'Vous gardez la main' },
  ],
} as const;

/**
 * Tarification — catalogue V7 validé (docs/v8/references OFFER_CATALOG.json,
 * `business_price_validated: true` pour les trois montants "yearly") et sa
 * présentation dans le prototype V5 (references/polivia-v5-signature).
 * Décision du propriétaire le 2026-11-20 : ce catalogue remplace l'ancien
 * modèle (forfait ponctuel + maintenance séparée).
 */
export type PricingTier = {
  slug: string;
  name: string;
  cap: string;
  yearly: number;
  monthly: number;
  yearlyValidated: boolean;
  monthlyValidated: boolean;
  body: string;
  includes: string[];
  featured?: boolean;
  setupFeeMonthly?: { amount: number; approved: boolean };
};

export const pricing: PricingTier[] = [
  {
    slug: 'essentiel',
    name: 'Essentiel',
    cap: 'Pour les indépendants',
    yearly: 49,
    monthly: 60,
    yearlyValidated: true,
    monthlyValidated: true,
    body: 'Le site qui vous sort du bricolage, hébergement et maintenance compris.',
    includes: ['Site vitrine premium', 'CRM simple', 'Devis et facturation', 'SEO technique', 'Hébergement & maintenance'],
  },
  {
    slug: 'croissance',
    name: 'Croissance',
    cap: 'Pour les entreprises qui grandissent',
    yearly: 80,
    monthly: 99,
    yearlyValidated: true,
    monthlyValidated: false,
    featured: true,
    body: 'Tout Essentiel, avec un suivi SEO local et des automatisations en plus.',
    includes: ['Tout Essentiel', 'CRM enrichi', 'SEO local avancé', 'Automatisations e-mail', 'Reporting et suivi'],
  },
  {
    slug: 'partenaire-360',
    name: 'Partenaire 360°',
    cap: 'Pour aller plus loin',
    yearly: 249,
    monthly: 329,
    yearlyValidated: false,
    monthlyValidated: false,
    setupFeeMonthly: { amount: 390, approved: false },
    body: 'Pilotage digital complet, avec un accompagnement stratégique suivi.',
    includes: ['Pilotage digital global', 'Accompagnement stratégique', 'Gestion Google Ads*', 'SEO et acquisition', 'Rencontre physique cadrée'],
  },
];

/**
 * Audit IA Express — prestation payante existante, distincte de l'audit
 * gratuit mis en avant en page d'accueil (ce dernier n'est pas encore
 * connecté à un vrai outil de mesure, voir `freeAudit`).
 */
export const audit = {
  slug: 'audit-ia',
  name: 'Audit IA Express',
  price: 390,
  body:
    'Une demi-journée sur votre activité : où partent vos demandes, ce que vos concurrents captent, et quelles tâches peuvent être automatisées utilement. Vous repartez avec un plan chiffré, que vous travailliez avec nous ou pas.',
  includes: [
    'Analyse de votre visibilité sur votre zone',
    'Relevé des demandes perdues et de leurs causes',
    'Cartographie des tâches automatisables',
    'Plan d’action chiffré et priorisé',
    'Restitution d’une heure, en direct',
  ],
} as const;

/**
 * Audit gratuit mis en avant en page d'accueil. Honnête sur son état réel :
 * pas de connecteur de mesure technique branché pour l'instant, donc pas de
 * faux score. Voir docs/v8/docs/03_SEO_INDEXATION_MAILLAGE.md.
 */
export const freeAudit = {
  eyebrow: '01 / LE DÉFI POLIVIA',
  title: ['Votre site actuel mérite peut-être mieux.', 'Votre entreprise, certainement.'] as const,
  body: 'Vous avez déjà un site ? Mettez-nous au défi. On mesure ce qui se passe réellement, on identifie les freins et on vous montre comment lui donner le niveau qu’il mérite.',
  points: ['Performance mobile', 'Référencement', 'Expérience client', 'Conversion'],
  aside: 'PAS DE FAUX SCORES. PAS DE PROMESSES MAGIQUES. DES FAITS, PUIS DES SOLUTIONS.',
  status: 'La mesure technique automatisée n’est pas encore connectée : un audit réel se fait aujourd’hui en direct, via le formulaire de devis.',
} as const;

/**
 * Projects POLIVIA has actually delivered. `shot` stays null until a real
 * screenshot exists — the UI renders a typographic plate instead of a fake
 * browser mockup, and never invents a metric.
 */
export type Project = {
  slug: string;
  name: string;
  sector: string;
  objective: string;
  body: string;
  shot: string | null;
  liveUrl: string | null;
};

export const projects: Project[] = [
  {
    slug: 'la-belle-intendance',
    name: 'La Belle Intendance',
    sector: 'Conciergerie et intendance',
    objective: 'Présence premium et prise de contact',
    body: 'Un site à l’image du service : haut de gamme, rassurant, orienté demande de prestation.',
    shot: null,
    liveUrl: 'https://la-belle-intendance.fr',
  },
  {
    slug: 'lds-renov',
    name: 'LDS Rénov',
    sector: 'Rénovation et bâtiment',
    objective: 'Vitrine et captation de chantiers',
    body: 'Mise en avant des réalisations, parcours pensé pour générer des demandes de devis.',
    shot: null,
    liveUrl: 'https://www.lds-renov.fr',
  },
  {
    slug: 'editions-du-mecene',
    name: 'Éditions du Mécène',
    sector: 'Édition, luxe B2B',
    objective: 'Image de marque d’exception',
    body: 'Un écrin numérique à la hauteur d’un éditeur haut de gamme et de ses campagnes.',
    shot: null,
    liveUrl: 'https://editions-du-mecene.vercel.app',
  },
  {
    slug: 'vs-agri',
    name: 'VS Agri',
    sector: 'Agricole',
    objective: 'Crédibilité et clarté de l’offre',
    body: 'Un site clair qui structure l’activité et met en confiance les partenaires.',
    shot: null,
    liveUrl: 'https://sas-vsagri.vercel.app',
  },
  {
    slug: 'institut-de-charlene',
    name: 'Institut de Charlène',
    sector: 'Institut de beauté',
    objective: 'Réservation et mise en valeur des soins',
    body: 'Une vitrine élégante qui valorise les soins et facilite la prise de rendez-vous.',
    shot: null,
    liveUrl: null,
  },
  {
    slug: 'taxi-st-julien',
    name: 'Taxi St-Julien',
    sector: 'Transport',
    objective: 'Réservation locale simplifiée',
    body: 'Un site direct, mobile d’abord, pensé pour l’appel et la réservation immédiate.',
    shot: null,
    liveUrl: 'https://www.saint-julien-taxi.fr',
  },
];

export const method = [
  {
    step: '01 / DÉCOUVRIR',
    name: 'On analyse.',
    body: 'Votre métier, votre site actuel et vos opportunités. Sans inventer de chiffres.',
  },
  {
    step: '02 / CONSTRUIRE',
    name: 'On vous montre.',
    body: 'Une vraie direction artistique à découvrir et modifier avant validation.',
  },
  {
    step: '03 / FAIRE GRANDIR',
    name: 'On reste.',
    body: 'Maintenance, visibilité et améliorations dans la durée, selon votre forfait.',
  },
] as const;

export const manifesto = {
  eyebrow: '08 / NOTRE MANIFESTE',
  title: ['Nous ne sommes rien ', 'sans vous.'] as const,
  body: 'Vous travaillez dur pour votre entreprise. Nous pensons que le numérique doit vous aider à avancer, pas vous enfermer dans des coûts absurdes et des contrats incompréhensibles.',
  quote: '« L’IA fait le travail. Le bon sens reste aux commandes. »',
  pillars: [
    { n: '01', name: 'Votre liberté', body: 'Votre domaine à votre nom. Vos données exportables. Des conditions lisibles.' },
    { n: '02', name: 'Un prix juste', body: 'Pas de frais cachés. Des prestations claires et des options annoncées.' },
    { n: '03', name: 'La fidélité se mérite', body: 'Des améliorations concrètes, de la transparence et un suivi réel.' },
  ],
} as const;

export const faq = [
  {
    q: 'Mon domaine et mes données restent-ils à moi ?',
    a: 'Oui : le nom de domaine reste à votre nom et vos contenus sont exportables sur simple demande. Les modalités précises de portabilité sont décrites dans le contrat de chaque offre.',
  },
  {
    q: 'Pourquoi des prix aussi accessibles ?',
    a: 'Nous mutualisons les composants techniques et automatisons les tâches répétitives, sans transiger sur la qualité de chaque site livré.',
  },
  {
    q: 'Puis-je conserver mon prestataire actuel ?',
    a: 'Oui. Vous pouvez préparer votre projet pendant votre engagement actuel. Nous ne lançons jamais une migration sans votre autorisation expresse.',
  },
  {
    q: 'Le devis en ligne engage-t-il à quelque chose ?',
    a: 'Non. Le formulaire envoie une demande, vous recevez une réponse humaine sous 24 h avec un prix, sans engagement de votre part.',
  },
] as const;

/** AI capabilities. `status` is enforced in the UI — nothing ships as 'live' without proof. */
export const ai = [
  {
    name: 'Audit d’automatisation',
    status: 'live' as const,
    body: 'Le relevé de ce qui vous coûte du temps et de ce qui peut être automatisé sans casser votre façon de travailler.',
  },
  {
    name: 'Relance des appels manqués',
    status: 'pilot' as const,
    body: 'Un SMS part quand vous ne pouvez pas décrocher, et la demande est qualifiée avant votre rappel. En test chez nous, pas encore livré en clientèle.',
  },
  {
    name: 'Automatisations métier',
    status: 'audit' as const,
    body: 'Devis, relances, prise de rendez-vous. Chiffrées au cas par cas après audit, jamais vendues sur catalogue.',
  },
];

export const commitments = [
  { k: 'Réponse', v: '24 h', body: 'À chaque demande, ouvrée ou non.' },
  { k: 'Sur-mesure', v: '100 %', body: 'Aucun thème acheté puis revendu.' },
  { k: 'Terrain', v: '89 · 06', body: 'On se déplace. Vous avez un interlocuteur, pas un ticket.' },
  { k: 'Propriété', v: 'Vous', body: 'Le site, le domaine et le contenu vous appartiennent.' },
];

/**
 * The relationship stance. POLIVIA is one person, and the site says so rather
 * than implying an agency floor that does not exist.
 *
 * `portrait` and `story` stay null until Geoffrey supplies a real photograph
 * and his own words: a fabricated founder biography is the one thing on this
 * page that would undo everything the section is trying to establish.
 */
export const founder = {
  name: 'Geoffrey Nozza',
  role: 'Fondateur de POLIVIA',
  /** Awaiting a real photograph. Until then the card is typographic. */
  portrait: null as string | null,
  story: [
    'J’ai commencé frigoriste. Un métier où l’on est jugé sur une chose : est-ce que ça marche quand le client rouvre la porte.',
    'Je suis ensuite passé à la vente, puis j’ai vendu des sites internet pour de grands groupes. J’ai vu de près ce qui s’y passe : un commercial qui promet, un client qui signe, et une production lointaine qui livre autre chose. Le client devient un numéro de dossier le jour de la signature.',
    'POLIVIA est née de ce refus. La personne qui vous écoute est celle qui construit, et celle qui répond encore six mois plus tard. L’exigence commerciale et l’exigence technique ne devraient jamais être deux services différents.',
  ] as string[],
} as const;

export const pact = {
  headline: 'Vous donnez tout pour votre entreprise. Nous en faisons autant pour votre projet.',
  closing:
    'Nous ne vous demandons pas d’être expert du digital — c’est notre métier. Nous vous demandons d’être engagé dans le vôtre.',
  stances: [
    {
      head: 'Vous ne devenez pas un numéro de dossier',
      body: 'Pas de commercial qui signe puis disparaît, pas de service de production lointain. La personne qui comprend votre métier au premier rendez-vous est celle qui construit votre site et qui décroche quand vous appelez six mois plus tard.',
    },
    {
      head: 'La qualité avant le volume',
      body: 'Nous limitons volontairement le nombre de projets menés en parallèle. Accumuler les contrats se paie toujours sur le travail livré, et ce n’est pas le métier que nous voulons faire.',
    },
    {
      head: 'Rien de piégeux',
      body: 'Le site, le nom de domaine et le contenu sont à vous, dès le premier jour. Pas de thème acheté puis revendu, pas de reconduction cachée, pas de contenu que vous ne pourriez pas emporter ailleurs.',
    },
    {
      head: 'Une exigence réciproque',
      body: 'Nous ne promettons pas le même résultat à toutes les entreprises : cela dépend de votre marché, de vos moyens et de vos ambitions. Nous nous engageons à chercher sérieusement, à mesurer, et à corriger. Une acquisition qui marche se construit à deux.',
    },
  ],
} as const;
