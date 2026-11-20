# 09 — Certification d'un site : standard POLIVIA premium vérifiable

## Deux niveaux de critères : NO-GO et objectifs d'optimisation
- **P0** : site non publiable si preuve absente/FAIL ; inclut sécurité, tenant, DNS/HTTPS, formulaire réel, contenu juridiquement important, robots/canonical incohérents, navigation bloquée, faux avis/faits, erreurs critiques, sauvegarde/rollback obligatoire selon architecture, QA DigitalOS 12/12.
- **P1** : défaut sérieux à résoudre avant livraison standard sauf dérogation explicite, motivée, datée et acceptée par l'owner et reviewer indépendant. La matrice sépare les contrôles `PRE_RELEASE` (bloquants en absence de preuve ou dérogation explicite) et `POST_LIVE` (surveillance obligatoire après publication ; ne peuvent être prouvés avant). La plupart des vérifications SEO, contenus, performance, conversion et médias.
- **P2** : amélioration itérative, traçable, sans dégrader les P0/P1.
- Les seuils **QA DigitalOS ≥90/100** et **12/12 critiques** restent distincts de Lighthouse. Objectif mobile lab Lighthouse ≥90 sur sites standards ; un score basse variance est exigé avant d'afficher une certification, exemptions documentées selon dispositifs tiers obligatoires. **Un score élevé ne masque jamais un P0.**

## Conditions GO staging
- `SITE_SPEC` propre au client et versionnée, contenu utile authentifié, fiches métier, sitemap/URL map/link graph cohérents ; site build et preview ; tests unit/intégration/e2e, design revue, mobile/desktop, formulaires délivrés en test, DNS et données fake/sandbox ; exclusion des robots sur preview ; rollback staging testé.

## Conditions GO production (approbation humaine)
- Toutes les lignes P0 **applicables** de `matrices/RECEPTION_PAR_SITE.csv` ont une preuve PASS (ou N/A justifié, revu et autorisé). Aucun P0 fail/block/unknown.
- Release evidence validée par schéma ; adresse domaine final vérifiée, TLS, canonicals/robots/sitemap correspondants, ancien site redirigé si migration, facturation/contrat validés, RGPD adaptée, sauvegarde et rollback.
- Owner signe le scope/site/env/commit SHA exact. Le reviewer indépendant ne peut pas être le développeur du lot ; publication sur permissions minimales et canary quand adapté.
- **Indexabilité vérifiée avant GO**, mais « indexé dans Google » n'est pas un prérequis possible à démontrer le jour de la première mise en ligne ; contrôle après publication quand données disponibles, avec statut `PENDING_EXTERNAL` distinct.

## Statuts machine des critères
`UNKNOWN`, `PASS`, `FAIL`, `BLOCKED`, `NOT_APPLICABLE` (avec `na_reason` + approbation). Preuves : URL/trace/hash/log masqué, date ISO, commit, environnement, outil et version, reviewer. Ne jamais inventer un test PASS.

## Rapports de livraison
- Deux rapports distincts : (a) **compliance/QA** interne avec P0 et risques ; (b) **rapport client** intelligible, montrant services réalisés, résultats réels et limitations, sans chiffres de marketing fabriqués.
- Historique conservé : une certification est liée à une version/site précis ; modifications critiques invalident le passage correspondant jusqu'aux tests de régression.
