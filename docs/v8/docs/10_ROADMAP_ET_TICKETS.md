# 10 — Lots d'exécution ordonnés : accélération sans SaaS métier

**R0 — Reconnaissance différentielle (POLIVIA seulement)** : lire état durable/branches/CI, choisir dépôt canonique, lister intégrations réelles. Conserver toutes preuves précédentes valides, n'auditer que dérive.

**R1 — Design & architecture de site** : modèle SiteSpec, brief métier, URLMap/IntentMap/LinkGraph, templates sectoriels réellement distincts, composants sûrs, licence médias, design V5 POLIVIA inchangé.

**R2 — SEO by construction** : centraliser meta/canonical/robots/sitemap/redirects, crawler post-build, règles de maillage, données structurées pertinentes, staging protégé et indexabilité prod.

**R3 — Expérience premium** : Puck pilote, responsive, Motion accessible, bibliothèques composants, trois métiers, chemins conversion, tests réels des formulaires et email.

**R4 — Flux commercial & usine** : lead Frappe interne, devis/contrat, Stripe TEST, commandes durables, preview, versions, validation client, construction, QA et staging.

**R5 — Automatisation n8n** : uniquement workflows périphériques : alertes, rapports, onboarding, support, GSC quand OAuth consent, relances consenties ; réutilisation isolée de l'existant.

**R6 — Recette complète** : matrice par site, CI gating P0, reviewer indépendant, Browser/SEO scans, mobile réel si disponible, security, RGPD, rollback et restauration.

**R7 — Pilote** : trois démonstrateurs originaux, une migration démontrée avec redirections, un parcours complet staging, coûts unitaires, incident recovery.

**R8 — Production contrôlée** : approbations juridiques/commerciales, tarifs définitifs, GO propriétaire, canary, monitoring J+7/14/30, apprentissage sans refonte illimitée.

**Plus tard (NON V8)** : logiciels métiers, CRM client complet, LMS, ERP, SaaS verticaux, marketplace. Aucun worker ne doit les intégrer dans le chemin critique ou dans les plans marketing V8.

Chaque lot : issue/PR, commit, owner, dépendances, tests, reviewer, preuves, coût, critères sortants et prochaine tâche. Ne pas relancer les audits globaux systématiquement.
