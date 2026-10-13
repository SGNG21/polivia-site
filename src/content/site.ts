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
  promise:
    'Un site pro qui vous rend visible et vous rapporte des clients — sans jargon, sans engagement piégeux.',
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

export type Offer = {
  slug: string;
  name: string;
  kicker: string;
  price: { from?: boolean; amount: number; suffix?: string; then?: string };
  commitment?: string;
  body: string;
  includes: string[];
  featured?: boolean;
  audience: 'artisan' | 'pme' | 'both';
};

export const offers: Offer[] = [
  {
    slug: 'site-essentiel',
    name: 'Site Essentiel',
    kicker: 'Pour exister proprement et vite',
    price: { from: true, amount: 1490 },
    audience: 'artisan',
    body: 'Le site qui vous sort du bricolage : rapide, clair, trouvable, et conçu pour faire sonner le téléphone.',
    includes: [
      'Jusqu’à 5 pages sur-mesure, aucun thème revendu',
      'Rédaction des textes à partir de votre métier',
      'Référencement local de départ (89 ou 06)',
      'Mobile d’abord, chargement immédiat',
      'Formulaire de devis et appel en un geste',
    ],
  },
  {
    slug: 'site-sur-mesure',
    name: 'Site sur mesure',
    kicker: 'Pour prendre un cran d’avance',
    price: { from: true, amount: 2200 },
    audience: 'both',
    featured: true,
    body: 'Conception complète, sans gabarit. Pour les entreprises dont le site est le premier commercial.',
    includes: [
      'Direction artistique propre à votre entreprise',
      'Arborescence étendue, pages métiers et communes',
      'Photos et captures de vos réalisations mises en scène',
      'Structure de référencement local travaillée',
      'Mesure des demandes entrantes',
    ],
  },
  {
    slug: 'abonnement',
    name: 'Abonnement',
    kicker: 'Pour lisser l’investissement',
    price: { amount: 390, then: '69 €/mois' },
    commitment: 'Engagement 12 mois',
    audience: 'artisan',
    body: 'Le même site, payé au rythme de votre trésorerie. Hébergement, maintenance et retouches comprises.',
    includes: [
      '390 € à la commande, puis 69 €/mois',
      'Hébergement et nom de domaine inclus',
      'Maintenance et mises à jour incluses',
      'Retouches de contenu à la demande',
      'Vous restez propriétaire de votre contenu',
    ],
  },
];

export const maintenance = [
  {
    slug: 'serenite',
    name: 'Sérénité',
    price: 49,
    body: 'Le site reste en ligne, à jour et sauvegardé. On surveille, vous n’y pensez plus.',
    includes: ['Hébergement et sauvegardes', 'Mises à jour de sécurité', 'Surveillance de disponibilité', 'Assistance par e-mail'],
  },
  {
    slug: 'evolution',
    name: 'Évolution',
    price: 99,
    body: 'Tout Sérénité, plus du temps de travail chaque mois pour faire vivre le site.',
    includes: ['Tout l’abonnement Sérénité', 'Modifications de contenu mensuelles', 'Nouvelles pages au fil de l’activité', 'Point de performance trimestriel'],
  },
] as const;

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
    liveUrl: null,
  },
  {
    slug: 'lds-renov',
    name: 'LDS Rénov',
    sector: 'Rénovation et bâtiment',
    objective: 'Vitrine et captation de chantiers',
    body: 'Mise en avant des réalisations, parcours pensé pour générer des demandes de devis.',
    shot: null,
    liveUrl: null,
  },
  {
    slug: 'editions-du-mecene',
    name: 'Éditions du Mécène',
    sector: 'Édition, luxe B2B',
    objective: 'Image de marque d’exception',
    body: 'Un écrin numérique à la hauteur d’un éditeur haut de gamme et de ses campagnes.',
    shot: null,
    liveUrl: null,
  },
  {
    slug: 'vs-agri',
    name: 'VS Agri',
    sector: 'Agricole',
    objective: 'Crédibilité et clarté de l’offre',
    body: 'Un site clair qui structure l’activité et met en confiance les partenaires.',
    shot: null,
    liveUrl: null,
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
    liveUrl: null,
  },
];

export const method = [
  {
    name: 'On se rencontre',
    body: 'Sur place ou en visio. On regarde votre métier, votre zone, vos concurrents — et ce que vous cherchez vraiment à obtenir.',
    note: 'Sans engagement',
  },
  {
    name: 'On conçoit',
    body: 'Vous voyez la maquette avant la première ligne de code. On ajuste jusqu’à ce que ce soit juste.',
    note: null,
  },
  {
    name: 'On met en ligne',
    body: 'Site livré, référencement local en place, formulaires testés. Vous êtes trouvable et joignable.',
    note: null,
  },
  {
    name: 'On suit',
    body: 'On mesure les demandes entrantes et on corrige ce qui freine. Mois après mois.',
    note: 'Abonnements Sérénité et Évolution',
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
