# DIRECTIVE POUR CLAUDE CODE ULTRA — POLIVIA SITE FACTORY V8

Cette directive est **prioritaire** sur les instructions V7 contradictoires.

**Mission:** construire, intégrer, tester et rendre exploitable **POLIVIA, usine autonome de sites internet d'excellence**, en préservant le design V5 de la **marque POLIVIA** et en générant une identité sur mesure pour chaque site client. Je veux des sites utiles, performants, crédibles, accessibles, sécurisés, capables d'être découverts par les moteurs de recherche et de convertir des visiteurs, pas des maquettes décoratives.

**Périmètre actif:** site commercial POLIVIA, audit gratuit réel et honnête, formulaire de brief, génération contrôlée de maquettes, édition Puck si validée, workflow de validation, Site Factory, SEO technique/editorial/local et maillage, migration et indexabilité, référencement et suivi Search Console, conversion, consentement, sécurité, contrats, Stripe TEST, Frappe CRM interne, n8n pour automatisations non critiques, domaine/DNS, CI/CD, staging et production approuvée, monitoring, maintenance, support, FinOps, portabilité. **Pas de SaaS métier client pour l'instant. ICOS est hors périmètre.**

**Instruction de reprise:** lire `CLAUDE.md` et les journaux techniques déjà présents; vérifier les différences depuis le dernier commit et l'état connu, pas recommencer un audit général. La première reconnaissance est ciblée sur POLIVIA en lecture seule. Aucun secret, aucune migration production, aucun achat ni déploiement live sans accord.

**Exécution:** identifier le dépôt canonique ; faire un écart V7/V8 ; intégrer les contrôles et la matrice par site à la CI et à l'interface d'administration ; découper les lots en travaux isolés avec PR, tests et revue indépendante ; produire des vrais sites témoins (au moins trois métiers, trois directions artistiques) ; livrer un parcours E2E sandbox/staging ; poursuivre les travaux autorisés sans redemander des validations ordinaires.

**Contrat qualité:** chaque site possède une `SiteSpec` versionnée, une cartographie d'URLs, une stratégie SEO/intentions, une carte de maillage, une fiche entreprise vérifiée, une direction artistique validée, une preuve de délivrabilité des formulaires, des tests mobile/desktop, des preuves RGPD/mentions, une mesure de performances, un plan d'exploitation et un plan de rollback. **Tous les contrôles P0 applicables doivent être PASS**. `N/A` requiert une justification écrite et un reviewer. Les seuils de performance restent des objectifs mesurés avec environnement et méthodologie, pas des chiffres inventés.

**Règles anti-fausse promesse:** ne pas confondre page publiable, indexable et indexée ; aucun classement, position Google, citation IA, taux de conversion ni ROI garantis. Pas de faux avis, fausses photos de réalisations, photos de personnes sans droits, adresses fictives, pages de villes copiées ou textes générés en masse sans valeur ajoutée. La Search Console est liée au compte autorisé du propriétaire ; son absence doit être déclarée.

**Rôle de Frappe et n8n:** Frappe pilote **notre prospection**, pas la base centrale du SaaS ni le CRM vendu aux clients. n8n effectue les relances et synchronisations non critiques ; la base transactionnelle garde les commandes, droits, événements, paiements et versions. Ne jamais modifier des workflows n8n déjà actifs sans preuve, isolation et accord.

**Livrables pour chaque étape:** code/PR SHA ; tests réellement exécutés ; diff ; preuves machine et visuelles ; état de la matrice par site ; dette et risques ; coûts ; étapes restantes ; décision de release explicite. Ne jamais annoncer un site « complet » uniquement parce que l'HTML s'affiche.

**Tu dois maintenant exécuter, pas rédiger une nouvelle roadmap.** Analyse la différence V7/V8, prends les premiers tickets indépendants et démontre le chemin complet sur les environnements autorisés.
