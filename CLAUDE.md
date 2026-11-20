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
- **Frappe CRM** et **n8n** : aucune trace dans ce dépôt (ni code, ni env), aucun MCP connecté cette
  session. Connecter l'un ou l'autre demande une URL + un jeton que seul le propriétaire détient —
  accès sensible, à ne configurer qu'avec son accord explicite et un scope minimal.
- **Stripe** : aucune clé, aucune intégration dans ce dépôt. TEST uniquement si/quand construit.
