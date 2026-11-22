# R0 — Reconnaissance différentielle (2026-11-20)

Constat factuel, pas une nouvelle roadmap. Relit à chaque reprise avant de ré-auditer quoi que ce soit en entier.

## Dépôt canonique : trois rôles distincts, pas un doublon à trancher

Trois dépôts candidats ont été inspectés (remote, `CLAUDE.md`, structure, derniers commits) :

| Dépôt | Remote | Rôle réel |
|---|---|---|
| **`polivia-site`** (ce dépôt, branche `da-validee`) | `SGNG21/polivia-site` | **Site commercial POLIVIA** — la vitrine de l'agence elle-même. Vite + React 19 + Three.js, SSR prerender maison, zéro backend. Pas de `CLAUDE.md` avant ce commit. |
| `<repos>/DigitalOS-v0.1` | `SGNG21/DigitalOS` | L'« usine » V7 : gouvernance, standards, agents, templates, pilotes (`00_Foundation` … `13_Pilots`). C'est le système qui *fabrique* des sites clients, pas le site POLIVIA. A son propre `CLAUDE.md`. Vérifié : aucune mention d'ICOS dans sa documentation — DigitalOS n'est pas ICOS sous un autre nom, et n'est donc pas automatiquement hors périmètre à ce titre ; il reste cependant **hors du périmètre actif de cette session**, qui porte sur le site commercial POLIVIA. |
| `<repos>/pilot-004-site-test-du-sol-au-toit` | `SGNG21/pilot-004-site-test-du-sol-au-toit` | Un site pilote produit *par* DigitalOS pour un métier de couverture/rénovation (« Du sol au toit »). Artefact de sortie, pas une plateforme. |

**Conclusion** : `polivia-site` est le dépôt canonique pour le travail de cette session, parce que
c'est le « site commercial POLIVIA » explicitement nommé en tête du périmètre actif de la directive V8,
parce que c'est le dépôt ouvert dans cette session (branche `da-validee`, travail artistique en cours sur
la scène 3D « L'Atelier »), et parce que DigitalOS/pilot-004 répondent à un rôle différent (usine
générique vs. pilote métier) qu'aucune instruction reçue ne demande d'ouvrir aujourd'hui. Si un prochain
lot porte sur la « Site Factory » générique plutôt que sur le site POLIVIA, DigitalOS-v0.1 est le dépôt
à ouvrir — pas celui-ci.

## Écart V7 → V8, tel qu'observé dans `polivia-site`

Le dossier V8 ajoute trois instruments obligatoires (matrice de réception, schéma de preuve JSON, gates
documentées) et une discipline anti-fausse-promesse. Aucun des deux n'existait dans ce dépôt avant ce
commit — ni sous forme V7, ni sous forme V8. Ce qui existait déjà, en revanche, respecte déjà l'esprit
V8 sans l'avoir formalisé :

**Déjà conforme (vérifié, pas supposé) :**
- SSR prerender par route (`scripts/prerender.mjs`, `src/entry-server.tsx`) → contenu réel dans le HTML
  servi aux robots, pas une coquille vide côté client.
- `sitemap.xml` et `robots.txt` générés au build, uniquement à partir des routes réellement indexables
  (`noindex` détecté par regex avant inclusion) — pas de liste figée à la main qui dérive du code.
- `llms.txt` déjà généré, avec une clause explicite « aucune position… n'est garantie ».
- `Seo.tsx` centralise canonical/OG/Twitter/JSON-LD pour toutes les pages ; `OrgSchema` omet
  délibérément `postalAddress`, `telephone`, `aggregateRating` tant qu'ils ne sont pas confirmés.
- `src/content/site.ts` : aucune donnée inventée. Téléphone, photo du fondateur, captures de projets
  sont des `null` explicites avec commentaire de ce qui manque, pas des placeholders déguisés en faits.
- Navigation et footer utilisent de vrais `<a href>`/`<Link href>` ; chaque page du site est atteignable
  depuis le footer, présent sur toutes les pages via le layout partagé.
- `QuoteForm.tsx` ne prétend jamais avoir livré un message qu'il n'a pas livré : sans
  `VITE_FORM_ENDPOINT`, il ouvre un `mailto:` prérempli plutôt que d'afficher un faux succès.

**Corrigé pendant cette reconnaissance :**
- Incohérence canonical/sitemap sur la page d'accueil : `Seo.tsx` produisait `https://polivia.fr`
  (sans `/` final) alors que `sitemap.xml` déclarait `https://polivia.fr/`. Corrigé dans
  `src/components/Seo.tsx:19`, revérifié par rebuild (`dist/index.html` montre maintenant
  `<link rel="canonical" href="https://polivia.fr/">` et `og:url` identique).

