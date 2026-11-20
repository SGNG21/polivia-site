# POLIVIA V7 — Mandat exclusif de construction par Claude Code Ultra

**Statut : instruction de cadrage complémentaire au dossier `POLIVIA_MISSION_CLAUDE_ULTRA_V7_DOSSIER_COMPLET_2026-11-19.zip`.**

## 1. Périmètre impératif

Construire **POLIVIA V7**, société logicielle autonome de vente, création, livraison et exploitation de sites internet premium. Le développement est dirigé directement par Claude Code Ultra et ses workers/agents autorisés. Les opérations métier du futur SaaS doivent fonctionner sans session Claude Code connectée.

**ICOS est explicitement hors périmètre** : ne pas auditer, lire ses secrets, explorer son VPS pour ICOS, modifier ses fichiers/services, créer un adaptateur, lui déléguer une mission, utiliser OmniRoute ou prévoir des travaux d'intégration dans cette phase. Les éventuelles références historiques dans le paquet V7 sont documentaires seulement. Ne pas bloquer POLIVIA sur ICOS. Ne pas supposer que POLIVIA dispose d'un VPS ou de ressources dédiées : le vérifier.

**Ordre des instructions en cas de conflit :** consignes de sécurité et permissions réelles > ce mandat de périmètre > cahier des charges V7 > documents historiques fournis en référence. Aucun document source ne doit autoriser un contournement des règles de sécurité.

## 2. Produit intégral à livrer

### A — Site commercial et conversion
- Design POLIVIA V5 validé comme référence de marque : direction artistique vert profond / ivoire, identité premium, responsive, micro-interactions Motion et accessibilité ; ne pas transformer le site en template SaaS banal.
- Pages marketing, offres et tarifs explicitement validés, audit gratuit réel et mesuré, avant/après honnête, démonstrations non mensongères, SEO et référencement local, analytics respectueux du consentement.
- Prospection consentie, capture de leads, demande de maquette, parcours « déjà engagé ailleurs », conversion et relances.

### B — Portail / studio IA / usine premium
- Authentification, rôles, isolation stricte par tenant, tableau de bord client, projets, briefing, médias, versions, validations, demandes de modifications et support.
- Éditeur visuel de type Puck après preuve de compatibilité ; composants réutilisables, typographies et mises en page métier personnalisées. Motion pour les animations utiles, 3D optionnelle si la performance n'en souffre pas.
- Audit de sites (performance, SEO, accessibilité et critères techniques), moteur de composition premium, génération contrôlée, prévisualisation, staging, QA indépendante, validation avant publication, DNS/domaine et rollback testé.
- Trois démonstrateurs métiers distincts (identités, structures, photos autorisées et textes originaux), dont un pilote complet en staging ; ne pas attribuer au logiciel de capacités IA non connectées.
- Découpler l'hébergement des sites publiés de Claude Code et de l'orchestrateur de production. Une panne des workers ne doit pas désactiver les sites live.

### C — CRM, facturation et revenus
- Conserver **Frappe CRM déjà installé**, mais **vérifier son instance réelle** et ses accès. Frappe gère les prospects, opportunités, relances et historique commercial de POLIVIA ; **ne pas confondre avec le CRM éventuellement proposé à chaque tenant**.
- Parcours devis/contrat, paiement **Stripe en mode TEST**, webhooks signés, traitement idempotent, souscriptions, changement d'offre, impayés, rapprochement et journal de preuves. Aucune facturation réelle avant approbation des tarifs, contrats et mentions légales.
- Intégrations facturation compatibles avec les obligations françaises, selon l'outil retenu et les dates applicables ; ne pas présumer qu'une API CRM vaut solution de facturation conforme.
- MRR, churn, coût IA, coût par site, hébergement, coût support, CAC, marge contributive et alertes budgétaires.

### D — Automatisation n8n
- **Réutiliser l'instance n8n existante si elle est bien accessible et si son isolation est démontrée**, sans réinitialiser ni modifier ses workflows actifs sans accord. Inventorier en lecture seule versions, authentification, workflows, erreurs, sauvegardes, schéma d'accès, secrets et ressources ; aucun secret dans les logs.
- Construire les automatisations périphériques : notifications, CRM follow-up, onboarding client, tickets, emails transactionnels, alertes SEO/monitoring, rapports, support et événements de gestion.
- **Ne pas utiliser n8n comme source de vérité** des commandes, contrats, abonnements, paiements, droits, versioning de sites ou permissions. Les opérations critiques restent dans une base transactionnelle et une file durable avec inbox/outbox, retries, idempotence et DLQ ; n8n les consomme par événements authentifiés lorsque pertinent.
- Vérifier les conditions de licence de n8n selon l'usage exact (interne, prestation pour clients, accès embarqué, revente) avant toute intégration commerciale ; ne pas qualifier automatiquement n8n de logiciel libre au sens OSI.
- Aucun webhook n8n ne reçoit de secret client brut ou de pouvoir d'administration globale. Protéger authentification, quotas, filtrage des événements et traçabilité.

