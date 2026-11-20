# CLAUDE.md — polivia-site

## Ce dépôt
Le site commercial de POLIVIA elle-même (pas un client, pas la "Site Factory"). Vite + React 19 +
wouter + Three.js, SSR prerenderé par route au build (`scripts/prerender.mjs`), déployé sur Vercel.
Zéro backend dans ce dépôt.

D'autres dépôts/déploiements portent le nom POLIVIA ou y ressemblent et ne sont PAS ce dépôt :
- `DigitalOS-v0.1` (`SGNG21/DigitalOS`) : l'usine générique qui fabrique des sites clients.
- `pilot-004-site-test-du-sol-au-toit` : un site pilote produit par cette usine.
- `SGNG21/Polivia` (Next.js, 2 commits, 2026-11-09, jamais retouché depuis) : une tentative V1 parallèle
  et abandonnée, déployée sur `polivia-nu.vercel.app`. **Ne pas la confondre avec ce dépôt** : ce dernier
  est actif (5 commits, direction artistique validée, travail en cours), l'autre non.

Voir `docs/v8/R0_RECONNAISSANCE.md` pour le détail de cette identification et l'écart V7/V8 constaté.

## Ordre des autorités
Permissions réellement applicables > `docs/v8/01_MISSION_CLAUDE_SITE_FIRST.md` (mandat V8) >
`docs/v8/POLIVIA_V7_MANDAT_EXCLUSIF_CLAUDE_SANS_ICOS.md` > ce fichier. En cas de contradiction,
documenter la décision plutôt qu'improviser.

## Règles non négociables
- **ICOS est hors périmètre total** pour ce dépôt : aucun audit, accès, migration ni dépendance.
- Aucune donnée commerciale inventée : téléphone, photo, avis, adresse, réalisation restent `null`/absents
  dans `src/content/site.ts` tant qu'ils ne sont pas confirmés par le propriétaire. Voir le commentaire
  en tête de ce fichier.
- Aucun secret, aucune migration de production, aucun achat, aucun déploiement live sans accord explicite.
- Avant de déclarer un contrôle `PASS` dans `docs/v8/matrices/RECEPTION_POLIVIA_SITE.csv`, le vérifier
  réellement (build, curl, lecture de code) et noter la preuve. `UNKNOWN` par défaut, jamais un `PASS`
  supposé.
- Reprise de session : lire ce fichier et `docs/v8/R0_RECONNAISSANCE.md` avant de ré-auditer quoi que ce
  soit en entier ; ne vérifier que l'écart depuis le dernier commit connu.

## Commandes utiles
```bash
pnpm run dev         # serveur de dev
pnpm run build       # typecheck + build client + SSR + prerender (sitemap.xml, robots.txt, llms.txt)
pnpm run typecheck
pnpm run preview     # sert dist/ localement (attention : son 404 est un repli SPA, pas le vrai code HTTP Vercel)
```

## Dossier V8
`docs/v8/` contient le référentiel qualité POLIVIA Site Factory V8 (242 contrôles, 50 P0, gates
GO/NO-GO) installé le 2026-11-20, plus son instanciation pour ce site précis
(`docs/v8/matrices/RECEPTION_POLIVIA_SITE.csv`, `URL_MAP_POLIVIA_SITE.csv`). Lire
`docs/v8/docs/09_GATES_ET_ACCEPTATION.md` avant toute déclaration de type "site prêt" ou "GO".

## Agents et skills POLIVIA (installés le 2026-11-20, issus du dossier V7)
`.claude/agents/` (8 : architecte, backend, design-reviewer, frontend, privacy-finance, qa-release,
security-reviewer, seo-growth) et `.claude/skills/polivia-*` (10 : crm, design, factory, finops,
motion, privacy, product, qa, security, seo) — fichiers d'instruction purs, aucune dépendance
technique installée avec eux. Assigner l'agent/skill correspondant au domaine du lot en cours ; un
rôle "reviewer" ne modifie jamais le code qu'il évalue. Rien n'existait avant cette installation dans
`.claude/` à part `settings.local.json`, donc rien n'a été écrasé.

