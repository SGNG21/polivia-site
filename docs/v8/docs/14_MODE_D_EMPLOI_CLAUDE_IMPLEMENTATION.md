# 14 — Pour rendre les 242 contrôles effectivement opérationnels

## À ne pas faire
Ne pas importer 242 lignes dans un tableau de bord avec tout en vert. Ne pas déclarer toutes lignes PASS d'après un modèle, un screenshot ou un score Lighthouse. Ne pas remplacer les contrôles DigitalOS existants ; **les enrichir et les raccorder**.

## Ordre de câblage dans le vrai code
1. Découvrir les fonctionnalités/tests existants et les fichiers d'état persistants, **uniquement POLIVIA**.
2. Conserver les IDs `Q001`... de la matrice comme identifiants stables ; construire `site_id + release_SHA + checkpoint_id -> evidence`.
3. Trier en types : statique build (pages/meta/liens/robots), runtime staging (forms/TLS/HTTP), externe asynchrone (GSC/CrUX), manuel qualifié (design/juridique/droits).
4. Écrire des checks déterministes quand possible : crawler same-origin borné, SSR HTML checks, unit tests serveur, Playwright E2E, Lighthouse CI, axe-core, tests multi-tenant, GDPR network trace, DNS/TLS.
5. Rattacher au pipeline CI le rapport *complet*, par domaine, avec preuve SHA, tool version et date ; conserver `UNKNOWN` pour tout contrôle non exécuté, `BLOCKED` si intégration absente ; séparer `PRE_RELEASE` et `POST_LIVE` ainsi que `SITE_RELEASE` et `PLATFORM_RELEASE` (les preuves de plateforme versionnées se réutilisent sans inventer de nouvel audit).
6. Implémenter `release_gate.py` ou son équivalent TypeScript dans la vraie application, sans remplacer les contrôles déjà existants ; aucun P0 FAIL/UNKNOWN ne donne GO.
7. Pour les contrôles externes impossibles avant publication (`indexed Google`, terrain CrUX), conserver des statuts externes **post-publication** distincts et suivis. Ne pas les déclarer PASS a priori.
8. Reviewer indépendant sur chaque site, puis approbation release owner uniquement sur la version ciblée. Le chemin logiciel ne doit pas laisser un worker fusionner sa propre PR et autoriser sa publication.
9. Diff après modifications : relancer contrôles impactés + suite de non-régression transversale, sans refaire toute l'analyse d'infrastructure.

## Tâches immédiates pour Claude
1. Installer ce dossier dans la documentation POLIVIA sans écraser `CLAUDE.md` ni plugins en place.
2. Transformer les 16 work packages du fichier `contracts/WORK_PACKAGES_V8.json` en issues/PR dépendantes, en respectant les travaux déjà effectués.
3. Implémenter d'abord les contrôles `INDEXABILITE`, `MAILLAGE`, `CONVERSION`, `RGPD_LEGAL` et `PRODUCTION_QA`, avec preuves et révision indépendante.
4. Fournir une démo comparative des 3 sites et leur carte de maillage, puis une publication staging complète.
5. Tenir à jour les registres d'outils, coûts, décisions, tests et avancement ; ne pas faire de nouvelle roadmap si la tâche suivante est exécutable.