**Manquant, avec impact gate réel (voir `matrices/RECEPTION_POLIVIA_SITE.csv`) :**
- `Q157`/`Q158` (P0, module `RGPD_LEGAL`) **FAIL** : `/mentions-legales` et `/confidentialite` sont des
  stubs (`src/pages/Stub.tsx`), `noindex`, honnêtes sur leur état, mais sans contenu juridique réel.
  Bloque toute mise en production tant qu'ils ne sont pas rédigés avec de vraies données (forme
  juridique, SIRET/immatriculation si applicable, hébergeur, responsable de traitement) — données que
  cette session n'invente pas.
- `Q145`/`Q185` (P0, modules `CONVERSION`/`EMAIL_DOMAINE`) **BLOCKED** : le formulaire de devis n'a pas
  de `VITE_FORM_ENDPOINT` configuré dans cette session ; seul le repli `mailto:` est vérifiable ici.
- `Q021`/`Q036` (P0/P1, module `ARBO_URLS`/`INDEXABILITE`) **BLOCKED** : `dist/404.html` existe et
  `NotFound.tsx` rend un vrai contenu 404, mais `vite preview` répond `200` sur une URL inexistante
  (repli SPA du serveur de dev) — le vrai code HTTP en environnement Vercel n'a pas été vérifié en
  l'absence de déploiement.
- Tout le reste de la matrice (221 lignes sur 242) reste `UNKNOWN` : CMS/Puck, Frappe, n8n, Stripe,
  Search Console, accessibilité testée, performance mesurée en conditions réelles, sécurité (CSP/HSTS),
  monitoring — rien de tout cela n'existe encore dans ce dépôt. Ce n'est pas une régression : ces
  briques ne font pas partie de ce qui a déjà été construit ici, et `UNKNOWN` est le statut honnête tant
  qu'elles ne sont pas vérifiées, pas `FAIL`.

## Complément du 2026-11-20 (deuxième passe) : paysage complet des dépôts "Polivia"

`gh repo list SGNG21` révèle un quatrième candidat non trouvé localement : **`SGNG21/Polivia`**
(majuscule), un Next.js créé et poussé en un seul geste le 2026-11-09 (2 commits, jamais retouché
depuis), déployé sur `polivia-nu.vercel.app` ("POLIVIA — Studio digital premium"). C'est une tentative
V1 parallèle et abandonnée — même discipline anti-fausse-promesse que ce dépôt (mentions légales à
placeholders, formulaire qui refuse honnêtement en 503 sans clé Resend), mais aucune activité depuis
sa création. **Ce n'est pas le dépôt canonique** : `polivia-site` reste le seul avec une direction
artistique validée et un travail en cours. Un repo jetable analogue existe aussi
(`SGNG21/clikeco-polivia-preproduction`, 2 commits, 2026-11-02). Ne pas les toucher sans décision
explicite du propriétaire (archiver, rediriger ou laisser tels quels).

`vercel project ls` confirme par ailleurs que des sites clients réels existent déjà en production sous
le même compte, dont cinq correspondent exactement aux projets listés (avec `liveUrl: null`) dans
`src/content/site.ts` : La Belle Intendance, LDS Rénov, Taxi St-Julien, Éditions du Mécène, VS Agri.
Vérifiés un par un (HTTP 200 + `<title>` correspondant) puis renseignés dans `src/content/site.ts` —
voir le commit de ce lot. Deux clients réels supplémentaires (`benelec.vercel.app`, `auto-charge-89.fr`)
et un salon de coiffure (`la-pause-coiffure.vercel.app`, qui n'est PAS "Institut de Charlène" malgré la
ressemblance de secteur — aucune mention de Charlène sur le site) existent côté Vercel mais n'ont pas
d'entrée dans `projects` : à ajouter seulement si le propriétaire confirme qu'ils doivent apparaître en
réalisation POLIVIA.

## Prochains tickets indépendants identifiés (non commencés, par ordre de dépendance la plus faible)
1. Rédiger les mentions légales et la politique de confidentialité réelles — **bloqué sur des données
   que seul le propriétaire peut fournir** (forme juridique exacte, immatriculation le cas échéant,
   hébergeur, adresse de correspondance publiable).
2. Provisionner `VITE_FORM_ENDPOINT` (Supabase Edge Function ou équivalent) pour sortir le formulaire du
   mode `mailto:` de repli.
3. Vérifier le vrai code 404 et la cohérence HTTPS/www sur un déploiement staging réel (nécessite un
   déploiement, donc un accord explicite avant de le lancer).