## Désaccords connus entre les dossiers V7/V8 et le code réel — ne pas trancher seul
- **Direction artistique — TRANCHÉ et EXÉCUTÉ le 2026-11-20** : le propriétaire a regardé
  `POLIVIA_V5_APERCU_AUTONOME.html` (prototype copié dans ce dépôt sous
  `references/polivia-v5-signature/`) et confirmé que **cette direction — vert menthe `#d6fb78` /
  vert forêt très sombre `#131c17`, typographie éditoriale, hero avec showcase fictif, console
  d'audit, manifeste — est la cible**, et a demandé la refonte complète ("il faut tout construire,
  la V5 est une bonne base"). Exécuté dans la foulée : `src/styles.css` reprend le CSS du prototype
  (cascade identique, pas retraduit à la main), `src/content/site.ts` reprend sa structure de
  contenu avec les vrais faits POLIVIA, et les sections live sont `Hero`, `BrandMarquee`,
  `FreeAudit`, `Work` (preuve réelle plutôt que le comparateur fictif du prototype), `Pricing`,
  `Method`, `Faq`, `Manifesto` (voir `src/pages/Home.tsx`). Les anciennes sections noir/or
  (`Offers`, `Proof`, `Constat`, `System`, `AfterLaunch`, `AiBand`, `Pact`, `Commitments`,
  `FinalCta`) ont été supprimées, non référencées nulle part. **Restent explicitement à construire**
  (lots séparés, non commencés) : la section 05 "Le Studio POLIVIA" (configurateur multi-étapes
  avec aperçu live) et la section 06 "Déjà engagé ailleurs" (formulaire de transition concurrent).
  La scène 3D WIP de l'ancienne direction (`src/hero/HeroSignature.tsx`, `Machine.tsx`, `hero/lib/`,
  toujours non committée) a été laissée intacte dans l'arbre de travail sans être supprimée, sur
  demande explicite — elle n'est plus importée nulle part (`Home.tsx` ne l'utilise plus).
- **Tarifs — tranché le 2026-11-20 ("garde prix V7 pour l'instant")** : le propriétaire a demandé de
  garder les prix validés du dossier V7 (`contracts/OFFER_CATALOG.json` : 49€/12 mois, 60€/flex,
  80€/12 mois, seuls `business_price_validated: true`). `src/content/site.ts` → `maintenance.evolution`
  est passé de 99€ (GROWTH_FLEX, non validé) à **80€** (GROWTH_12, validé) ; `maintenance.serenite`
  restait déjà à 49€ (ESSENTIAL_12, validé), aucun changement nécessaire. **Non touché** : les prix des
  offres `offers` (Site Essentiel 1490€, Site sur mesure 2200€, Abonnement 390€+69€/mois) — ce sont des
  forfaits de construction ponctuels, un concept absent du catalogue V7 (qui ne couvre que l'abonnement
  mensuel récurrent) ; rien à y substituer sans invention. 60€ (ESSENTIAL_FLEX) n'a pas d'équivalent
  affiché aujourd'hui — à statuer si le propriétaire veut l'ajouter comme option flexible de Sérénité.

## État réel des outils (vérifié le 2026-11-20, pas supposé)
- **GitHub** : MCP indisponible cette session ; `gh` CLI opérationnel, authentifié `SGNG21` (scopes
  repo/workflow). L'utiliser pour tout travail GitHub tant que le MCP ne reconnecte pas.
- **Vercel** : CLI 54.18.6 installée (mise à jour dispo, 66.6.0), authentifiée `geoffreynozza-3139`. Ce
  dépôt n'a pas de `.vercel/` local (pas de link), mais le projet `polivia-site` existe côté Vercel et
  se déploie via l'intégration Git. Au moins 7 autres projets clients réels sont déployés sous ce compte
  (`la-belle-intendance.fr`, `lds-renov.fr`, `saint-julien-taxi.fr`, `editions-du-mecene.vercel.app`,
  `sas-vsagri.vercel.app`, `benelec.vercel.app`, `auto-charge-89.fr`) — vérifiés en ligne (HTTP 200,
  titres correspondants) le 2026-11-20. `src/content/site.ts` liste 5 de ces clients avec `liveUrl: null`
  alors que l'URL réelle existe désormais.
- **Supabase** : CLI non installée, aucun projet lié dans ce dépôt. `QuoteForm.tsx` est câblé pour y
  poster via `VITE_FORM_ENDPOINT`, mais la variable n'est configurée nulle part dans cette session.
- **n8n** : connecté le 2026-11-20 (instance `n8n.audit-ia-pro.fr`, projet personnel unique, 0 credential
  au départ). Workflow `POLIVIA — Intake formulaire site` créé, testé (3 cas synthétiques), **activé** —
  URL de prod `https://n8n.audit-ia-pro.fr/webhook/polivia-site-intake`, mais **inaccessible depuis
  l'extérieur** : un Basic Auth Caddy en amont de n8n répond 403 avant même d'atteindre le workflow.
  `VITE_FORM_ENDPOINT` ne peut donc pas être câblé tant que ce mot de passe applicatif n'est pas levé ou
  transmis — en dehors de ma main, à traiter avec le propriétaire. Trois workflows préexistants, inactifs,
  nommés "Workflow de preuve ICOS × n8n local" (17/11) : hors périmètre, non touchés.
