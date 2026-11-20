# 05 — Site Factory premium : chaîne reproductible et pas de « clone factory »

## Pipeline à implémenter
`intake vérifié → BusinessFacts → SEOIntentMap → URLMap → LinkGraph → BrandProfile → DesignDirection → SiteSpec (Zod) → édition Puck autorisée → Preview → client approval hash → build → crawl/test SEO + E2E → reviewer indépendant → staging certifié → GO propriétaire live → publish → observabilité → rapport J+7/30`.

## Contrats et droits
- Toutes sorties IA typées/validées serveur ; HTML arbitraire et JS généré bloqués sur runtime mutualisé ; pas d'assets externes non agréés ni URL donnant accès à l'intranet.
- Tenant strict sur contenu, média, cache, Host/domain mapping, logs, formulaires, liens, index, exports ; test croisé Tenant A/B.
- Droit domaine/identité validé avant DNS. Domain verification et émission HTTPS ; bascule canary et retour arrière sur la bonne version ; snapshots de contenu et DB.
- Événements persistants et idempotents : build/publish status, retries bornés, Dead Letter Queue, logs redacts, notifications client.

## SEO by construction (et non audit de dernière minute)
- Les nouveaux composants et le CMS doivent exposer titre, description, canonical, valeur SEO, nom/alt média, liens contextuels et état d'indexation.
- La validation d'une nouvelle page met à jour **avec cohérence** le sitemap, la navigation, le link graph, les breadcrumbs et les éventuelles redirections.
- Nouvelles pages en **draft** puis preview non indexée, puis publication approuvée ; jamais d'URL staging dans le sitemap prod.
- Contenus localisés uniquement si la réalité commerciale et la valeur distincte sont prouvées.

## Refonte/migration
- Avant : crawl source permis, inventaire URLs, preuves des top pages/recettes, téléchargement licences autorisées, stratégie URL mapping 1:1 où possible.
- Staging : redirections testables vers domaine final au cutover, comparatif de contenus SEO utiles, recherche de backlinks cassés et cross-links.
- À la bascule : HTTPS, 301, DNS, propriétaires, plans retour arrière des configs ; ne pas casser l'email du domaine en modifiant des DNS MX/SPF/DKIM/DMARC non requis.
- Après : inspecter GSC, trafic/erreurs, redirections, uptime, leads et demander correction si chute constatée.

## Projet client vs dépôt
- Sites standard : composants mutualisés, isolation tenant et thème/structure distincts ; coûts et mises à jour contrôlés.
- Cas sur-mesure : isolation repo/runtime si coût contractuel justifié, même recette qualité.
- Indépendance : les sites restent accessibles sans Claude Code et sans l'usine ; la publication n'est jamais autorisée par le worker qui a écrit le code.