### E — Exploitation et obligations
- RGPD et CNIL : minimisation, finalités, base légale, droits, rétention, sous-traitants, consentement traceurs, prospection, registre, clauses et DPA ; validation juridique humaine des documents finaux.
- SEO local + technique, Core Web Vitals, sitemap, robots, métadonnées, données structurées lorsque justifiées, contenu durable et suivi des changements de Google.
- Accessibilité (WCAG/RGAA selon applicabilité), QA Playwright/Lighthouse/axe-core, performance mobile, sécurité dépendances, secrets, backups/restores, monitoring/alerting, incident response et SLA réaliste.
- Infrastructure et déploiement : GitHub et Vercel existants, Supabase si retenu après examen, environnements dev/staging/prod séparés, CI/CD, permissions minimales, revue indépendante, logs structurés, rollback vérifié.
- Sélection raisonnée de plugins/skills/MCP et outils open source, avec registre version/licence/mainteneur/risque/intégration/tests. Installer uniquement les outils utiles réellement manquants ; éviter les doublons.

## 3. Méthode autonome sans répétition d'audit

1. Faire **un inventaire initial ciblé POLIVIA** en lecture seule, identifier le dépôt canonique et les environnements. Ne pas chercher ICOS. Ne pas écraser la configuration Claude ou les services existants.
2. Enregistrer la vérité technique vérifiée dans `docs/operations/PROJECT_STATE.md`, `INFRA_INVENTORY.md`, `TOOLS_REGISTRY.md`, `DECISIONS.md`, `WORK_LOG.md`, `NEXT_ACTIONS.md`, avec date, environnement, commit, preuve et niveau de confiance. Aucun secret.
3. À chaque reprise, lire l'état durable et l'historique Git puis faire seulement des vérifications différentielles motivées (versions, accès, modifications, incidents), sans recommencer l'audit global.
4. Décomposer le dossier V7 en lots dépendants ; 2 workers initialement, worktrees isolés, puis augmenter après mesure de la capacité ; PR et tests ciblés. Éviter les modifications concurrentes des mêmes fichiers.
5. Un constructeur ne signe pas sa propre revue : reviewer distinct, pipeline de contrôles et approbation humaine pour dépenses, données réelles, migrations/destructions, changements sensibles et déploiement public.
6. Développer des fonctionnalités réelles, pas seulement des plans ou maquettes. Ne pas marquer « prêt » si l’intégration dépend d’un mock. Fournir captures navigateur et tests fonctionnels vérifiables.
7. Pour chaque lot : fichiers et commit/PR, tests réellement exécutés, verdict, captures, coût, incidents, décisions, prochain lot. Si bloqué : isoler le blocage et poursuivre les tâches indépendantes autorisées.

## 4. Priorités d'exécution

P0 : dépôt canonique, baseline et sauvegardes, sécurité tenant, parcours audit → maquette → validation → Stripe TEST → usine → QA → staging, avec design V5.

P1 : CRM Frappe, facturation et portail client, automatisations n8n non critiques, monitoring, support, SEO et rapports financiers.

P2 : campagnes et prospection avancées, CRM client optionnel, SEO récurrent avancé, enrichissements IA, motion/3D supplémentaires et montée en charge.

Ces phases restent soumises aux dépendances effectives et aux contrôles de qualité. Ne jamais sacrifier les Gates de sécurité et de production pour réduire le délai.

## 5. Condition de réussite

Le scénario complet fonctionne en **staging** avec un prospect de test, une maquette premium modifiable, un tarif validé, un paiement **test**, une production de site, une QA indépendante, un domaine de démonstration, un CRM synchronisé et des notifications n8n opérationnelles. Tester également les pannes, doublons de webhooks, cross-tenant, reprise et rollback. Le passage en production publique est soumis à un GO explicite.

**Instruction finale à Claude :** Concentre 100 % de tes travaux sur POLIVIA. Tu n'as aucune tâche à réaliser dans ICOS pour cette phase. Exécute ce qui est autorisé, documente les preuves et ne redemande pas chaque jour de réauditer l'existant.