- **Frappe CRM** et **ERPNext** : annoncés "déjà installés" par le propriétaire le 2026-11-20. Vérifié
  (`ToolSearch` sur "frappe erpnext crm") : **aucun MCP ni accès API pour l'un ou l'autre dans cette
  session**. Statut réel : **non vérifiable depuis cette session**, pas "non vérifié par oubli" — il
  manque une URL d'instance + un jeton, que je ne dois ni deviner ni demander à saisir moi-même (accès
  sensible, cf. `docs/v8/docs/06_FRAPPE_N8N_FACTURATION_SUPPORT.md` pour la politique déjà écrite). Pas
  de CRM concurrent à construire tant que ce point n'est pas résolu avec le propriétaire ; le payload du
  formulaire studio/devis (`src/sections/Studio.tsx`, `QuoteForm.tsx`) est déjà structuré pour pouvoir
  alimenter un futur pipeline `prospect → opportunité → devis` sans réécriture, le jour où l'accès existe.
- **Stripe** : aucune clé, aucune intégration dans ce dépôt. TEST uniquement si/quand construit.

## Politique de sélection des outils (ECC / Agentic Council / Superpowers)
Condensé du mandat du 2026-11-20, pour ne pas le relire en entier à chaque session :
- **Claude agit seul** sur tout problème simple ou déjà tranché — pas d'agent pour une tâche qu'un
  diff direct résout.
- **Agentic Council** (ciblé, jamais tous les rôles à la fois) uniquement pour une décision
  d'architecture majeure, un risque de sécurité/conformité critique, ou un choix technique difficile
  à défaire. Rôles utiles à POLIVIA : Architect, Artisan, Advocate, Tuner, Guardian, Cipher, Skeptic,
  Operator, Herald.
- **Superpowers** quand ses méthodes (TDD, debug systématique, brainstorming, revue de code) aident
  réellement — pas en symbole.
- **ECC** (plugin `ecc@ecc`, chargé cette session — 39 plugins / 836 skills / 138 agents au dernier
  `/reload-plugins`) : à mobiliser à la demande sur une tâche précise (build-fix, review, tests),
  jamais activé en bloc.
- Ne jamais lancer plusieurs frameworks d'orchestration en parallèle sur le même travail.
- Accord explicite du propriétaire requis avant : dépense, intervention sur une instance de
  production, migration destructive, suppression importante, changement majeur de permissions,
  données clients réelles dans un nouveau service, modification de Frappe/n8n/ERPNext déjà
  exploités, exposition réseau supplémentaire, changement substantiel des offres commerciales,
  publication publique.

## Site Factory — état (mis à jour le 2026-11-20)
- **Où** : moteur en construction dans un worktree isolé de Digitalos2,
  `~/Documents/Geoffrey Pro/repos/Digitalos2-factory-pilot` (branche locale `polivia/factory-pilot`,
  non poussée). La copie principale de Digitalos2 (branche `deploy/vercel`) et son `premium-starter`
  ne sont pas touchés : l'ancien pipeline et le cockpit en dépendent.
- **Défauts trouvés dans l'usine Digitalos2 existante** (à ne pas réutiliser tels quels) :
  monopage seulement ; `run-pipeline.mjs` réécrit le starter partagé à chaque run (aucune isolation
  par projet) ; `public/hero.jpg` et `og.jpg` sont des fichiers texte, pas des images (image cassée
  + og:image invalide, invisible pour le gate) ; `next@15.1.6` vulnérable ; données d'exemple avec
  téléphone/adresse d'apparence réelle et mention « Artisan certifié » inventée ; aucune
  persistance de job ni historique. Le cockpit simule l'avancement sans Supabase.
- **Cible du pilote** : `factory/` (moteur) + `factory/template/` (gabarit Next multi-pages) :
  brief validé → id stable → `projects/<id>/` (project.json + events.jsonl + spec + site isolé)
  → install → build → tests (liens, orphelins, canonicals, sitemap) → gate → Lighthouse → rapport,
  avec reprise des étapes échouées. Pilote = entreprise fictive marquée démo, domaine `.example`,
  aucun téléphone ni adresse de rue inventés.
- **CI polivia-site** : réelle depuis le 2026-11-20. Gate déterministe : PASS en CI. Lighthouse :
  premier run en échec, causé par un vrai bug d'hydratation en 404 sur les URLs `.html` (corrigé
  dans `src/main.tsx`) ; mesuré en local après correctif : perf 1, best-practices 1, SEO 1,
  a11y 0,96 sur accueil et contact. **Ouvert** : 23 couleurs de texte sous 4,5:1 dans la feuille V5,
  à corriger avant validation finale (un remplacement global abîmerait les sections sombres).
