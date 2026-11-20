# 13 — Politique d'évolution : même exigence après livraison

## Classes de changement
- **C0 sécurité / paiement / domaine / indexabilité globale / consentement** : revue complète spécifique + contre-review indépendante + owner GO.
- **C1 contenu SEO stratégique / URL / maillage / preuve client / CTA / formulaire** : preuve métier, tests targeted SEO et regression, approval éditeur autorisé.
- **C2 présentation simple (sans impact accessibilité/SEO)** : tests visuels et a11y/perf ciblés, PR, publication soumise à rôle.
- **C3 automatisation n8n non critique** : test isolé, idempotency, budget, contrôle du destinataire, journal, rollback workflow.

## Boucle de gestion
1. Mesure sourcée → création de ticket avec site/tenant, URL, preuve et date.
2. Classification du risque + estimation coût/bénéfice et consentement de l'éditeur.
3. Version/branche isolée → tests ciblés ; élargir si impact transversal.
4. Review indépendante et accord propriétaire si nécessaire.
5. Déploiement contrôlé, observations, rollback si régression.
6. Rapport client distinguant **fait**, **hypothèse**, **recommandation** et **action terminée**.

## Règles SEO
- Pas de rotation automatique de milliers de titres, métadonnées ou pages de villes.
- Pas de changement d'URL sans 301/308 et mise à jour des liens/sitemaps/canonicals.
- Pas de promesse de classement ni d'indexation instantanée.
- Avant toute réécriture IA, validation factuelle des références, travaux et promesses de l'entreprise.
- Traiter Search Console comme source externe et asynchrone ; conserver un statut `PENDING_EXTERNAL` lorsqu'une page vient d'être publiée.

## Continuité et mémoire
- Journal de progrès Git et fichiers `docs/operations/PROJECT_STATE.md`, `DECISIONS.md`, `WORK_LOG.md`, `NEXT_ACTIONS.md`, `TOOLS_REGISTRY.md` ; pas de nouveau grand audit à chaque reprise.
- Chaque certification est liée à commit, environnement, version SiteSpec, heure et reviewer.
