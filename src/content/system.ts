/**
 * The acquisition system, in seven stages.
 *
 * This is the single source for the hero's seven blades, the explanatory
 * section and the internal linking — so the sculpture and the prose can never
 * drift apart. Each stage states a plain benefit, never a ranking promise.
 */
export type Stage = {
  key: string;
  name: string;
  claim: string;
  body: string;
  /** What the client actually receives at this stage. */
  output: string;
};

export const STAGES: Stage[] = [
  {
    key: 'audit',
    name: 'Audit',
    claim: 'On regarde où partent vos demandes',
    body: 'Votre visibilité actuelle, ce que tapent vos clients, ce que captent vos concurrents sur votre zone. On part de faits, pas d’impressions.',
    output: 'Un relevé écrit de votre situation de départ',
  },
  {
    key: 'strategie',
    name: 'Stratégie',
    claim: 'On décide quoi viser, et dans quel ordre',
    body: 'Toutes les requêtes ne se valent pas. On choisit celles qui amènent le travail que vous voulez vraiment, et on laisse tomber le reste.',
    output: 'Un plan priorisé, chiffré, discuté avec vous',
  },
  {
    key: 'site',
    name: 'Site',
    claim: 'On construit l’outil qui convertit',
    body: 'Un site rapide, clair, qui dit ce que vous faites et rend le contact évident. Conçu autour du parcours, pas autour d’un gabarit.',
    output: 'Votre site, dont vous êtes propriétaire',
  },
  {
    key: 'indexation',
    name: 'Indexation',
    claim: 'On s’assure que Google vous lit',
    body: 'Structure, données structurées, sitemap, Search Console. Un site invisible pour les moteurs est un site qui n’existe pas.',
    output: 'Vos pages indexées et suivies dans Search Console',
  },
  {
    key: 'conversion',
    name: 'Conversion',
    claim: 'On transforme la visite en demande',
    body: 'Appels en un geste, formulaires courts, preuves au bon endroit. Une visite qui repart sans vous contacter est une visite perdue.',
    output: 'Des parcours testés jusqu’à la prise de contact',
  },
  {
    key: 'mesure',
    name: 'Mesure',
    claim: 'On compte ce qui arrive réellement',
    body: 'Combien de visites, combien de demandes, venues d’où. Dans le respect du consentement, et sans tableau de bord décoratif.',
    output: 'Un point mensuel lisible, en français',
  },
  {
    key: 'optimisation',
    name: 'Optimisation',
    claim: 'On corrige ce qui freine',
    body: 'Les pages qui ne ramènent rien, les requêtes qu’on rate, les étapes où ça bloque. La mise en ligne n’est pas la fin du travail.',
    output: 'Des ajustements réguliers, et ce qu’ils ont changé',
  },
];
